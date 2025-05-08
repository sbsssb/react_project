import React, { useState } from 'react';
import './TweetForm.css';

function TweetForm({ onTweetSubmit, user }) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length <= 4) {
      setImages((prev) => [...prev, ...files]);
    } else {
      alert('최대 4개의 이미지만 업로드할 수 있습니다.');
    }
  };

  const handleImageRemove = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const uploadImages = async (feedId) => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('file', image);
    });
    formData.append('feedId', feedId);

    try {
      const response = await fetch('http://localhost:3005/feed/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('이미지 업로드 실패');

      const result = await response.json();
      console.log('이미지 업로드 결과:', result);
    } catch (err) {
      console.error('이미지 업로드 중 오류:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim()) {
      try {
        const response = await fetch('http://localhost:3005/feed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            content,
          }),
        });

        if (!response.ok) throw new Error('게시글 등록 실패');

        const result = await response.json();
        const feedId = result.result.insertId;
        console.log('등록된 feedId:', feedId);

        if (images.length > 0) {
          await uploadImages(feedId);
        }

        // 폼 초기화 및 피드 다시 불러오기
        setContent('');
        setImages([]);
        onTweetSubmit(); // fetchTweets 호출
      } catch (error) {
        console.error('트윗 등록 중 에러:', error);
      }
    }
  };

  return (
    <form className="tweet-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용을 입력하세요"
        rows="3"
      />

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />

      <div className="image-preview">
        {images.map((image, index) => (
          <div key={index} className="image-thumbnail">
            <img src={URL.createObjectURL(image)} alt={`preview-${index}`} />
            <button type="button" onClick={() => handleImageRemove(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <button type="submit">작성</button>
    </form>
  );
}

export default TweetForm;
