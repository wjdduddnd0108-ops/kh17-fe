import { useState } from 'react'
import './App.css'

function App() {
const [money, setMoney] = useState(0);
  return (
    <>
    <h1>은행 이체</h1>
    <h3>이체하실 금액을 입력하세요</h3>
    <div>{money}</div>
    <button onClick={()=>setMoney(Math.floor(money/10))}>삭제</button>
    <button onClick={()=>setMoney(0)}>전체 삭제</button>
    <hr/>
    <button onClick={()=>setMoney(money+10000000)}>천만</button>
    <button onClick={()=>setMoney(money+1000000)}>백만</button>
    <button onClick={()=>setMoney(money+100000)}>십만</button>
    <button onClick={()=>setMoney(money+10000)}>만</button>
    <button onClick={()=>setMoney(money+1000)}>천</button>
    <button onClick={()=>setMoney(money+100)}>백</button>
    <button onClick={()=>setMoney(money+10)}>십</button>
    <button onClick={()=>setMoney(money+1)}>일</button>
    
    </>
  )
}

export default App
