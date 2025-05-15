import React, { useState, useEffect } from 'react';
import TweetForm from './TweetForm';
import './Feed.css';
import { Link } from 'react-router-dom';

function FollowFeed() {
  const [tweets, setTweets] = useState([]);
  const [modalImages, setModalImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [email, setEmail] = useState(null); // 이메일 상태 추가
  const [selectedTweet, setSelectedTweet] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState("");

  const [showSubreplyForms, setShowSubreplyForms] = useState({});
  const [subreplyInputs, setSubreplyInputs] = useState({});




  // 서버에서 트윗 불러오기
  const fetchTweets = async () => {
  try {
    const emailFromStorage = localStorage.getItem("email");
    if (!emailFromStorage) {
      console.error("이메일이 localStorage에 없습니다.");
      return;
    }

    setEmail(emailFromStorage); // 이메일 상태 설정
    console.log("현재 이메일:", emailFromStorage);

    const res = await fetch(`http://localhost:3005/feed/followfeed?email=${emailFromStorage}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      setTweets(data.list);  // 새 데이터 설정
    } else {
      console.error("트윗 불러오기 실패:", res.statusText);
    }
  } catch (err) {
    console.error("피드 불러오기 실패:", err);
  } finally {
    setLoading(false); // 로딩 끝
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

  // 리트윗
  const handleRetweet = async (postId) => {
    try {
      const res = await fetch("http://localhost:3005/feed/retweet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: email, postId }),
      });

      if (res.ok) {
        fetchTweets();
      } else {
        console.error("리트윗 실패");
      }
    } catch (err) {
      console.error("리트윗 오류:", err);
    }
  };

  // 좋아요
  const handleLike = async (postId) => {
    try {
      const res = await fetch("http://localhost:3005/feed/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: email, postId }),
      });
      if (res.ok) {
        fetchTweets();
      } else {
        console.error("좋아요 오류:", res.statusText);
      }
    } catch (err) {
      console.error("좋아요 오류:", err);
    }
  };

  // 답글 모달
  const openTweetModal = async (tweet) => {
    setSelectedTweet(tweet);

    try {
      const res = await fetch(`http://localhost:3005/feed/${tweet.id}/replies`);
      if (res.ok) {
        const data = await res.json();
        setReplies(data.list);
      } else {
        console.error("댓글 불러오기 실패");
      }
    } catch (err) {
      console.error("댓글 오류:", err);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;

    try {
      const res = await fetch("http://localhost:3005/feed/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: email,
          tweetId: selectedTweet.id,
          content: replyContent
        })
      });

      if (res.ok) {
        setReplyContent("");
        openTweetModal(selectedTweet); // 다시 댓글 목록 불러오기
      } else {
        console.error("답글 등록 실패");
      }
    } catch (err) {
      console.error("답글 등록 중 오류:", err);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`http://localhost:3005/feed/reply/${replyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // 삭제 성공 시 댓글 목록 새로고침
        setReplies((prevReplies) => prevReplies.filter((r) => r.replyId !== replyId));
      } else {
        console.error("삭제 실패");
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 에러:", error);
      alert("오류가 발생했습니다.");
    }
  };

  // 대댓글
  // 대댓글 입력 폼 토글
  const toggleSubreplyForm = (replyId) => {
    setShowSubreplyForms((prev) => ({
      ...prev,
      [replyId]: !prev[replyId]
    }));
  };

  // 대댓글 입력 값 변경 핸들러
  const handleSubreplyTextChange = (replyId, value) => {
    setSubreplyInputs((prev) => ({
      ...prev,
      [replyId]: value
    }));
  };

  // 대댓글 제출 핸들러
  const handleSubreplySubmit = async (e, replyId) => {
    e.preventDefault();
    const content = subreplyInputs[replyId];

    if (!content?.trim()) return;

    try {
      const res = await fetch(`http://localhost:3005/feed/${replyId}/sub`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: email, content })
      });

      if (res.ok) {
        const data = await res.json();
        // 대댓글 목록 갱신
        setReplies((prev) =>
          prev.map((r) =>
            r.replyId === replyId
              ? { ...r, subreplies: data.subReplies }
              : r
          )
        );
        setSubreplyInputs((prev) => ({ ...prev, [replyId]: "" }));
        setShowSubreplyForms((prev) => ({ ...prev, [replyId]: false }));
      } else {
        console.error("대댓글 등록 실패");
      }
    } catch (err) {
      console.error("대댓글 등록 중 오류:", err);
    }
  };

