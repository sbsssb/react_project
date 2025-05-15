import React, { useEffect, useState } from 'react';
import {
  Drawer, List, ListItem, ListItemText, Typography,
  Toolbar, ListItemIcon, Divider, Box, Badge
} from '@mui/material';
import { Home, Add, AccountCircle, Login as LoginIcon, Logout as LogoutIcon, Send, PeopleAlt } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useNotificationStore from '../store/notificationStore';
import { useWebSocket } from '../WebSocketContext';


function Sidebar() {
  const drawerWidth = 270;
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem('token'); // 토큰으로 로그인 여부 확인

  const userId = localStorage.getItem('email');
  const [socket, setSocket] = useState(null);

  const { fetchUnreadCounts, increaseUnreadByRoom, totalUnreadCount } = useNotificationStore();
  const ws = useWebSocket();

useEffect(() => {
  if (!userId) return;
  fetchUnreadCounts(userId);
}, [userId]);

useEffect(() => {
  if (!ws || !userId) return;

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === 'NEW_MESSAGE') {
      const isRead = message.read_by?.includes(userId);
      const roomId = message.room_id;

      if (!isRead && message.sender_id !== userId) {
        increaseUnreadByRoom(roomId);
      }
    }
  };
}, [ws, userId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f9f9f9',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ padding: '1.5rem 1rem' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000000' }}>
          SNS
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/feed" sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
          <ListItemIcon>
            <Home sx={{ color: '#000000' }} />
          </ListItemIcon>
          <ListItemText primary="피드" />
        </ListItem>

        <ListItem button component={Link} to="/followfeed" sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
          <ListItemIcon>
            <PeopleAlt sx={{ color: '#000000' }} />
          </ListItemIcon>
          <ListItemText primary="팔로우 중" />
        </ListItem>

        <ListItem button component={Link} to="chatList" sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
          <ListItemIcon>
            <Badge badgeContent={totalUnreadCount} color="error" max={99}>
              <Send sx={{ color: '#000000' }} />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="메시지" />
        </ListItem>

        <ListItem button component={Link} to={`/mypage/${userId}`} sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
          <ListItemIcon>
            <AccountCircle sx={{ color: '#000000' }} />
          </ListItemIcon>
          <ListItemText primary="마이페이지" />
        </ListItem>

        {isLoggedIn ? (
          <ListItem button onClick={handleLogout} sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: '#000000' }} />
            </ListItemIcon>
            <ListItemText primary="로그아웃" />
          </ListItem>
        ) : (
          <ListItem button component={Link} to="/login" sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
            <ListItemIcon>
              <LoginIcon sx={{ color: '#1976d2' }} />
            </ListItemIcon>
            <ListItemText primary="로그인" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
}

export default Sidebar;
