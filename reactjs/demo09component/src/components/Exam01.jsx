import { useCallback, useState } from "react"
import Jumbotron from "./Jumbotron"


function Exam01(){
// 개별적으로 관리할 때
  // const [memberId, setMemberId] =useState("");
  // const [memberNickname, setMemberNickname] = useState("");
  
  //state는 하나의 객체로 관리
  const [member, setMember] = useState({
    memberId : "",
    memberNickname : ""
  })

  //통합 설정 함수
  // - React에서는 함수를 만들 때 useCallback 훅을 사용
  // - 방법 : const 함수명 = useCallback(함수, [연관항목]);
  const changeMember = useCallback(e=>{
    // const name = e.target.name;
    // const value = e.target.value;
    const {name, value} = e.target;

    console.log(e.target);
    setMember({
      ...member,//나머지 항목을 유지하고
      [name] : value//원하는 항목을 원하는 값으로 변경해라
    })
  }, [member]);

    return(
    <>
    {/* 내가 만든 점보트론을 불러와서 적용 */}
    <Jumbotron title="객체 state 다루기" content="입력창 여러개를 하나의 state로 관리하는 법을 배웁니다"/>

    {/* 아이디 입력화면 */}
    <div className="row mt-4">
      <label className="col-sm-3 col-form-label">아이디</label>
      <div className="col-sm-9">
        <input type="text" name="memberId" className="form-control"
          value={member.memberId}
          onChange={changeMember}/>
        <div className="valid-feedback">멋진 아이디입니다!</div>
        <div className="invalid-feedback">사용중이거나 사용할 수 없는 형식입니다</div>
      </div>
    </div>

    {/* 닉네임 입력화면 */}
    <div className="row mt-4">
      <label className="col-sm-3 col-form-label">닉네임</label>
      <div className="col-sm-9">
        <input type="text" name="memberNickname" className="form-control"
        value={member.memberNickname}
        onChange={changeMember}/>
        <div className="valid-feedback">멋진 닉네임입니다!</div>
        <div className="invalid-feedback">사용중이거나 사용할 수 없는 형식입니다</div>
      </div>
    </div>
    </>
    );
}

export default Exam01;