import React, { useState } from 'react';
import CommentList from './CommentList';
import './TweetItem.css';

function TweetItem({ tweet, onLike, onDelete, onEdit, onAddComment }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(tweet.content);
  const [commentText, setCommentText] = useState('');

  const handleEditSubmit = () => {
    onEdit(tweet.id, editText);
    setEditing(false);
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    onAddComment(tweet.id, commentText);
    setCommentText('');
  };

  return (
    <div className="tweet">
      <p><strong>{tweet.username}</strong></p>
      {editing ? (
        <>
          <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
          <button onClick={handleEditSubmit}>Save</button>
        </>
      ) : (
        <p>{tweet.content}</p>
      )}
      <div className="tweet-actions">
        <button onClick={onLike}>Like ({tweet.likes})</button>
        <button onClick={() => setEditing(!editing)}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>

      <div className="comments">
        <CommentList comments={tweet.comments} />
        <input
          type="text"
          placeholder="Add comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={handleCommentSubmit}>Reply</button>
      </div>
    </div>
  );
}

export default TweetItem;
