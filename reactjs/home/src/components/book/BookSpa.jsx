import Jumbotron from "@templates/Jumbotron";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Button, Col, Container, Form, ListGroup, Modal, Row } from "react-bootstrap";
import { FaAsterisk, FaChevronDown, FaPen, FaPlus, FaSquarePen, FaTrash, FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function BookSpa() {
    //모달을 띄우기 위한 state
    const [modal, setModal] = useState(false);

    const closeModal = useCallback(() => {
        resetBook();
        setModal(false);
    }, []);

    //목록
    //state
    const [bookList, setBookList] = useState([]);
    const [last, setLast] = useState(false);
    const [size, setSize] = useState(10);

    //effect
    useEffect(() => {
        loadList();
    }, []);

    //callback
    const loadList = useCallback(async () => {
        const dataSize = bookList.length;
        const lastBookId = dataSize === 0 ? 2147483647 : bookList[dataSize - 1].bookId;

        const response = await axios.post(
            `/api/book/list-more`,
            { lastNo: lastBookId, size: size }
        )
        setBookList([...bookList, ...response.data.list]);
        setLast(response.data.last);

    }, [bookList, size]);

    const lastBookId = useMemo(() => {
        return bookList.length > 0 ? bookList[bookList.length - 1].bookId : 0;
    }, [bookList]);

    //등록
    const [book, setBook] = useState({
        bookTitle: "",
        bookAuthor: "",
        bookPublisher: "",
        bookPublicationDate: "",
        bookPrice: 0,
        bookPageCount: 0,
        bookGenre: "",
    });

    const [result, setResult] = useState({
        bookTitle: null,
        bookAuthor: null,
        bookPublisher: null,
        bookPublicationDate: null,
        bookPrice: null,
        bookPageCount: null,
        bookGenre: null,
    });

    const changeStringValue = useCallback(e => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
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
    })

    const checkBookTitle = useCallback(() => {
        const valid = book.bookTitle.length > 0;
        // setResult({
        //     ...result,
        //     bookTitle: valid ? "is-valid" : "is-invalid"
        // });
        
        //만약 동시다발적인 setResult가 발생할 수 있고 이 경우 순차적인 실행을 원한다면 (동기 실행)
        setResult(prev=>({
            ...prev,
            bookTitle : valid ? "is-valid" : "is-invalid"
        }))
    }, [book.bookTitle, result]);

    const checkBookAuthor = useCallback(() => {
        const regex = /^[^!@#$]+$/;
        // const valid = book.bookAuthor?.length === 0 
        // || regex.test(book.bookAuthor);//없거나 형식에 맞거나
        const valid = !book.bookAuthor || regex.test(book.bookAuthor);
        // setResult({
        //     ...result,
        //     bookAuthor: valid ? "is-valid" : "is-invalid"
        // });

        setResult(prev=>({
            ...prev,
            bookAuthor: valid ? "is-valid" : "is-invalid"
        }))
    }, [book.bookAuthor, result]);

    const checkBookPublicationDate = useCallback(() => {
        const regex = /^([0-9]{4})-(((02)-(0[1-9]|1[0-9]|2[0-9]))|((0[469]|11)-(0[1-9]|1[0-9]|2[0-9]|30))|((0[13578]|1[02])-(0[1-9]|1[0-9]|2[0-9]|3[01])))$/;
        // const valid = book.bookPublicationDate?.length == 0 
        // || regex.test(book.bookPublicationDate);
        const valid = !book.bookPublicationDate || regex.test(book.bookPublicationDate);
        // setResult({
        //     ...result,
        //     bookPublicationDate: valid ? "is-valid" : "is-invalid"
        // });

        setResult(prev=>({
            ...prev,
            bookPublicationDate: "is-valid"
        }))
    }, [book.bookPublicationDate, result]);

    const checkBookPublisher = useCallback(() => {
        // setResult({
        //     ...result,
        //     bookPublisher: "is-valid"
        // });

        setResult(prev=>({
            ...prev,
            bookPublisher: "is-valid"
        }))
    }, [book.bookPublisher, result]);

    const checkBookPrice = useCallback(() => {
        const valid = book.bookPrice > 0;
        // setResult({
        //     ...result,
        //     bookPrice: valid ? "is-valid" : "is-invalid"
        // });

        setResult(prev=>({
            ...prev,
            bookPrice: valid ? "is-valid" : "is-invalid"
        }))

    }, [book.bookPrice, result]);

    const checkBookPageCount = useCallback(() => {
        const valid = book.bookPageCount > 0;
        // setResult({
        //     ...result,
        //     bookPageCount: valid ? "is-valid" : "is-invalid"
        // });
        setResult(prev=>({
            ...prev,
            bookPageCount: valid ? "is-valid" : "is-invalid"
        }))
    }, [book.bookPageCount, result]);

    const checkBookGenre = useCallback(() => {
        const regex = /^(판타지|교양|소설|역사|과학|추리소설|자기계발|수험서)$/;
        const valid = regex.test(book.bookGenre);
        // const valid = ["판타지","교양","소설","역사","과학","추리소설","자기계발","수험서"].includes
        // setResult({
        //     ...result,
        //     bookGenre: valid ? "is-valid" : "is-invalid"
        // });

        setResult(prev=>({
            ...prev,
            bookGenre: valid ? "is-valid" : "is-invalid"
        }))
    }, [book.bookGenre, result]);

    useEffect(() => {
        if (book.bookGenre === "" && result.bookGenre === null)
            return;

        checkBookGenre();
    }, [book.bookGenre, result.bookGenre]);

    const allValid = useMemo(() => {
        if (result.bookTitle !== "is-valid") return false;//필수
        if (result.bookAuthor === "is-invalid") return false;//선택
        if (result.bookPublisher === "is-invalid") return false;//선택
        if (result.bookPublicationDate === "is-invalid") return false;//선택
        if (result.bookPrice !== "is-valid") return false;//필수
        if (result.bookPageCount !== "is-valid") return false;//필수
        if (result.bookGenre !== "is-valid") return false;//필수
        return true;
    }, [result]);

    const resetBook = useCallback(() => {
        setBook({
            bookTitle: "",
            bookAuthor: "",
            bookPublisher: "",
            bookPublicationDate: "",
            bookPrice: 0,
            bookPageCount: 0,
            bookGenre: "",
        });
        setResult({
            bookTitle: null,
            bookAuthor: null,
            bookPublisher: null,
            bookPublicationDate: null,
            bookPrice: null,
            bookPageCount: null,
            bookGenre: null,
        });
    }, []);

    //전송
    const send = useCallback(async ()=>{
        const response = await axios.post("/api/book/", book);
        toast.success("신규 도서가 등록되었습니다");
        //setModal(false);//모달을 닫는건 맞지만...(권장하지 않음)
        closeModal();//모달을 닫는 함수를 부른다 (권장)

        //목록 갱신을 어떻게 할것인가?
        //1. 내가 등록한 데이터만 목록 맨 앞에 추가한다 (갱신한 척 한다)
        //2. 진짜 목록을 갱신하다

        //1. setBookList([신규정보, 기존목록])
        //setBookList([response.data, ...bookList]);

        //- 값 변경을 함수 형태로 설정하면 과거값을 추적하지 않아도 사용 가능
        setBookList(prev=>([response.data, ...prev]));
    }, [book, /*bookList*/]);

    const edit = useCallback(async ()=>{
        const response = await axios.put(`/api/book/${book.bookId}`, book);
        toast.success(`${book.bookId}번 도서 정보 변경완료`);
        closeModal();
        //서버의 응답 결과(response.data)를 bookList에서 찾아서 덮어쓰기한다 (목록이 갱신된 척한다)
        //setBookList(bookList.map(...));
        setBookList(prev=>prev.map(book=>{
            if(book.bookId === response.data.bookId){//내가찾던책이면
                return {...response.data};//서버가 보내준 결과로 바꿔주고
            }
            return {...book};//나머지는 그대로 재사용
        }));
    },[book]);

    //수정용으로 모달을 띄우는 함수
    const openModal = useCallback(()=>{
        setModal(true);
    },[]);
    const openModalToEdit = useCallback(target=>{
        // setBook(target);//target이 쳐다보는 대상을 동일하게 쳐다보도록 설정해라(얕은복사, shallow copy)
        setBook({...target});//target의 모든 데이터를 복사해서 쳐다보도록 설정해라 (깊은복사, deep copy)
        openModal();
    },[]);

    const isAddMode = useMemo(()=>{
       return book.bookId === undefined
    }, [book]);

    //isAddMode가 true가 되면 수정이 시작되었다는 뜻이므로 검사를 미리 한번 수행해두자
    useEffect(()=>{
        if(isAddMode === true) return;

        checkBookTitle();
        checkBookAuthor();
        checkBookPublisher();
        checkBookPublicationDate();
        checkBookPrice();
        checkBookPageCount();
    }, [isAddMode]);

    //도서 삭제 함수
    const deleteBook = useCallback(async (target)=>{
        const result = await Swal.fire({
            title: "정말 삭제하시겠습니까?",
            text: "삭제 후에는 복구할 수 없습니다",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
            confirmButtonColor: "#d63031",
            cancelButtonColor: "#b2bec3"
        })
        if(result.isConfirmed === false) return;
        const response = await axios.delete(`/api/book/${target.bookId}`);
        //목록에서 찾아서 삭제하여 지워진 척
        setBookList(prev=>prev.filter(
            book => book.bookId !== target.bookId
        ))
        //알림
        toast.error("도서 삭제가 완료되었습니다")
    },[]);

    return (<>

        <Jumbotron title="도서 CRUD 통합 구현" content="한 페이지에서 CRUD를 모두 처리해봅니다" />

        {/* 등록을 위한 모달을 띄우는 버튼 */}
        <Row className="mt-4">
            <Col className="text-end" onClick={openModal}>
                <Button>
                    <FaPlus />
                    <span>신규 등록</span>
                </Button>
            </Col>
        </Row>

        {/* 목록 */}
        <Row className="mt-4">
            <Col>
                <ListGroup>
                    {bookList.map(book => (
                        <ListGroup.Item key={book.bookId}>
                            <div className="p-4">
                                <h2 className="d-flex align-items-end">
                                    <Badge>{book.bookId}</Badge>
                                    <span className="ms-2">{book.bookTitle}</span>
                                    <small className="text-muted ms-4 fs-5">{book.bookGenre}</small>
                                </h2>
                                <hr />
                                <p className="text-muted">
                                    <span>{book.bookAuthor || "작자 미상"}</span>
                                    <span>{book.bookPublisher}</span>
                                </p>
                                <p className="mt-2">도서에 대한 설명.....</p>
                                <hr />
                                <p className="text-info">
                                    <span className="me-4">{book.bookPrice.toLocaleString()}원</span>
                                    <span className="me-4">{book.bookPageCount.toLocaleString()}p</span>
                                    {book.bookPublicationDate && (
                                        <span className="ms-4">{book.bookPublicationDate}출간</span>
                                    )}
                                </p>

                                {/* 수정삭제 패널 */}
                                <div className="text-end">
                                    <FaSquarePen className="text-warning" size={36}
                                            onClick={e=>openModalToEdit(book)}/>
                                    <FaTrash className="text-danger ms-4" size={36}
                                            onClick={e=>{deleteBook(book)}}/>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                {/* 더보기 */}
                {last !== true && (
                    <Button variant="outline-info" className="w-100" onClick={loadList}>
                        <FaChevronDown />
                        <span className="mx-2">더보기</span>
                        <FaChevronDown />
                    </Button>
                )}
            </Col>
        </Row>

        {/* 모달 */}
        <Modal
            show={modal}
            onHide={closeModal}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {book.bookId === undefined ? "신규 도서 등록" : `${book.bookId}번도서정보 수정`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row className="mt-4">
                        <Form.Label column sm={3}>
                            <span>도서명</span>
                            <FaAsterisk className="text-danger" />
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" name="bookTitle" value={book.bookTitle}
                                onChange={changeStringValue} onBlur={checkBookTitle}
                                placeholder="e.g.,어린왕자" 
                                className={result.bookTitle}/>
                            <div className="valid-feedback">도서명이 설정되었습니다</div>
                            <div className="invalid-feedback">필수 작성 항목입니다</div>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Form.Label column sm={3}>지은이</Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" name="bookAuthor" value={book.bookAuthor}
                                onChange={changeStringValue} onBlur={checkBookAuthor}
                                placeholder="e.g.,J.K.롤링" 
                                className={result.bookAuthor}/>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Form.Label column sm={3}>출판사</Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" name="bookPublisher" value={book.bookPublisher}
                                onChange={changeStringValue} onBlur={checkBookPublisher}
                                placeholder="e.g.,어린왕자" 
                                className={result.bookPublisher}/>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Form.Label column sm={3}>출간일</Form.Label>
                        <Col sm={9}>
                            <Form.Control type="date" name="bookPublicationDate" value={book.bookPublicationDate}
                                onChange={changeStringValue} onBlur={checkBookPublicationDate} 
                                className={result.bookPublicationDate}/>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Form.Label column sm={3}>
                            <span>판매가</span>
                            <FaAsterisk className="text-danger" />
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" name="bookPrice" value={book.bookPrice}
                                onChange={changeNumericValue} onBlur={checkBookPrice}
                                inputMode="numeric"
                                placeholder="e.g.,10000" 
                                className={result.bookPrice}/>
                            <div className="valid-feedback">판매가 설정이 완료되었습니다</div>
                            <div className="invalid-feedback">정상적인 숫자 형태로 작성하세요</div>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        <Form.Label column sm={3}>
                            <span>페이지수</span>
                            <FaAsterisk className="text-danger" />
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" name="bookPageCount" value={book.bookPageCount}
                                onChange={changeNumericValue} onBlur={checkBookPageCount}
                                inputMode="numeric"
                                placeholder="e.g.,100" 
                                className={result.bookPageCount}/>
                            <div className="valid-feedback">페이지 설정이 완료되었습니다</div>
                            <div className="invalid-feedback">정상적인 숫자 형태로 작성하세요</div>
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
                            <div className="invalid-feedback">필수 선택항목입니다</div>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    <FaXmark/>
                    <span>취소하기</span>
                </Button>

                {isAddMode ? (
                <Button variant="success" disabled={allValid === false}
                    onClick={send}>
                    <FaPlus/>
                    <span>등록하기</span>
                </Button>
                ) : (
                <Button variant="warning" disabled={allValid === false}
                    onClick={edit}>
                    <FaPen/>
                    <span>수정하기</span>
                </Button>
                )}
            </Modal.Footer>
        </Modal>

    </>)
}