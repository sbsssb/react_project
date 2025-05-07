import React, { useState } from 'react';
import './TweetForm.css';

function TweetForm({ onTweetSubmit }) {
    const [content, setContent] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (content.trim()) {
        onTweetSubmit(content);
        setContent('');
      }
    };
  
    return (
      <form className="tweet-form" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          rows="3"
        />
        <button type="submit">Tweet</button>
      </form>
    );
  }
  
  export default TweetForm;
