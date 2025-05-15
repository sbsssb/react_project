import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Link,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    fetch("http://localhost:3005/member", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({ email: userId, password: password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("email", userId);
          console.log("Email in LocalStorage:", localStorage.getItem("email"));
          navigate("/feed");
        } else {
          setDialogMessage(data.message);
          setDialogOpen(true);
        }
      });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
      }}
    >
      {/* 왼쪽 환영 메시지 */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: 4,
          backgroundColor: '#000000',
          height: '100%',
        }}
      >
        <Typography variant="h3" fontWeight="bold" color='white' gutterBottom>
          Welcome Back!
        </Typography>
        <Typography variant="h6" color="white" textAlign="center">
          SNS에 오신 것을 환영합니다.<br />
          소셜 피드를 확인하고 친구들과 소통하세요!
        </Typography>
      </Box>

      {/* 오른쪽 로그인 폼 */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ p: 4, width: '100%', maxWidth: 400, m: 4 }}>
          <Typography variant="h5" textAlign="center" gutterBottom>
            로그인
          </Typography>

          <Box component="form" noValidate autoComplete="off">
            <Stack spacing={3}>
              <TextField
                label="이메일"
                type="text"
                fullWidth
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <TextField
                label="비밀번호"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleLogin}
                sx={{ backgroundColor: 'black', '&:hover': { backgroundColor: '#333' } }}
              >
                로그인
              </Button>
            </Stack>
          </Box>

          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Link href="/join" variant="body2">회원가입</Link>
            <Link href="#" variant="body2">비밀번호 찾기</Link>
          </Stack>
        </Card>
      </Box>

      {/* 로그인 결과 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>알림</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>확인</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Login;
