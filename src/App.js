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
import { jwtDecode } from 'jwt-decode';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/join' || location.pathname === '/';
  const [user, setUser] = useState(null);
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
      <Header />
      {!isAuthPage && <Sidebar />}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/feed" element={user ? <Feed user={user} /> : <div>Loading...</div>} />

          <Route path="/tweetform" element={user ? <TweetForm user={user} /> : <div>Loading...</div>} />

          <Route path="/tweetitem" element={<TweetItem />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
