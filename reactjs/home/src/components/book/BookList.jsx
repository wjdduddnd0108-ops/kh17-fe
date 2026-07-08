import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import Jumbotron from "../../templates/Jumbotron";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function BookList() {
    //state
    const [bookList, setBookList] = useState([]);
    const [last, setLast] = useState(false);
    const [size, setSize] = useState(10);

    //effect
    useEffect(() => {
        loadMoreList();
    }, []);

    //callback
    const loadMoreList = useCallback(async() => {
        const dataSize = bookList.length;
        const lastBookId = dataSize === 0 ? 2147483647 : bookList[dataSize - 1].bookId;

        const response = await axios.post(
            `/api/book/list-more`, 
            { lastNo : lastBookId, size : size}
        )
        setBookList([...bookList, ...response.data.list]);
        setLast(response.data.last);

    }, [bookList, size]);

    return (<>
        <Jumbotron title="도서 목록" />

        <Row className="mt-4">
            <Col xs={6}>
                <Form.Select value={size} onChange={e => setSize(parseInt(e.target.value))}>
                    <option value="5">5개씩 보기</option>
                    <option value="10">10개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                </Form.Select>
            </Col>
            <Col xs={6} className="text-end">
                <Button as={Link} to="/book/add" variant="success">
                    <FaPlus />
                    <span className="ms-2">신규 등록</span>
                </Button>
            </Col>
        </Row>

        <Row className="mt-4">
            <Col>
                <ul className="list-group">
                    {bookList.map(book => (
                        <li className="list-group-item" key={book.bookId}>
                            <Link to ={`/book/detail/${book.bookId}`}>
                                <h3>{book.bookTitle}</h3>
                            </Link>

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
                        </li>
                    ))}
                </ul>
            </Col>
        </Row>

        {/* 더보기 버튼 */}
        {last === false && (
            <Row className="mt-2">
                <Col>
                    <Button variant="outline-success" size="lg" onClick={loadMoreList} className="w-100">
                        <FaChevronDown />
                        <span className="mx-2">더보기</span>
                        <FaChevronDown />
                    </Button>
                </Col>
            </Row>
        )}
    </>)
}