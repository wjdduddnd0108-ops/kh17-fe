import { useCallback, useMemo, useState } from "react"
import Jumbotron from "./Jumbotron"

function Exam02_1(){
    //state
    const [student, setStudent] = useState({
        name : "",
        koScore : 0,
        enScore : 0,
        mathScore : 0
    });

    //callback - 문자열입력(changeStringValue), 정수입력(changeNumbericValue)
    const changeStringValue = useCallback(e=>{
        const {name, value} = e.target;
         setStudent({
            ...student, 
            [name] : value
        });
    }, [student]);
    const changeNumericValue = useCallback(e=>{
        const {name, value} = e.target;
        const regex = /[^0-9]+/g;
        const replacement = value.replace(regex, "");
         setStudent({
            ...student, 
            [name] : parseInt(replacement || 0)
        });
    }, [student]);

    //memo
    const sum = useMemo(()=> {
        // return student.enScore+student.koScore
        // +student.mathScore;
        return student.enScore
                + student.koScore
                + student.mathScore
    }, [student]);

    const avg = useMemo(()=> {
        return sum / 3;
    } , [sum]);

    //view
    return(
        <>
        <Jumbotron title="학생 성적 계산기2" content="시험 결과를 입력하시면 평균과 총점을 계산해드립니다"/>

        {/* 이름 입력화면 */}
        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">이름</label>
            <div className="col-sm-9">
                <input type="text" name="name" className="form-control"
                value={student.name}
                onChange={changeStringValue}/>
            </div>
        </div>

        {/* 국어점수 입력화면 */}
        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">국어점수</label>
            <div className="col-sm-9">
                <input type="text" inputMode="numeric" name="koScore" className="form-control"
                value={student.koScore}
                onChange={changeNumericValue}/>
            </div>
        </div>

        {/* 국어점수 입력화면 */}
        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">영어점수</label>
            <div className="col-sm-9">
                <input type="text" inputMode="numeric" name="enScore" className="form-control"
                value={student.enScore}
                onChange={changeNumericValue}/>
            </div>
        </div>

        {/* 국어점수 입력화면 */}
        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">영어점수</label>
            <div className="col-sm-9">
                <input type="text" inputMode="numeric" name="mathScore" className="form-control"
                value={student.mathScore}
                onChange={changeNumericValue}/>
            </div>
        </div>

        <div className="row mt-5">
            <div className="col">
                <div className="shadow p-4 rounded bordered">
                    {student.name}님의 성적은 다음과 같습니다 <br/>
                    총점 {sum}점 , 평균 {avg.toFixed(2)}점입니다.
                </div>
            </div>
        </div>
        </>
    );
}

export default Exam02_1