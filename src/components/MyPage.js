import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';
import './MyPage.css';
import TweetForm from './TweetForm';

const MyPage = ({ user }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [info, setInfo] = useState({ username: "", email: "", bio: "", profileImg: "" });
  const [activeTab, setActiveTab] = useState('tweets');
  const [tweets, setTweets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('followers'); // 모달 내용 상태 추가 (팔로워 / 팔로잉)
  const [editData, setEditData] = useState({ username: "", bio: "", profileImg: null });
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followers, setFollowers] = useState([]); // 팔로워 목록
  const [followings, setFollowings] = useState([]); // 팔로잉 목록
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [modalImages, setModalImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedTweet, setSelectedTweet] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState("");

  const [showSubreplyForms, setShowSubreplyForms] = useState({});
  const [subreplyInputs, setSubreplyInputs] = useState({});
  

  const token = localStorage.getItem("token");

  const isMyProfile = !userId || (user && user.email === userId);

   // 서버에서 내 트윗 불러오기
  const fetchTweets = async (userId) => {
    
    try {

      const res = await fetch(`http://localhost:3005/feed/user/${userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTweets(data.tweets);  // 내 트윗 데이터 설정
        setEmail(userId);
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
      const res = await fetch(`http://localhost:3005/feed/delete/${tweetId}`, {
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

  const fnUserInfo = () => {
    const emailToFetch = userId || (user && user.email);
    if (!emailToFetch) return;

    fetch(`http://localhost:3005/member/${emailToFetch}`)
      .then(res => res.json())
      .then(data => {
        setInfo(data.info);
        if (isMyProfile) {
          setEditData({
            username: data.info.username,
            bio: data.info.bio,
            profileImg: null,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fnFollow = () => {
    if (isFollowing) {
      fetch(`http://localhost:3005/follow/unfollow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user && user.email, targetId: userId }),
      }).then(response => response.json())
        .then(data => {
          setIsFollowing(false);
          setFollowersCount(prev => prev - 1);
        })
        .catch(err => console.error(err));
    } else {
      fetch(`http://localhost:3005/follow/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user && user.email, targetId: userId }),
      }).then(response => response.json())
        .then(data => {
          setIsFollowing(true);
          setFollowersCount(prev => prev + 1);
        })
        .catch(err => console.error(err));
    }
  };

  // 답글 모달
  const openTweetModal = async (tweet) => {
    setSelectedTweet(tweet);
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;

    try {
      const res = await fetch("http://localhost:3005/feed/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          tweetId: selectedTweet.postId,
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
        body: JSON.stringify({ userId: userId, content })
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
  

 useEffect(() => {
    if (user) {
      fnUserInfo();
      fetchTweets(userId);

      const currentUserId = userId || user.email;

      fetch(`http://localhost:3005/follow/isFollowing?userId=${user.email}&targetId=${currentUserId}`)
        .then(res => res.json())
        .then(data => setIsFollowing(data.isFollowing));

      fetch(`http://localhost:3005/follow/count/${currentUserId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setFollowersCount(data.followerCount);
            setFollowingCount(data.followingCount);
          } else {
            console.error("팔로우 정보 가져오기 실패");
          }
        })
        .catch(err => console.error("팔로우 수/팔로잉 수 가져오기 실패", err));

      // ✅ 팔로워 목록 가져오기
      fetch(`http://localhost:3005/follow/followers/${currentUserId}`)
        .then(res => res.json())
        .then(data => {console.log("팔로워 데이터 확인:", data); setFollowers(data.followers);})
        .catch(err => console.error("팔로워 목록 가져오기 실패", err));

      // ✅ 팔로잉 목록 가져오기
      fetch(`http://localhost:3005/follow/followings/${currentUserId}`)
        .then(res => res.json())
        .then(data => setFollowings(data.following))
        .catch(err => console.error("팔로잉 목록 가져오기 실패", err));

        // ✅ 선택된 트윗에 대한 댓글 목록 가져오기
      if (selectedTweet?.postId) {
        fetch(`http://localhost:3005/feed/${selectedTweet.postId}/replies`)
          .then(res => res.json())
          .then(data => setReplies(data.list))
          .catch(err => console.error("댓글 목록 가져오기 실패", err));
      }

    }
  }, [userId, user, selectedTweet?.postId]);


  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImg" && files) {
      setEditData(prev => ({ ...prev, profileImg: files[0] }));
    } else {
      setEditData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("email", info.email);
    formData.append("username", editData.username);
    formData.append("bio", editData.bio);
    if (editData.profileImg) {
      formData.append("profileImg", editData.profileImg);
    }

    try {
      await fetch("http://localhost:3005/member/update", {
        method: "PATCH",
        headers: {
          Authorization: token,
        },
        body: formData,
        credentials: 'include'
      });
      setShowModal(false);
      fnUserInfo();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMessageClick = async (otherUser) => {
  const user1 = user.email; // 현재 사용자 ID
  const user2 = otherUser.id; // 상대방 사용자 ID

  setLoading(true);

  try {
    // 1:1 채팅방 생성 요청
    const response = await fetch("http://localhost:3005/chat/create/direct", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user1, user2 }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      const { roomId, existed, isGroup } = data;

      // 이미 존재하는 채팅방일 경우 해당 방으로 이동
      if (existed) {
        navigate(`/chat/${roomId}`);
      } else {
        // 새 채팅방일 경우
        navigate(`/chat/${roomId}`);
      }
    } else {
      alert('채팅방 생성 실패');
    }
  } catch (error) {
    console.error('채팅방 생성 오류:', error);
    alert('채팅방 생성 중 오류가 발생했습니다.');
  } finally {
    setLoading(false);
  }
};


  const handleModalClose = () => {
    setShowModal(false);
    setModalContent('followers'); // 모달 초기화
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

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
    <div className="mypage-container">
      <div className="banner" />
      <div className="profile-section">
        <img
          src={info.profileImg ? "http://localhost:3005/" + info.profileImg : "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"}
          alt="프로필"
          className="profile-picture"
        />
        <div className="profile-info">
          <div className="profile-header">
            <h2>{info.username || '닉네임'}</h2>
            {isMyProfile ? (
              <button className="edit-button" onClick={() => {
                setModalContent('edit'); // ⭐ 필수
                setShowModal(true);
              }}>
                프로필 편집
              </button>
            ) : (
              <div className="action-buttons">
                <button className="follow-button" onClick={fnFollow}>
                  {isFollowing ? '팔로잉' : '팔로우'}
                </button>
                <button className="message-button" onClick={() => handleMessageClick({ id: info.email })}>
                  <FaPaperPlane />
                </button>
              </div>
            )}
          </div>
          <p className="email">@{info.email || 'email@example.com'}</p>
          <p className="bio">{info.bio || '자기소개를 여기에 적어보세요.'}</p>
          <p className="follow-info">
            팔로워: <span onClick={() => { setModalContent('followers'); setShowModal(true); }}>{followerCount}</span> ・ 팔로잉: <span onClick={() => { setModalContent('followings'); setShowModal(true); }}>{followingCount}</span>
          </p>
        </div>
      </div>

      <div className="tab-menu">
        <div className={`tab ${activeTab === 'tweets' ? 'active' : ''}`} onClick={() => handleTabClick('tweets')}>게시글</div>
        <div className={`tab ${activeTab === 'likes' ? 'active' : ''}`} onClick={() => handleTabClick('likes')}>좋아요</div>
      </div>

      <div className="tab-content">
        {activeTab === 'tweets' ? (
          <div className="tweet-list">
            <div style={{ marginTop: -60 }}>
            <TweetForm onTweetSubmit={fetchTweets(userId)} user={{ email }} />
            </div>
            {tweets.length === 0 ? (
              <p>작성한 게시글이 없습니다.</p>
            ) : (
              tweets.map((tweet, index) => (
                    <div key={index} className="tweet">
                      <p className="tweet-header">
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
                        <button onClick={() => {
                          console.log("답글", tweet.postId);
                          setSelectedTweet(tweet);
                        }}>💬 답글</button>
          
                        {/* 리트윗 버튼 */}
                        <button onClick={() => handleRetweet(tweet.id)}>
                          🔁 리트윗 ({tweet.retweetCount || 0}) {tweet.retweetedByMe && '✔️'}
                        </button>
          
                        {/* 좋아요 버튼 */}
                        <button onClick={() => handleLike(tweet.id)}>
                          ❤️ 좋아요 ({tweet.likeCount || 0}) {tweet.likedByMe && '✔️'}
                        </button>
          
                        {/* 작성자 본인인 경우만 삭제 버튼 표시 */}
                        {tweet.userId === userId && (
                          <button onClick={() => handleDelete(tweet.postId)}>🗑 삭제</button>
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
              </div>
                ) : (
          <p>사용자가 좋아요한 트윗이 여기에 표시됩니다.</p>
        )}
      </div>



      {/* 팔로워/팔로잉 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{modalContent === 'followers' ? '팔로워 목록' : '팔로잉 목록'}</h3>
            <ul className="follow-list">
              {(modalContent === 'followers' ? followers : followings).map((user, index) => (
                <li
                  key={index}
                  className="follow-item"
                  onClick={() => {
                    handleModalClose();
                    navigate(`/mypage/${user.email}`);
                  }}
                >
                  <img
                    src={user.profileImg ? `http://localhost:3005/${user.profileImg}` : "https://via.placeholder.com/40"}
                    alt="프로필 이미지"
                    className="follow-profile-img"
                  />
                  <span className="follow-username">{user.username}</span>
                </li>
              ))}
            </ul>
            <div className="modal-buttons">
              <button onClick={handleModalClose}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {/* 프로필 편집 모달 */}
      {showModal && modalContent === 'edit' && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>프로필 편집</h3>
            <label>닉네임</label>
            <input name="username" value={editData.username} onChange={handleEditChange} />

            <label>자기소개</label>
            <textarea name="bio" value={editData.bio} onChange={handleEditChange} />

            <label>프로필 이미지</label>
            <input name="profileImg" type="file" onChange={handleEditChange} />

            <div className="modal-buttons">
              <button onClick={handleSave}>저장</button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
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
                              {reply.userId === userId && (
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
                                  src={`http://localhost:3005/${sub.profileImg}`}
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
                                    {sub.userId === userId && (
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
};

export default MyPage;
