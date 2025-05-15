import React, { useState } from 'react';
import ChatRoomList from './ChatRoomList';
import ChatRoom from './ChatRoom';

const ChatPage = ({ user }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <ChatRoomList userId={user.email} onSelectRoom={setSelectedRoom} />
      {selectedRoom ? (
        <ChatRoom room={selectedRoom} userId={user.email} />
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          채팅방을 선택하세요.
        </div>
      )}
    </div>
  );
};

export default ChatPage;
