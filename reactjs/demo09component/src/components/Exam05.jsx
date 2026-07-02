import { useCallback, useEffect, useMemo, useState } from "react"
import Jumbotron from "./Jumbotron"
import axios from "axios";
import Swal from 'sweetalert2'

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
         bookTitle : "",
        bookAuthor : "",
        bookPublicationDate : "",
        bookPublisher : "",
        bookPrice : "",
        bookPageCount : "",
        bookGenre : "",
    });

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
        const valid = regex.test(book.bookAuthor);
        setResult({
            ...result,
            bookAuthor : valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookAuthor, result]);

    const checkBookPublicationDate = useCallback(()=>{
        const regex = /^([0-9]{4})-(((02)-(0[1-9]|1[0-9]|2[0-9]))|((0[469]|11)-(0[1-9]|1[0-9]|2[0-9]|30))|((0[13578]|1[02])-(0[1-9]|1[0-9]|2[0-9]|3[01])))$/;
        const valid = regex.test(book.bookPublicationDate);
        setResult({
            ...result,
            bookPublicationDate : valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookPublicationDate, result]);

    const checkBookPublisher = useCallback(()=>{
        const regex = /^[^!@#$]+$/;
        const valid = regex.test(book.bookPublisher);
        setResult({
            ...result,
            bookPublisher : valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookPublisher, result]);

    const checkBookPrice = useCallback(()=>{
        var valid = book.bookPrice > 0;
        setResult({
            ...result,
            bookPrice : valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookPrice, result]);

    const checkBookPageCount = useCallback(()=>{
        var valid = book.bookPageCount > 0;
        setResult({
            ...result,
            bookPageCount : valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookPageCount, result]);

    const checkBookGenre = useCallback(()=>{
        const regex = /^(판타지|교양|소설|역사|과학|추리소설|자기계발|수험서)$/;
        const valid = regex.test(book.bookGenre);
        setResult({
            ...result,
            bookGenre : valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookGenre, result]);

    //- 데이터 전송(등록)
    const send = useCallback(()=>{
        axios({
            url:"http://localhost:8080/api/book/insert",
            method:"post",
            data: book,
        })
        .then(response=>{
            Swal.fire({
                title: "등록 완료!",
                icon: "success",
            });
            //입력값 정리
            setBook({
                bookTitle : "",
                bookAuthor : "",
                bookPublicationDate : "",
                bookPublisher : "",
                bookPrice : 0,
                bookPageCount : 0,
                bookGenre : ""
            })
            //검사 결과 정리
            setResult({
                bookTitle : "",
                bookAuthor : "",
                bookPublicationDate : "",
                bookPublisher : "",
                bookPrice : 0,
                bookPageCount : 0,
                bookGenre : ""
            })
        });
    },[book]);

    //memo
    const valid = useMemo(()=>{
        if(result.bookTitle !== "is-valid") return false;
        if(result.bookAuthor !== "is-valid") return false;
        if(result.bookPublicationDate !== "is-valid") return false;
        if(result.bookPublisher !== "is-valid") return false;
        if(result.bookPrice !== "is-valid") return false;
        if(result.bookPageCount !== "is-valid") return false;
        if(result.bookGenre !== "is-valid") return false;
        return true;
    }, [result]);

    //effect
    useEffect(() => {
    if (book.bookGenre === "" && result.bookGenre === "") return;

        checkBookGenre();
    }, [book.bookGenre, result.bookGenre]);

    //view
    return (
        <>
        <Jumbotron title="도서등록" />

         <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                도서명
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
                지은이
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
                출간일
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
                판매가
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
                페이지 수
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
                장르
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

        <div className="row mt-4">
            <div className="col text-end">
                <button type="button" className="btn btn-primary w-100"
                    disabled={valid === false} onClick={send}>
                    신규 도서 등록하기
                </button>
            </div>
        </div>
        </>
    );
}

export default Exam05
