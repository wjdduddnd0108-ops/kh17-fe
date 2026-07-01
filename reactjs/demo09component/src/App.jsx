import { useCallback, useState } from "react"
import './App.css'
import Jumbotron from "./components/Jumbotron"//.jsx 생략
import Exam01 from "./components/Exam01"
import Exam02 from "./components/Exam02"
import Exam02_1 from "./components/Exam02_1"
import Exam03 from "./components/Exam03"

function App() {

  
  return (
  <div className="container my-5">

    <Exam01/>

    <hr/>

    <Exam02/>

    <hr/>

    <Exam02_1/>

    <hr/>

    <Exam03/>


  </div>
  )
}

export default App
