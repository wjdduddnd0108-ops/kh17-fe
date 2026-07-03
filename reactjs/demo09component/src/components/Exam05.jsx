import { useCallback, useEffect, useMemo, useState } from "react"
import Jumbotron from "./Jumbotron"
import axios from "axios";
import Swal from 'sweetalert2'
import { FaAsterisk, FaPlus } from "react-icons/fa6";
import { ClockLoader } from "react-spinners";

function Exam05(){
    //state
    const [book, setBook] =useState({
        bookTitle : "",
        bookAuthor : "",
        bookPublicationDate : "",
        bookPublisher : "",
        bookPrice : 0,
        bookPageCount : 0,
        bookGenre : "",
    });
    const [result, setResult] = useState({
         bookTitle : null,
        bookAuthor : null, 
        bookPublicationDate : null,
        bookPublisher : null,
        bookPrice : null,
        bookPageCount : null,
        bookGenre : null,
    });
    const [loading, setLoading] = useState(false);



    //callback
    const changeStringValue = useCallback(e=>{
        const {name, value} = e.target;
        setBook({
            ...book,
            [name] : value
        });
    }, [book]);
    const changeNumericValue = useCallback(e=>{
        const {name, value} = e.target;
        const regex = /[^0-9]+/g;
        const replacement = value.replace(regex, "");
        const result = parseInt(replacement);
        setBook({
            ...book,
            [name] : (result || 0)
        });
    }, [book]);

    const checkBookTitle = useCallback(()=>{
        const valid = book.bookTitle.length > 0;
        setResult({
            ...result,
            bookTitle : valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookTitle, result]);

    const checkBookAuthor = useCallback(()=>{
        const regex = /^[^!@#$]+$/;
        const valid = book.bookAuthor.length === 0 || 
                        regex.test(book.bookAuthor);
        setResult({
            ...result,
            bookAuthor : valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookAuthor, result]);

    const checkBookPublicationDate = useCallback(()=>{
        const regex = /^([0-9]{4})-(((02)-(0[1-9]|1[0-9]|2[0-9]))|((0[469]|11)-(0[1-9]|1[0-9]|2[0-9]|30))|((0[13578]|1[02])-(0[1-9]|1[0-9]|2[0-9]|3[01])))$/;
        const valid = book.bookPublicationDate.length ===0 
                       || regex.test(book.bookPublicationDate);
        setResult({
            ...result,
            bookPublicationDate : valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookPublicationDate, result]);

    const checkBookPublisher = useCallback(()=>{
        setResult({
            ...result,
            bookPublisher : "is-valid"
        });
    }, [book.bookPublisher, result]);

    const checkBookPrice = useCallback(()=>{
        const valid = book.bookPrice > 0;
        setResult({
            ...result,
            bookPrice : valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookPrice, result]);

    const checkBookPageCount = useCallback(()=>{
        const valid = book.bookPageCount > 0;
        setResult({
            ...result,
            bookPageCount : valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookPageCount, result]);

    const checkBookGenre = useCallback(()=>{
        const regex = /^(판타지|교양|소설|역사|과학|추리소설|자기계발|수험서)$/;
        const valid = regex.test(book.bookGenre);

        // const valid = ["판타지","교양","소설","역사","과학","추리소설","자기계발","수험서"].includes
        setResult({
            ...result,
            bookGenre : valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookGenre, result]);

    const clear = useCallback(()=>{
        setBook({
            bookTitle : "",
            bookAuthor : "",
            bookPublicationDate : "",
            bookPublisher : "",
            bookPrice : 0,
            bookPageCount : 0,
            bookGenre : ""
        });
        //검사 결과 정리
        setResult({
            bookTitle : null,
            bookAuthor : null,
            bookPublicationDate : null,
            bookPublisher : null,
            bookPrice : null,
            bookPageCount : null,
            bookGenre : null
        });
    },[]);

    //- 데이터 전송(등록)
    const send = useCallback(()=>{
        //로딩 상태로 변경
        setLoading(true);

        axios({
            url:"http://localhost:8080/api/book/insert",
            method:"post",
            data: book,
        })
        .then(response=>{
            Swal.fire({
                title: "등록 완료!",
                icon: "success",
            })
            //입력값 정리
            clear();  
        })
        .finally(()=>{
            setLoading(false);
        });
    },[book]);

    //memo
    const valid = useMemo(()=>{
        if(result.bookTitle !== "is-valid") return false;
        if(result.bookAuthor !== "is-invalid") return false;
        if(result.bookPublicationDate !== "is-invalid") return false;
        if(result.bookPublisher !== "is-invalid") return false;
        if(result.bookPrice !== "is-valid") return false;
        if(result.bookPageCount !== "is-valid") return false;
        if(result.bookGenre !== "is-valid") return false;
        return true;
    }, [result]);

    //effect
    useEffect(() => {
    if (book.bookGenre === "" && result.bookGenre === null) 
            return;

        checkBookGenre();
    }, [book.bookGenre, result.bookGenre]);

    //view
    return (
        <>
        <Jumbotron title="도서등록" />

         <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                <span>도서명</span>
                <FaAsterisk className="text-danger"/>
            </label>
            <div className="col-sm-9">
                <input type="text" name="bookTitle" className={`form-control ${result.bookTitle}`}
                value={book.bookTitle}
                onChange={changeStringValue}
                onBlur={checkBookTitle}
                />
                <div className="invalid-feedback">필수항목입니다</div>
            </div>
        </div>

        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                <span>지은이</span>
            </label>
            <div className="col-sm-9">
                <input type="text" name="bookAuthor" className={`form-control ${result.bookAuthor}`}
                    value={book.bookAuthor}
                    onChange={changeStringValue}
                    onBlur={checkBookAuthor}
                    />
                <div className="invalid-feedback">필수항목입니다</div>
            </div>
        </div>

        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                <span>출간일</span>
                <FaAsterisk className="text-danger"/>
            </label>
            <div className="col-sm-9">
                <input type="date" name="bookPublicationDate" className={`form-control ${result.bookPublicationDate}`}
                value={book.bookPublicationDate}
                onChange={changeStringValue}
                onBlur={checkBookPublicationDate}
                />
                <div className="invalid-feedback">올바르지 않은 년도입니다</div>
            </div>
        </div>

        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                <span>판매가</span>
                <FaAsterisk className="text-danger"/>
            </label>
            <div className="col-sm-9">
                <input type="text" inputMode="numeric" name="bookPrice" className={`form-control ${result.bookPrice}`}
                value={book.bookPrice}
                onChange={changeNumericValue}
                onBlur={checkBookPrice}
                />
                <div className="invalid-feedback">0 이상의 숫자를 입력해주세요</div>
            </div>
        </div>

        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                출판사
            </label>
            <div className="col-sm-9">
                <input type="text" name="bookPublisher" className={`form-control ${result.bookPublisher}`}
                value={book.bookPublisher}
                onChange={changeStringValue}
                onBlur={checkBookPublisher}
                />
            </div>
        </div>

        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                <span>페이지 수</span>
                <FaAsterisk className="text-danger"/>
            </label>
            <div className="col-sm-9">
                <input type="text" inputMode="numeric" name="bookPageCount" className={`form-control ${result.bookPageCount}`}
                value={book.bookPageCount}
                onChange={changeNumericValue}
                onBlur={checkBookPageCount}
                />
                <div className="invalid-feedback">0 이상의 숫자를 입력해주세요</div>
            </div>
        </div>

        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                <span>장르</span>
                <FaAsterisk className="text-danger"/>
            </label>
            <div className="col-sm-9">
                <select name="bookGenre" className={`form-select ${result.bookGenre}`} 
                value={book.bookGenre}
                onChange={changeStringValue}
                >
                    <option value="">선택하세요</option>
                    <option>판타지</option>
                    <option>교양</option>
                    <option>소설</option>
                    <option>역사</option>
                    <option>과학</option>
                    <option>추리소설</option>
                    <option>자기계발</option>
                    <option>수험서</option>
                </select>
                <div className="invalid-feedback">필수항목입니다</div>
            </div>
        </div>

        <div className="row mt-5">
            <div className="col text-end">
                <button type="button" className="btn btn-success w-100"
                    disabled={valid === false} onClick={send}>
                    <FaPlus className="me-2"/>
                    <span>신규 도서 등록하기</span>
                </button>
            </div>
        </div>

        {/* 로딩상태 (loading === true) 일 때 보여질 화면 */}
        {/* { loading === true ? <h1>로딩중</h1> : false } */}
        {/* { loading === true && <h1>로딩중</h1> } */}
        { loading === true && (
        <div className="position-fixed top-0 start-0 
                        w-100 h-100 bg-dark bg-opacity-25
                        d-flex justify-content-center align-items-center">
            <div className="d-flex flex-column text-center">
                <ClockLoader size={75} loading={loading}/>
                <p className="mt-2">등록중</p>
            </div>
        </div>
        )}

        </>
    );
}

export default Exam05
