// components/Feed.js
import React from 'react';

function Feed({ tweets }) {
  return (
    <div className="feed">
      {tweets.map((tweet, index) => (
        <div key={index} className="tweet">
          <p><strong>{tweet.username}</strong></p>
          <p>{tweet.content}</p>
          <p><small>{tweet.date}</small></p>
        </div>
      ))}
    </div>
  );
}

export default Feed;
