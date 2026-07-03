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
                <div class="text-nowrap table-responsive">
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