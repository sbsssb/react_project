import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './ChatRoom.css';
import useNotificationStore from '../store/notificationStore';
import { useWebSocket } from '../WebSocketContext';

const ChatRoom = ({ user }) => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socket = useWebSocket();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const lastMessageId = useRef(null);  // 마지막 메시지 ID 저장
  const bottomRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const { resetUnreadCountByRoom } = useNotificationStore();

  const [info, setInfo] = useState({ username: "", email: "", bio: "", profileImg: "" });
    const [loading, setLoading] = useState(true);

  const fnUserInfo = () => {
    const emailToFetch = user.email;
    if (!emailToFetch) return;

    fetch(`http://localhost:3005/member/${emailToFetch}`)
      .then(res => res.json())
      .then(data => {
        setInfo(data.info);
      })
      .catch(() => setLoading(false));
  };

  // 채팅방 정보와 WebSocket 연결
  useEffect(() => {
    if (!roomId) return;

    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ joinRoomId: roomId }));
    }

    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:3005/chat/room/${roomId}`);
        const data = await res.json();

        if (data.success) {
          setRoom(data.room);
        } else {
          alert(data.message || '방 정보를 불러오지 못했습니다.');
        }
      } catch (err) {
        console.error('방 정보 가져오기 실패:', err);
      }
    };

    fetchRoom();
    fnUserInfo();
    loadMessages();
    
  }, [roomId, socket]);

  // 메시지 불러오기
  const loadMessages = async () => {
  if (isLoading) return;
  setIsLoading(true);
  console.log('🟨 [loadMessages] 요청 시작. lastMessageId:', lastMessageId.current);

  try {
    const response = await fetch(`http://localhost:3005/chat/room/${roomId}/messages?lastMessageId=${lastMessageId.current}&limit=20`);
    const data = await response.json();

    console.log('🟩 [loadMessages] 응답 데이터:', data);

    if (data.success) {
      const newMessages = data.messages;
      if (newMessages.length > 0) {
        setMessages((prevMessages) => [...newMessages, ...prevMessages]);
        lastMessageId.current = newMessages[0].id;
        console.log('✅ 새로운 메시지 추가됨, 마지막 ID:', lastMessageId.current);
      } else {
        console.log('🟦 새로운 메시지 없음');
      }
    } else {
      console.error('❌ 메시지 로드 실패:', data.message);
    }
  } catch (error) {
    console.error('❌ 메시지 불러오기 오류:', error);
  } finally {
    setIsLoading(false);
  }
};

  // 스크롤 이벤트 처리
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !isLoading) {
      loadMessages();
    }
  };

  // 메시지가 추가될 때 스크롤을 맨 아래로 내리는 효과
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 메시지 보내기
  const sendMessage = () => {
    if (!input.trim()) return;

    const message = {
      type: 'chat',
      roomId,
      sender_id: user?.email,
      message: input,
      username: user?.name
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput('');
    }
  };

  useEffect(() => {
    if (user?.email && roomId) {
      fetch('http://localhost:3005/chat/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.email,
          roomId: roomId,
        }),
      })
        .then(res => {
          if (!res.ok) throw new Error('읽음 처리 실패');
          console.log('✅ 읽음 처리 완료');
          resetUnreadCountByRoom(roomId); // 인자와 함수명 수정
        })
        .catch(err => console.error('❌ 읽음 처리 에러:', err));
    }
  }, [roomId, user?.email]);

//   useEffect(() => {
//   if (!socket) return;

//   socket.onmessage = (event) => {
//     try {
//       const newMessage = JSON.parse(event.data);
//       console.log('📥 새 메시지 수신:', newMessage);

//       // 현재 채팅방의 메시지만 처리
//       if (newMessage.roomId === roomId) {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);

//         // 메시지 수신 시 스크롤을 아래로 이동
//         if (bottomRef.current) {
//           bottomRef.current.scrollIntoView({ behavior: 'smooth' });
//         }
//       }
//     } catch (error) {
//       console.error('❌ 메시지 파싱 에러:', error);
//     }
//   };
// }, [socket, roomId]);



  return (
    <div className="chat-room">
      <header className="chat-header">
        <h4>{room?.is_group ? room.name : '1:1 채팅'}</h4>
      </header>
      
      <div
        className="messages"
        style={{ height: '400px', overflowY: 'auto' }}
        onScroll={handleScroll}  // 스크롤 이벤트 추가
      >
        {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender_id === user?.email ? 'mine' : 'other'}`}>
            <div className="message-header">
                <span>{msg.username}</span>
            </div>
            <div className="message-body">{msg.message}</div>
            </div>
        ))}
        <div ref={bottomRef} />
      </div>
      
      {isLoading && <div className="loading">Loading...</div>}
      
      <div className="input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="메시지 입력..."
        />
        <button onClick={sendMessage} className="send-button">전송</button>
      </div>
    </div>
  );
};

export default ChatRoom;
