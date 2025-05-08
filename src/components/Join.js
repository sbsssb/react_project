import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Input
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Join() {
  const [profileImage, setProfileImage] = useState(null);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    email: '',
    password: '',
    userName: '',
    phone: '',
  });

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file); // 파일 저장
      setProfileImage(URL.createObjectURL(file)); // 미리보기 이미지 설정
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      for (let key in form) {
        formData.append(key, form[key]);
      }
      if (file) {
        formData.append('file', file);
      }

      await axios.post('http://localhost:3005/member/join', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('회원가입 성공!');
      navigate('/login');
    } catch (err) {
      console.error('회원가입 실패:', err);
      alert('에러 발생');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          회원가입
        </Typography>
        <TextField label="Email" name="email" onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Password" name="password" type="password" onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Username" name="userName" onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Phone" name="phone" onChange={handleChange} fullWidth margin="normal" />

        <Typography variant="body1" style={{ marginTop: '20px' }}>
          프로필 선택
        </Typography>
        <Input type="file" onChange={handleImageChange} inputProps={{ accept: 'image/*' }} fullWidth />
        {profileImage && (
          <Box
            component="img"
            src={profileImage}
            alt="Profile Preview"
            sx={{ width: 100, height: 100, borderRadius: '50%', marginTop: '10px' }}
          />
        )}

        <Button variant="contained" onClick={handleSubmit} fullWidth style={{ marginTop: '20px' }}>
          회원가입
        </Button>
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          이미 회원이라면? <Link to="/login">로그인</Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Join;
