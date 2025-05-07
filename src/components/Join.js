import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Input } from '@mui/material';
import { Link } from 'react-router-dom';

function Join() {
  const [profileImage, setProfileImage] = useState(null);

  // 이미지 파일이 선택될 때 호출되는 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // 미리보기 이미지 설정
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
        <TextField label="Username" variant="outlined" margin="normal" fullWidth />
        <TextField label="Email" variant="outlined" margin="normal" fullWidth />
        <TextField
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
        />

        {/* 프로필 선택 텍스트와 파일 업로드 */}
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          프로필 선택
        </Typography>
        <Input
          type="file"
          onChange={handleImageChange}
          inputProps={{ accept: 'image/*' }}
          fullWidth
          style={{ marginTop: '10px' }}
        />
        {profileImage && (
          <Box
            component="img"
            src={profileImage}
            alt="Profile Preview"
            sx={{ width: 100, height: 100, borderRadius: '50%', marginTop: '10px' }}
          />
        )}

        <Button variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
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
