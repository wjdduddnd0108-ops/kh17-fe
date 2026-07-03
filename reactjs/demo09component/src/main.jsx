import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/flatly/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './index.css'

//strict modem는 엄격한 모드로 개발자 도구등 최적화를 위해 특정기능을 두번 실행한다(effect 해당)
// -> 배포하면 정상적으로 1번만 실행됨
// -> 경우에 따라서(ex : axios)는 strict mode를 해제해야함
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
