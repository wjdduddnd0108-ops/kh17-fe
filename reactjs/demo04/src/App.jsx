import { useState } from 'react'
import './App.css'

function App() {
const [size, setSize] = useState(300);

  return (
    <>
    <h1>이미지 크기 조절</h1>
    <hr/>
    <button onClick={()=>setSize(150)}>작게</button>
    <button onClick={()=>setSize(300)}>보통</button>
    <button onClick={()=>setSize(450)}>크게</button>

    <div>
      현재 크기 : {size}px
      &nbsp;&nbsp;
      <button onClick={()=>setSize(size+10)}>+</button>
      <button onClick={()=>setSize(size-10)}>-</button>
    </div>

    <hr/>
    <img src="https://picsum.photos/300" 
      className="target"
      width={size}></img>

    </>
  )
}

export default App
