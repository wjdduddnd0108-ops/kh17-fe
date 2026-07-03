import { useCallback, useState } from "react"
import './App.css'
import Jumbotron from "./components/Jumbotron"//.jsx 생략
import Exam01 from "./components/Exam01"
import Exam02 from "./components/Exam02"
import Exam02_1 from "./components/Exam02_1"
import Exam03 from "./components/Exam03"
import Exam03_1 from "./components/Exam03_1"
import Exam04 from "./components/Exam04"
import Exam05 from "./components/Exam05"

import { Bounce, ToastContainer } from "react-toastify";
import Exam06 from "./components/Exam06"
import Exam07 from "./components/Exam07"
import Exam07_1 from "./components/Exam07_1"


function App() {

  
  return (
  <div className="container my-5">

    <Exam01/>

    <hr/>

    <Exam02/>

    <hr/>

    <Exam02_1/>

    <hr/>

    {/* <Exam03/> */}

    <hr/>

    {/* <Exam03_1/> */}

    <hr/>

    <Exam04/>

    <hr/>

    <Exam05/>

    <hr/>

    <Exam06/>

    <hr/>

    <Exam07/>

    <hr/>

    <Exam07_1/>

    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Bounce}
    />
  </div>
  )
}

export default App
