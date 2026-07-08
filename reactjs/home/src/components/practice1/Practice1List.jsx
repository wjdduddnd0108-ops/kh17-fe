import { useCallback, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Jumbotron from "@templates/Jumbotron";
import axios from "axios";
import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { ClockLoader } from "react-spinners";
import { Col, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Practice1List() {
    //state
    const [practice1List, setPractice1List] = useState([]);
    const [last, setLast] = useState(false);
    const [size, setSize] = useState(6);
    const [loading, setLoading] = useState(false);

    //effect
    useEffect(() => {
        loadMoreList();
    }, []);

    //callback
    // const loadMoreList = useCallback(() => {
    //     const dataSize = practice1List.length;
    //     const lastPractice1No = dataSize === 0 ? 0 : practice1List[dataSize - 1].practice1No;

    //     setLoading(true);

    //     axios({
    //         url: "http://localhost:8080/api/practice1/listForReact",
    //         method: "get",
    //         params: {
    //             lastPractice1No: lastPractice1No,
    //             size: size
    //         }
    //     })
    //         .then(response => {
    //             setPractice1List([...practice1List, ...response.data.list]);
    //             setLast(response.data.last);
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //         });
    // }, [practice1List, size]);

    const loadMoreList = useCallback(async () => {
        const dataSize = practice1List.length;
        const lastPractice1No = dataSize === 0 ? 0 : practice1List[dataSize - 1].practice1No;

        setLoading(true);
        
        const response = await axios.get("/api/practice1/listForReact", {
            params: {
                lastPractice1No: lastPractice1No,
                size: size
            }
        });
        setPractice1List([...practice1List, ...response.data.list]);
        setLast(response.data.last);

        setLoading(false);
    }, [practice1List, size]);

    return (<>
        <Jumbotron title="강좌 목록" />

        <Row className="mt-4">
            <Col xs={6}>
                <Form.Select value={size} onChange={e => setSize(parseInt(e.target.value))}>
                    <option value="6">6개씩 보기</option>
                    <option value="12">12개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                </Form.Select>
            </Col>
            <Col xs={6} className="text-end">
                <Button as={Link} to="/practice1/add" variant="success">
                    <FaPlus/>
                    <span className="ms-2">신규 등록</span>
                </Button>
            </Col>

        </Row>

        <Row className="mt-4">
            {practice1List.map(practice1 => (
                <Col md={6} lg={4} key={practice1.practice1No}>
                    <Card className="mb-3">
                        <Card.Header className="text-truncate">
                            <h3>{practice1.practice1Name}</h3>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title className="mb-4 text-muted">
                                <h5>{practice1.practice1Category}</h5>
                            </Card.Title>
                            <Card.Text>
                                강좌설명
                            </Card.Text>
                        </Card.Body>

                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                수강시간: {practice1.practice1Time}
                            </li>
                            <li className="list-group-item">
                                수강료: {practice1.practice1Price?.toLocaleString()}원
                            </li>
                            <li className="list-group-item">
                                수업형태: {practice1.practice1CourseType}
                            </li>
                        </ul>

                        <Card.Body>                       
                            <Button
                                as={Link}
                                to={`/practice1/detail/${practice1.practice1No}`}
                                variant="primary"
                            >
                                상세정보 보기
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
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

        {loading === true && (
            <div className="position-fixed top-0 start-0 
                        w-100 h-100 bg-dark bg-opacity-25
                        d-flex justify-content-center align-items-center">
                <div className="d-flex flex-column text-center">
                    <ClockLoader size={75} loading={loading} />
                    <p className="mt-2">불러오는중</p>
                </div>
            </div>
        )}
    </>)
}