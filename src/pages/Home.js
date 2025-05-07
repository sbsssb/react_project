// pages/Home.js
import React, { useState } from 'react';
import TweetForm from '../components/TweetForm';
import Feed from '../components/Feed';

function Home() {
  const [tweets, setTweets] = useState([]);

  const addTweet = (newTweet) => {
    setTweets([
      ...tweets,
      { username: 'user1', content: newTweet, date: new Date().toLocaleString() },
    ]);
  };

  return (
    <div className="home">
      <TweetForm onTweetSubmit={addTweet} />
      <Feed tweets={tweets} />
    </div>
  );
}

export default Home;
