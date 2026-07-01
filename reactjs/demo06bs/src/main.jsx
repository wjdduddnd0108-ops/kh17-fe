//이곳에서 사용 설정을 하면 전체 페이지에서 사용 가능

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

//기존처럼 CSS와 JS를 불러다 두고 사용하기 위해 레거시 파일을 불러와서 설정
//만약, 특정 컴포넌트만 추출해서 쓰고 싶다면 ESM 방식의 파일을 불러와서 해당 컴포넌트에서 사용
import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/flatly/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
