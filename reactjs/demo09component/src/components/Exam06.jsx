import { useCallback, useState } from "react";
import Jumbotron from "./Jumbotron";
import { FaPlus, FaXmark } from "react-icons/fa6";

function Exam06() {
    //state가 배열인 경우
    const [numbers, setNumbers] = useState([10, 20, 30, 40, 50]);
    const [more, setMore] = useState("");

    const addNumber = useCallback(()=>{
        //numbers.push(more);//쓰면 안되는 명령(원본을 직접 변경)

        //concat은 새로운 배열을 만들어내며, 이와 같이 신규 배열로 만들어 덮어쓰는게 리액트스러운 방법
        // setNumbers(numbers.concat(more));
        setNumbers([...numbers, more]);

        setMore("");//입력창 초기화
    }, [numbers, more]);

    const deleteNumber = useCallback(index=>{
        const choice = window.confirm("정말 지워요?");
        if(choice === false) return;

        setNumbers(
            numbers.filter((number, idx)=> idx !== index)
        );
    }, [numbers]);

    return (<>
        <Jumbotron title="반복적인 화면 출력"/>

        <div className="row mt-4">
            <div className="col">
                <ul className="list-group">
                    {numbers.map((number, index)=>(
                        <li className="list-group-item" key={index}>
                            {number}
                            <FaXmark className="ms-4 text-danger" 
                                onClick={e=>deleteNumber(index)}/>
                        </li>
                    ))}
                </ul>
            </div>
        </div>



        {/* 입력창과 버튼을 만들고 추가를 누르면 배열의 마지막에 데이터 뒤에 추가되도록 구현 */}
        <div className="row mt-4">
            <div className="col">
                <div className="input-group">
                    <input type="text" className="form-control"
                        value={more}
                        onChange={e=>setMore(e.target.value)}
                        />
                    <button type="button" className="btn btn-success" onClick={addNumber}>
                        <FaPlus className="me-2"/>
                        <span>추가</span>
                    </button>
                </div>
            </div>
        </div>
    </>)
}

export default Exam06