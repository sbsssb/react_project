import React, { useState, useEffect } from 'react';
import TweetForm from './TweetForm';
import './Feed.css';

function Feed({ user }) {
  const [tweets, setTweets] = useState([]);
  const [modalImages, setModalImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 서버에서 트윗 불러오기
  const fetchTweets = async () => {
    try {
      const res = await fetch('http://localhost:3005/feed');
      const data = await res.json();
      setTweets(data.list);
    } catch (err) {
      console.error("피드 불러오기 실패:", err);
    }
  };

  // 트윗 삭제
const handleDelete = async (tweetId) => {
  if (!window.confirm("정말 삭제하시겠습니까?")) return;
  try {
    const res = await fetch(`http://localhost:3005/feed/${tweetId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      fetchTweets(); // 삭제 후 새로고침
    } else {
      console.error("삭제 실패");
    }
  } catch (err) {
    console.error("삭제 중 오류:", err);
  }
};

//리트윗
const handleRetweet = async (postId) => {
  const token = localStorage.getItem('token');
  console.log("🔑 토큰 확인:", token); // ← 이 줄 추가
  try {
    const res = await fetch("http://localhost:3005/feed/retweet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      credentials: 'include', // 이거 추가!
      body: JSON.stringify({ postId })
    });

    if (res.ok) {
      fetchTweets(); // 새로고침
    } else {
      const msg = await res.text();
      alert("리트윗 실패: " + msg);
    }
  } catch (err) {
    console.error("리트윗 오류:", err);
  }
};


  useEffect(() => {
    fetchTweets();
  }, []);

  // 이미지 모달 열기
  const openModal = (images, index) => {
    setModalImages(images);
    setCurrentIndex(index);
  };

  // 이미지 모달 닫기
  const closeModal = () => {
    setModalImages([]);
    setCurrentIndex(0);
  };

  // 이전 이미지
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);
  };

  // 다음 이미지
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % modalImages.length);
  };


  return (
    <div className="feed">
      <TweetForm onTweetSubmit={fetchTweets} user={user} />
      {tweets.map((tweet, index) => (
        <div key={index} className="tweet">
          <p>
            <strong>{tweet.retweeter ? tweet.retweeter + " (리트윗)" : tweet.username}</strong>
          </p>
          <p>{tweet.content}</p>


          {/* 이미지가 있을 경우 */}
          {tweet.images && tweet.images.length > 0 && (
            <div className="tweet-images">
              {tweet.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:3005/${img.imgPath}${img.imgName}`}
                  alt={`트윗 이미지 ${idx + 1}`}
                  onClick={() =>
                    openModal(
                      tweet.images.map((i) => `http://localhost:3005/${i.imgPath}${i.imgName}`),
                      idx
                    )
                  }
                />
              ))}
            </div>
          )}

          <p><small>{tweet.cdatetime}</small></p>

          <div className="tweet-actions">
            <button onClick={() => console.log("답글", tweet.id)}>💬 답글</button>
            <button onClick={() => handleRetweet(tweet.id)}>🔁 리트윗</button>
            <button onClick={() => console.log("인용", tweet.id)}>📝 인용</button>
            <button onClick={() => console.log("좋아요", tweet.id)}>❤️ 좋아요 ({tweet.likeCount || 0})</button>
             {/* 작성자 본인인 경우만 삭제 버튼 표시 */}
             {tweet.username === user.name && (
                <button onClick={() => handleDelete(tweet.id)}>🗑 삭제</button>
              )}
          
          </div>
        </div>
      ))}

      {/* 이미지 모달 */}
      {modalImages.length > 0 && (
        <div className="image-modal">
          <button className="close-button" onClick={closeModal}>×</button>

          {/* 좌우 버튼은 이미지가 2장 이상일 때만 표시 */}
          {modalImages.length > 1 && (
            <>
              <button className="prev-button" onClick={handlePrev}>‹</button>
              <button className="next-button" onClick={handleNext}>›</button>
            </>
          )}

          <div className="image-container">
            <img
              src={modalImages[currentIndex]}
              alt="확대 이미지"
              className="modal-image"
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default Feed;
