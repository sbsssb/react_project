import React from 'react';
import {
  Drawer, List, ListItem, ListItemText, Typography,
  Toolbar, ListItemIcon, Divider, Box
} from '@mui/material';
import { Home, Add, AccountCircle, Login as LoginIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
  const drawerWidth = 220;
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token'); // 토큰으로 로그인 여부 확인

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
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          MySNS
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/feed" sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
          <ListItemIcon>
            <Home sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          <ListItemText primary="피드" />
        </ListItem>

        <ListItem button component={Link} to="/register" sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
          <ListItemIcon>
            <Add sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          <ListItemText primary="등록" />
        </ListItem>

        <ListItem button component={Link} to="/mypage" sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
          <ListItemIcon>
            <AccountCircle sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          <ListItemText primary="마이페이지" />
        </ListItem>

        {isLoggedIn ? (
          <ListItem button onClick={handleLogout} sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: '#1976d2' }} />
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
