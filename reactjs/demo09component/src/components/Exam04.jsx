import { useCallback, useEffect, useMemo, useState } from "react"
import Jumbotron from "./Jumbotron"
//axios라는 라이브러리에서 제공하는 기본 JS 파일을 불러와서 axios라는 이름으로 쓰겠다
import axios from "axios";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'

function Exam04(){
    //state
    const [practice1, setPractice1] = useState({
        practice1Name : "",
        practice1Category : "",
        practice1Time : "",//숫자이지만 미입력 상태로 설정
        practice1Price : "",//숫자이지만 미입력 상태로 설정
        practice1CourseType : ""
    });

    const [result, setResult] =useState({
        practice1Name : "",
        practice1Category : "",
        practice1Time : "",
        practice1Price : "",
        practice1CourseType : ""
    });

    //callback
    //- 입력함수들
    const changeStringValue = useCallback(e=>{
        const {name, value} = e.target;
        setPractice1({
            ...practice1, //나머지 그대로 유지
            [name] : value
        });
    }, [practice1]);
    const changeNumericValue = useCallback(e=>{
        const {name, value} = e.target;
        const regex = /[^0-9]+/g;
        const replacement = value.replace(regex, "");
        if(replacement.length === 0){
             setPractice1({
            ...practice1,
            [name] : replacement
        });
        }
        else{
            setPractice1({
            ...practice1,
            [name] : parseInt(replacement)
        });
        }
    }, [practice1]);

    //- 검사함수들
    const checkPractice1Name = useCallback(()=>{
        const valid = practice1.practice1Name.length > 0;
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result,
            practice1Name : clazz
        });
    },[practice1.practice1Name, result]);

    const checkPractice1Category = useCallback(()=>{
        // const regex = /^(이론|실습|시험)$/;
        // const valid = regex.test(practice1.practice1Category);
        const valid = ['이론', '실습', '시험'].includes(practice1.practice1Category);
        const clazz = valid ? "is-valid" : "is-invalid"
        setResult({
            ...result,
            practice1Category : clazz
        });
    }, [practice1.practice1Category, result]);

    const checkPractice1Time = useCallback(()=>{
        const valid =
            practice1.practice1Time !== "" 
            && practice1.practice1Time > 0 
            && practice1.practice1Time % 30 === 0 && practice1.practice1Time <= 300;
        setResult({
            ...result,
            practice1Time : valid ? "is-valid" : "is-invalid"
        });
    }, [practice1.practice1Time, result]);

    const checkPractice1price = useCallback(()=>{
        const valid = practice1.practice1Price >= 0 && practice1.practice1Price <= 100000000;
        setResult({
            ...result,
            practice1Price : valid ? "is-valid" : "is-invalid"
        });
    }, [practice1.practice1Price, result]);

    const checkPractice1CourseType = useCallback(()=>{
        // const regex = /^(온라인|오프라인|혼합)$/;
        // const valid = regex.test(practice1.practice1CourseType);
        const valid = ['온라인', '오프라인', '혼합'].includes(practice1.practice1CourseType);

        setResult({
            ...result,
            practice1CourseType : valid ? "is-valid" : "is-invalid"
        });
    }, [practice1.practice1CourseType, result]);

    //- 데이터 전송(등록)
    const send = useCallback(()=>{
        // $.ajax({
        //     url:"http://localhost:8080/api/practice1/insert",
        //     method:"post",
        //     data:practice1,
        //     success:function(response){
        //         console.log("등록 완료!");
        //     }
        // });  
        
        axios({
            url:"http://localhost:8080/api/practice1/insert",
            method:"post",
            data: practice1,
        })
        .then(response=>{ 
            //console.log("등록 완료!"); 
            // window.alert("등록 완료!");

            //react-toastify 생성 코드
            // toast("등록 완료!");
            // toast.success("등록 완료!");

            //sweetalert2 생성 코드
            Swal.fire({
                title: "등록 완료!",
                icon: "success",
            });

            //입력값 정리
            setPractice1({
                practice1Name : "",
                practice1Category : "",
                practice1Time : "",
                practice1Price : "",
                practice1CourseType : ""
            })
            //검사 결과 정리
            setResult({
                practice1Name : "",
                practice1Category : "",
                practice1Time : "",
                practice1Price : "",
                practice1CourseType : ""
            })
        });
        
    },[practice1]);

    //memo
    const valid = useMemo(()=>{
        if(result.practice1Name !== "is-valid") return false;
        if(result.practice1Category !== "is-valid") return false;
        if(result.practice1Time !== "is-valid") return false;
        if(result.practice1Price !== "is-valid") return false;
        if(result.practice1CourseType !== "is-valid") return false;
        return true;
    }, [result]);

    //effect
    useEffect(() => {
    if (practice1.practice1CourseType === "" && result.practice1CourseType === "") return;

        checkPractice1CourseType();
    }, [practice1.practice1CourseType, result.practice1CourseType]);

    useEffect(() => {
        if (practice1.practice1Category === "" && result.practice1Category === "") return;

        checkPractice1Category();
    }, [practice1.practice1Category, result.practice1Category]);

    //view
    return (
        <>
        <Jumbotron title="강좌등록"/>

        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                강좌명
            </label>
            <div className="col-sm-9">
                <input type="text" name="practice1Name" className={`form-control ${result.practice1Name}`}
                value={practice1.practice1Name}
                onChange={changeStringValue}
                onBlur={checkPractice1Name}
                />
                <div className="valid-feedback">올바른 형식입니다</div>
                <div className="invalid-feedback">필수항목입니다</div>
            </div>
        </div>

        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                카테고리
            </label>
            <div className="col-sm-9">
                <select name="practice1Category" className={`form-select ${result.practice1Category}`} 
                value={practice1.practice1Category}
                onChange={changeStringValue}
                >
                    <option value="">선택하세요</option>
                    <option>이론</option>
                    <option>실습</option>
                    <option>시험</option>
                </select>
                <div className="invalid-feedback">필수항목입니다</div>
            </div>
        </div>

        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                강의시간
            </label>
            <div className="col-sm-9">
                <input type="text" inputMode="numeric" name="practice1Time" className={`form-control ${result.practice1Time}`}
                value={practice1.practice1Time}
                onChange={changeNumericValue}
                onBlur={checkPractice1Time}
                />
                <div className="valid-feedback">강의시간이 설정되었습니다</div>
                <div className="invalid-feedback">30시간 단위로 최대 300시간 이내에서 설정 가능합니다.</div>
            </div>
        </div>

        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                수강료
            </label>
            <div className="col-sm-9">
                <input type="text" inputMode="numeric" name="practice1Price" className={`form-control ${result.practice1Price}`}
                value={practice1.practice1Price}
                onChange={changeNumericValue}
                onBlur={checkPractice1price}
                />
                <div className="valid-feedback">수강료가 설정되었습니다</div>
                <div className="invalid-feedback">3수강료는 0 이상으로 설정해야 합니다.</div>
            </div>
        </div>

        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                강의형태
            </label>
            <div className="col-sm-9">
                <select name="practice1CourseType" className={`form-select ${result.practice1CourseType}`} 
                value={practice1.practice1CourseType}
                onChange={changeStringValue}
                >
                    <option value="">선택하세요</option>
                    <option>온라인</option>
                    <option>오프라인</option>
                    <option>혼합</option>
                </select>
                <div className="invalid-feedback">필수항목입니다</div>
            </div>
        </div>

        <div className="row mt-4">
            <div className="col">
                <button type="button" className="btn btn-primary w-100"
                    disabled={valid === false} onClick={send}>
                    + 신규 강좌 등록하기
                </button>
            </div>
        </div>
        </>
    );
}

export default Exam04