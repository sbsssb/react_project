import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ userId, children }) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const socket = new WebSocket('ws://localhost:3005');
    setWs(socket);

    socket.onopen = () => {
      console.log('🔗 WebSocket 연결됨 (공용)');
    };

    socket.onerror = (err) => {
      console.error('🚨 WebSocket 에러:', err);
    };

    socket.onclose = () => {
      console.log('❌ WebSocket 종료');
    };

    return () => socket.close();
  }, [userId]);

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
