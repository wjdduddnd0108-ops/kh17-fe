import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Jumbotron from "../../templates/Jumbotron";
import { Button, Col, Row, Form } from "react-bootstrap";
import { FaAsterisk, FaList, FaSquarePen, FaXmark } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";

export default function BookEdit() {
    const { bookId } = useParams();

    if (/^[0-9]+$/.test(bookId) === false) {//숫자가 아니면
        toast.error("없는 도서입니다.");
        return <Navigate to="/book/list" replace />;
    }

    const navigate = useNavigate();

    const [book, setBook] = useState({
        bookTitle: "",
        bookAuthor: "",
        bookPublicationDate: "",
        bookPublisher: "",
        bookPrice: 0,
        bookPageCount: 0,
        bookGenre: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(async () => {
        const response = await axios.get(`/api/book/${bookId}`)
        setBook(response.data);
    }, []);

    //state
    
    const [result, setResult] = useState({
        bookTitle: null,
        bookAuthor: null,
        bookPublicationDate: null,
        bookPublisher: null,
        bookPrice: null,
        bookPageCount: null,
        bookGenre: null,
    });
    const [loading, setLoading] = useState(false);

    //callback
    const changeStringValue = useCallback(e => {
        const { name, value } = e.target;
        setBook({
            ...book,
            [name]: value
        });
    }, [book]);
    const changeNumericValue = useCallback(e => {
        const { name, value } = e.target;
        const regex = /[^0-9]+/g;
        const replacement = value.replace(regex, "");
        const result = parseInt(replacement);
        setBook({
            ...book,
            [name]: (result || 0)
        });
    }, [book]);

    const checkBookTitle = useCallback(() => {
        const valid = book.bookTitle.length > 0;
        setResult({
            ...result,
            bookTitle: valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookTitle, result]);

    const checkBookAuthor = useCallback(() => {
        const regex = /^[^!@#$]+$/;
        const valid = book.bookAuthor.length === 0 ||
            regex.test(book.bookAuthor);
        setResult({
            ...result,
            bookAuthor: valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookAuthor, result]);

    const checkBookPublicationDate = useCallback(() => {
        const regex = /^([0-9]{4})-(((02)-(0[1-9]|1[0-9]|2[0-9]))|((0[469]|11)-(0[1-9]|1[0-9]|2[0-9]|30))|((0[13578]|1[02])-(0[1-9]|1[0-9]|2[0-9]|3[01])))$/;
        const valid = book.bookPublicationDate.length === 0
            || regex.test(book.bookPublicationDate);
        setResult({
            ...result,
            bookPublicationDate: valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookPublicationDate, result]);

    const checkBookPublisher = useCallback(() => {
        setResult({
            ...result,
            bookPublisher: "is-valid"
        });
    }, [book.bookPublisher, result]);

    const checkBookPrice = useCallback(() => {
        const valid = book.bookPrice > 0;
        setResult({
            ...result,
            bookPrice: valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookPrice, result]);

    const checkBookPageCount = useCallback(() => {
        const valid = book.bookPageCount > 0;
        setResult({
            ...result,
            bookPageCount: valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookPageCount, result]);

    const checkBookGenre = useCallback(() => {
        const regex = /^(판타지|교양|소설|역사|과학|추리소설|자기계발|수험서)$/;
        const valid = regex.test(book.bookGenre);

        // const valid = ["판타지","교양","소설","역사","과학","추리소설","자기계발","수험서"].includes
        setResult({
            ...result,
            bookGenre: valid ? "is-valid" : "is-invalid"
        });
    }, [book.bookGenre, result]);

    //memo
    const valid = useMemo(() => {
        if (result.bookTitle !== "is-valid") return false;
        if (result.bookAuthor === "is-invalid") return false;
        if (result.bookPublicationDate === "is-invalid") return false;
        if (result.bookPublisher === "is-invalid") return false;
        if (result.bookPrice !== "is-valid") return false;
        if (result.bookPageCount !== "is-valid") return false;
        if (result.bookGenre !== "is-valid") return false;
        return true;
    }, [result]);

    //effect
    useEffect(() => {
        if (book.bookGenre === "" && result.bookGenre === null)
            return;

        checkBookGenre();
    }, [book.bookGenre, result.bookGenre]);

    //데이터 전송 함수
    const send = useCallback(async () => {
        const response = await axios.put(`/api/book/${bookId}`, book);
        navigate(`/book/detail/${bookId}`);
        toast.success("도서 수정이 완료되었습니다");
    }, [bookId, book, navigate]);

    return (<>
        <Jumbotron title="도서 정보 수정" />

        <Row className="mt-4">
            <Form.Label column sm={3}>
                도서명
                <FaAsterisk className="text-danger" />
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="bookTitle" className={result.bookTitle} value={book.bookTitle}
                    onChange={changeStringValue} onBlur={checkBookTitle} />
                <div className="invalid-feedback">필수항목입니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>지은이</span>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="bookAuthor" className={result.bookAuthor} value={book.bookAuthor|| ""}
                    onChange={changeStringValue} onBlur={checkBookAuthor} />
            </Col>
        </Row>


        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>출간일</span>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="date" name="bookPublicationDate" className={result.bookPublicationDate} value={book.bookPublicationDate|| ""}
                    onChange={changeStringValue} onBlur={checkBookPublicationDate} />
                <div className="invalid-feedback">올바르지 않은 년도입니다</div>
            </Col>
        </Row>


        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>판매가</span>
                <FaAsterisk className="text-danger" />
            </Form.Label>
            <Col sm={9}>
                <Form.Control inputMode="numeric" type="text" name="bookPrice" className={result.bookPrice} value={book.bookPrice}
                    onChange={changeNumericValue} onBlur={checkBookPrice} />
                <div className="invalid-feedback">0 이상의 숫자를 입력해주세요</div>
            </Col>
        </Row>


        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>출판사</span>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="bookPublisher" className={result.bookPublisher} value={book.bookPublisher|| ""}
                    onChange={changeStringValue} onBlur={checkBookPublisher} />
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>페이지 수</span>
                <FaAsterisk className="text-danger" />
            </Form.Label>
            <Col sm={9}>
                <Form.Control inputMode="numeric" type="text" name="bookPageCount" className={result.bookPageCount} value={book.bookPageCount}
                    onChange={changeNumericValue} onBlur={checkBookPageCount} />
                <div className="invalid-feedback">0 이상의 숫자를 입력해주세요</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>장르</span>
                <FaAsterisk className="text-danger" />
            </Form.Label>
            <Col sm={9}>
                <Form.Select name="bookGenre" value={book.bookGenre} onChange={changeStringValue}
                    className={result.bookGenre}>
                    <option value="">선택하세요</option>
                    <option>판타지</option>
                    <option>교양</option>
                    <option>소설</option>
                    <option>역사</option>
                    <option>과학</option>
                    <option>추리소설</option>
                    <option>자기계발</option>
                    <option>수험서</option>
                </Form.Select>

                <div className="invalid-feedback">필수항목입니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Col className="text-end">
                <Button as={Link} to={"/book/list"} variant="secondary">
                    <FaList className="me-2" />
                    <span>목록으로</span>
                </Button>
                <Button as={Link} to={`/book/detail/${bookId}`} variant="danger" className="ms-2">
                    <FaXmark className="me-2" />
                    <span>취소하기</span>
                </Button>
                <Button type="button" variant="success" className="ms-2"
                    disabled={valid === false} onClick={send}>
                    <FaSquarePen className="me-2" />
                    <span>수정하기</span>
                </Button>
            </Col>
        </Row>
    </>)
}