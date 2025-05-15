import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TweetForm from './components/TweetForm';
import TweetItem from './components/TweetItem';
import Feed from './components/Feed';
import Join from './components/Join';
import Login from './components/Login';
import MyPage from './components/MyPage';
import ChatPage from './components/ChatPage';
import ChatRoom from './components/ChatRoom'; 
import { jwtDecode } from 'jwt-decode';
import ChatRoomList from './components/ChatRoomList';
import { WebSocketProvider } from './WebSocketContext';
import FollowFeed from './components/FollowFeed';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/join' || location.pathname === '/';
  const [user, setUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded);
        setUser({
          email: decoded.sessionEmail,
          name : decoded.sessionName
        });
      } catch (e) {
        console.error("Invalid token");
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {!isAuthPage && <Header />}
      {!isAuthPage && <Sidebar user={user} />}  {/* 알림 수 props로 내려줄 수도 있음 */}
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* WebSocketProvider로 감싸기 */}
        <WebSocketProvider userId={user?.email}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/feed" element={user ? <Feed user={user} /> : <div>Loading...</div>} />
            <Route path="/followfeed" element={user ? <FollowFeed user={user} /> : <div>Loading...</div>} />
            <Route path="/tweetform" element={user ? <TweetForm user={user} /> : <div>Loading...</div>} />
            <Route path="/tweetitem" element={<TweetItem />} />
            <Route path="/join" element={<Join />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mypage" element={<MyPage user={user} />} />
            <Route path="/mypage/:userId" element={<MyPage user={user} />} />
            <Route path="/chat" element={user ? <ChatPage user={user} /> : <div>Loading...</div>} />
            <Route path="/chat/:roomId" element={user ? <ChatRoom user={user} /> : <div>Loading...</div>} />
            <Route path="/chatList" element={<ChatRoomList user={user} />} />
          </Routes>
        </WebSocketProvider>
      </Box>
    </Box>
  );
}

export default App;
