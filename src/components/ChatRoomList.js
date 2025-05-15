import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../store/notificationStore';
import { Badge } from '@mui/material';

function ChatRoomList({ user }) {
  const userId = user?.email;
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Zustand에서 방별 미읽음 개수와 전체 미읽음 개수를 관리하는 액션 함수
  const unreadByRoom = useNotificationStore(state => state.unreadByRoom);
  const setUnreadByRoom = useNotificationStore(state => state.setUnreadByRoom);
  const resetUnreadCountByRoom = useNotificationStore(state => state.resetUnreadCountByRoom);
  const fetchUnreadCounts = useNotificationStore(state => state.fetchUnreadCounts);

  // 채팅방 목록 불러오기
  useEffect(() => {
    if (!userId) return;

    const fetchChatRooms = async () => {
      try {
        const res = await fetch(`http://localhost:3005/chat/rooms/${userId}`);
        const data = await res.json();

        if (!data.success) throw new Error('채팅방 불러오기 실패');

        setChatRooms(data.rooms);
      } catch (err) {
        console.error('채팅방 목록 불러오기 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, [userId]);

  // 서버에서 방별 미읽음 개수 가져오기 (초기 세팅)
  useEffect(() => {
    if (!userId) return;
  console.log('컴포넌트 useEffect: fetchUnreadCounts 호출 전');
  fetchUnreadCounts(userId);
  console.log('컴포넌트 useEffect: fetchUnreadCounts 호출 후');
  }, [userId, fetchUnreadCounts]);

  // 채팅방 클릭 시 읽음 처리 후 상태 업데이트 및 이동
  const handleClickRoom = async (roomId) => {
    try {
      // 읽음 처리 API 호출
      await fetch('http://localhost:3005/chat/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, roomId }),
      });

      // 해당 방 미읽음 0으로 초기화 (Zustand 상태 업데이트)
      resetUnreadCountByRoom(roomId);

      // 필요 시 전체 미읽음 개수 다시 불러오기 (동기화)
      await fetchUnreadCounts(userId);

      // 채팅방으로 이동
      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error('읽음 처리 실패:', err);
    }
  };

  if (loading) return <div>채팅방 목록을 불러오는 중입니다...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{user?.name}님의 채팅방</h2>

      {chatRooms.length === 0 ? (
        <p>참여 중인 채팅방이 없습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {chatRooms.map((room) => {
            const unreadCount = unreadByRoom[String(room.roomId)] || 0;

            return (
              <li
                key={room.roomId}
                onClick={() => handleClickRoom(room.roomId)}
                style={{
                  padding: '12px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  backgroundColor: '#f9f9f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div className="chat-room-item">
                  <span className="chat-room-name">
                    {room.is_group ? room.name : room.otherUsername || '(이름 없음)'}
                  </span>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    생성일: {new Date(room.created_at).toLocaleString()}
                  </div>
                </div>

                {unreadCount > 0 && (
                  <Badge color="error" badgeContent={unreadCount} max={99} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default ChatRoomList;
