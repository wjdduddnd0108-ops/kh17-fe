import { useMemo, useState } from "react"
import './App.css'

function App() {
  const [q1, setQ1] = useState("");//첫번째 입력항목
  const [q2, setQ2] = useState("");

  const q1Count = useMemo(()=>{
    return q1.length;
  }, [q1]);

  const valid1 = useMemo(()=>{
    return q1Count <= 1000;
  }, [q1Count]);
  
  const class1 = useMemo(()=>{
    return valid1 ? "" : "text-danger";
  }, [valid1]);

  const q2Count = useMemo(()=>{
    return q2.length;
  }, [q2]);

  const valid2 = useMemo(()=>{
    return q2Count <= 1000;
  }, [q2Count]);
  
  const class2 = useMemo(()=>{
    return valid2 ? "" : "text-danger";
  }, [valid2]);

  const allValid = useMemo(()=>{
    return q1.length > 0 && valid1
          && q2.length > 0 && valid2;
  }, [q1, q2, valid1, valid2])
  
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col">
          <div className="p-4 bg-dark text-light rounded text-center">
            <h1>자기소개서</h1>
            <p>작성한 내용이 사실이 아닐 경우 합격이 무효가 될 수 있습니다</p>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col">
          <h3>(Q) 최근 가장 관심있게 본 IT 소식은 무엇입니까?</h3>
          <textarea className="form-control" rows="10"
            value={q1} onChange={e=>setQ1(e.target.value)}>  
          </textarea>
        </div>
      </div>

      <div className="row mt-2">
        <div className={`offset-sm-3 col-sm-9 text-end ${class1}`}>
          {q1Count} / 1000글자
        </div>
      </div>

      <hr/>

      <div className="row mt-4">
        <div className="col">
          <h3>(Q) 당신의 성격 장단점</h3>
          <textarea className="form-control" rows="10"
            value={q2} onChange={e=>setQ2(e.target.value)}>  
          </textarea>
        </div>
      </div>

      <div className="row mt-2">
        <div className={`offset-sm-3 col-sm-9 text-end ${class2}`}>
          {q2Count} / 1000글자
        </div>
      </div>

    {/* 제출 버튼 */}
    <div className="row mt-5">
      <div className="col">
        <button className="btn btn-lg btn-success w-100" 
          disabled={allValid == false}>
          제출하기
        </button>
      </div>
    </div>

    </div>
  )
}

export default App
