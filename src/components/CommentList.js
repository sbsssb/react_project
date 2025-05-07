import React from 'react';

function CommentList({ comments }) {
  return (
    <div className="comment-list">
      {comments.map((c) => (
        <p key={c.id}>💬 {c.text}</p>
      ))}
    </div>
  );
}

export default CommentList;
