import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';  // App 컴포넌트 import
import reportWebVitals from './reportWebVitals';  // 성능 측정을 위한 함수 import (원하는 경우 사용)

const root = ReactDOM.createRoot(document.getElementById('root'));  // root element에 렌더링

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);


// 성능 측정을 원할 경우 활성화
reportWebVitals();  // 성능 로그를 콘솔에 출력하거나 분석 API에 전송
