import axios from "axios";
import { useEffect, useState } from "react";
import Jumbotron from "./Jumbotron";

function Exam09(){
    const [bookList, setBookList] =useState([]);

    //effect
    useEffect(()=>{
        axios({
            url:"http://localhost:8080/api/book/list",
            method:"get"
        })
        .then(response=>{
            setBookList(response.data);
        })
    });

    return(<>
        <Jumbotron title="도서 목록"/>

        <div className="row mt-4">
            <div className="col">
                <ul className="list-group">
                    {bookList.map(book=>(
                    <li className="list-group-item" key={book.bookId}>
                        <p className="text-muted">
                            <span className="ms-4">{book.bookGenre}</span>
                        </p>

                        <h3>{book.bookTitle}</h3>

                        {/* ??는 앞 항목이 null, undefined 등 확실하게 없는 경우 다음을 실행 */}
                        {/* ||는 앞 항목이 null, false, 0, "" 등 부정적인 경우 다음을 실행
                         */}
                        <div>지은이 : {book.bookAuthor ?? "없음"}</div>
                        <div>출판사 : {book.bookPublisher ?? "없음"} </div>

                        <div className="my-4">
                            책에 대한 설명 어쩌구 저쩌구..
                        </div>

                        <div className="my-2">
                            {book.bookPrice}원
                        </div>

                        <div className="my-2">
                            {book.bookPageCount}p
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>




        <div className="row mt-4">
            <div className="col">
                <div className="text-nowrap table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>도서명</th>
                                <th>저자</th>
                                <th>발행일</th>
                                <th>가격</th>
                                <th>출판사</th>
                                <th>페이지 수</th>
                                <th>장르</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookList.map(book=>(
                                <tr key={book.bookId}>
                                    <td>{book.bookTitle}</td>
                                    <td>{book.bookAuthor}</td>
                                    <td>{book.bookPublicationDate}</td>
                                    <td>{book.bookPrice}</td>
                                    <td>{book.bookPublisher}</td>
                                    <td>{book.bookPageCount}</td>
                                    <td>{book.bookGenre}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>);
}

export default Exam09