//대댓글 삭제
  const handleDeleteSubreply = async (subreplyId, replyId) => {
    if (!window.confirm("대댓글을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`http://localhost:3005/feed/subreply/${subreplyId}?replyId=${replyId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        const data = await res.json();
        console.log("서버 응답 받은 데이터:", data);
        // 대댓글 목록 갱신
        setReplies((prev) =>
          prev.map((r) =>
            r.replyId === replyId
              ? { ...r, subreplies: data.subReplies }  // 서버 응답에 맞게 갱신
              : r
          )
        );
        setSubreplyInputs((prev) => ({ ...prev, [replyId]: "" }));
        setShowSubreplyForms((prev) => ({ ...prev, [replyId]: false }));
      } else {
        alert("대댓글 삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("대댓글 삭제 오류:", err);
    }
  };





  // 페이지 처음 로딩 시 트윗 불러오기
  useEffect(() => {
    fetchTweets();
  }, []); // 빈 배열로 컴포넌트 마운트 시 한 번만 실행

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
      <TweetForm onTweetSubmit={fetchTweets} user={{ email }} />
      
      {loading ? ( // 로딩 중 표시
        <p>Loading...</p>
      ) : (
        tweets.map((tweet, index) => (
          <div key={index} className="tweet" onClick={() => openTweetModal(tweet)}>
            <p className="tweet-header2">
              {/* 리트윗한 사람 표시 */}
              {tweet.retweeter && tweet.retweeterId && (
                <Link to={`/mypage/${tweet.retweeterId}`} className="profile-section retweeter-info">
                  <img
                    src={`http://localhost:3005/${tweet.retweeterProfileImg}`}
                    alt="리트윗한 사람 프로필"
                    className="profile-image2"
                  />
                  <span>{tweet.retweeter} 님이 리트윗함</span>
                </Link>
              )}

              {/* 원래 트윗 작성자 표시 */}
              <Link to={`/mypage/${tweet.userId}`} className="profile-section author-info">
                <img
                  src={`http://localhost:3005/${tweet.profileImg}`}
                  alt="작성자 프로필"
                  className="profile-image"
                />
                <span>{tweet.username}</span>
              </Link>
            </p>

            <p>{tweet.retweetContent || tweet.content}</p>

            {/* 이미지가 있을 경우 */}
            {tweet.images && tweet.images.length > 0 && (
              <div className="tweet-images">
                {tweet.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:3005/${img.imgPath}${img.imgName}`}
                    alt={`트윗 이미지 ${idx + 1}`}
                    onClick={(e) => {
                      openModal(
                        tweet.images.map((i) => `http://localhost:3005/${i.imgPath}${i.imgName}`),
                        idx
                      );
                      e.stopPropagation();
                    }}
                  />
                ))}
              </div>
            )}

            <p><small>{tweet.cdatetime}</small></p>

            <div className="tweet-actions">
              <button onClick={() => console.log("답글", tweet.id)}>💬 답글</button>

              {/* 리트윗 버튼 */}
              <button onClick={(e) => {
                e.stopPropagation();
                handleRetweet(tweet.id);
              }}>
                🔁 리트윗 ({tweet.retweetCount || 0}) {tweet.retweetedByMe && '✔️'}
              </button>

              {/* 좋아요 버튼 */}
              <button onClick={(e) => {
                e.stopPropagation();
                handleLike(tweet.id);
              }}>
                ❤️ 좋아요 ({tweet.likeCount || 0}) {tweet.likedByMe && '✔️'}
              </button>

              {/* 작성자 본인인 경우만 삭제 버튼 표시 */}
              {tweet.userId === email && (
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(tweet.id);
                }}>🗑 삭제</button>
              )}
            </div>
          </div>
        ))
      )}

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

      {selectedTweet && (
        <div className="modal2">
          <div className="modal-header">
            {/* 원래 트윗 작성자 표시 */}
              <Link to={`/mypage/${selectedTweet.userId}`} className="profile-section author-info">
                <img
                  src={`http://localhost:3005/${selectedTweet.profileImg}`}
                  alt="작성자 프로필"
                  className="profile-image"
                />
                <span>{selectedTweet.username}</span>
              </Link>
            <button className="modal-close" onClick={() => setSelectedTweet(null)}>×</button>
          </div>

          <div className="modal-content">
            <p>{selectedTweet.retweetContent || selectedTweet.content}</p>

            {selectedTweet.images && selectedTweet.images.length > 0 && (
              <div className="tweet-images">
                {selectedTweet.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:3005/${img.imgPath}${img.imgName}`}
                    alt={`트윗 이미지 ${idx + 1}`}
                    className="modal-image-preview"
                    onClick={() =>
                      openModal(
                        selectedTweet.images.map((i) => `http://localhost:3005/${i.imgPath}${i.imgName}`),
                        idx
                      )
                    }
                  />
                ))}
              </div>
            )}

            <textarea
              className="reply-input"
              placeholder="답글을 입력하세요"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <button className="reply-button" onClick={handleReplySubmit}>답글 작성</button>

            <div className="tweet-comment-list">
              {replies.length > 0 ? (
                replies.map((reply, idx) => (
                  <div key={idx} className="tweet-comment-item">
                    <img
                      src={`http://localhost:3005/${reply.profileImg}`}
                      alt="profile"
                      className="tweet-comment-profile"
                    />
                    <div className="tweet-comment-body">
                      <div className="tweet-comment-header">
                        <span className="tweet-comment-username">{reply.username}</span>
                        <span className="tweet-comment-date">
                          {new Date(reply.cdatetime).toLocaleString()}
                        </span>
                        {reply.userId === email && (
                          <button
                            className="tweet-comment-delete-btn"
                            onClick={() => handleDeleteReply(reply.replyId)}
                          >
                            삭제
                          </button>
                        )}
                      </div>
                      <div className="tweet-comment-content">{reply.content}</div>

                      <div className="tweet-comment-actions">
                        <button
                          className="tweet-comment-reply-btn"
                          onClick={() => toggleSubreplyForm(reply.replyId)}
                        >
                          ↩ 대댓글
                        </button>
                      </div>

                      {showSubreplyForms[reply.replyId] && (
                        <form onSubmit={(e) => handleSubreplySubmit(e, reply.replyId)} className="tweet-subreply-form">
                          <input
                            type="text"
                            placeholder="대댓글을 입력하세요"
                            value={subreplyInputs[reply.replyId] || ""}
                            onChange={(e) => handleSubreplyTextChange(reply.replyId, e.target.value)}
                          />
                          <button type="submit">등록</button>
                        </form>
                      )}


                      {reply.subreplies.map((sub) => (
                        <div key={sub.subreplyId} style={{ display: 'flex', marginTop: '8px', marginLeft: '20px' }}>
                          {/* 프로필 이미지 */}
                          <img
                            src={`http://localhost:3005/${reply.profileImg}`}
                            alt="프로필"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              marginRight: "8px"
                            }}
                          />

                          {/* 내용 영역 */}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <strong>{sub.username}</strong>
                              <span style={{ color: "#888", fontSize: "12px" }}>
                                {new Date(sub.cdatetime).toLocaleString("ko-KR")}
                              </span>
                              {/* 삭제 버튼 */}
                              {sub.userId === email && (
                                <button
                                  onClick={() => handleDeleteSubreply(sub.subreplyId, sub.replyId)}
                                  style={{
                                    
                                    background: "none",
                                    border: "none",
                                    color: "#888",
                                    fontSize: "12px",
                                    cursor: "pointer"
                                  }}
                                >
                                  삭제
                                </button>
                              )}
                            </div>
                            <div style={{ marginTop: "4px" }}>{sub.content}</div>
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                ))
              ) : (
                <p className="no-replies">답글이 없습니다.</p>
              )}
            </div>



          </div>
        </div>
      )}

    </div>
  );
}

export default FollowFeed;
