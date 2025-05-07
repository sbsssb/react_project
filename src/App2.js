import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TweetForm from './components/TweetForm';
import TweetItem from './components/TweetItem';
import Feed from './components/Feed';
import Join from './components/Join';
import Login from './components/Login';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/join' || location.pathname === '/';

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      {<Sidebar />} {/* 로그인과 회원가입 페이지가 아닐 때만 Menu 렌더링 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/feed" element={<Feed />} />
          <Route path="/tweetform" element={<TweetForm />} />
          <Route path="/tweetitem" element={<TweetItem />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
