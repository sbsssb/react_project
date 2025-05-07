import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TweetForm from './components/TweetForm';
import TweetItem from './components/TweetItem';

function App() {
  const [tweets, setTweets] = useState([]);

  const handleAddTweet = (content) => {
    const newTweet = {
      id: Date.now(),
      username: 'user1',
      content,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };
    setTweets([newTweet, ...tweets]);
  };

  const handleLike = (id) => {
    setTweets(tweets.map(tweet =>
      tweet.id === id ? { ...tweet, likes: tweet.likes + 1 } : tweet
    ));
  };

  const handleDelete = (id) => {
    setTweets(tweets.filter(tweet => tweet.id !== id));
  };

  const handleEdit = (id, newContent) => {
    setTweets(tweets.map(tweet =>
      tweet.id === id ? { ...tweet, content: newContent } : tweet
    ));
  };

  const handleAddComment = (id, commentText) => {
    setTweets(tweets.map(tweet =>
      tweet.id === id
        ? {
            ...tweet,
            comments: [...tweet.comments, { id: Date.now(), text: commentText }]
          }
        : tweet
    ));
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
          <Sidebar />
          <div className="feed-container">
            <TweetForm onTweetSubmit={handleAddTweet} />
            {tweets.map((tweet) => (
              <TweetItem
                key={tweet.id}
                tweet={tweet}
                onLike={() => handleLike(tweet.id)}
                onDelete={() => handleDelete(tweet.id)}
                onEdit={handleEdit}
                onAddComment={handleAddComment}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
