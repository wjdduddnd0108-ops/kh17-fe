import { useCallback, useEffect, useState } from "react";
import Jumbotron from "../../templates/Jumbotron";
import axios from "axios";
import { FaChevronDown, FaPlus } from "react-icons/fa6";
// import Row from "react-bootstrap/esm/Row";
// import Col from "react-bootstrap/esm/Col";
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import Table from 'react-bootstrap/Table';
import { Row, Col, Form, Table, Button} from "react-bootstrap"
import { Link } from "react-router-dom";

export default function CountryList(){
    //state
    const [countryList, setCountryList] = useState([]);
    const [last, setLast] = useState(false);
    const [size, setSize] = useState(10);

    //effect
    useEffect(() => {
       loadMoreList();
    }, []);

    //callback
    const loadMoreList = useCallback(async ()=>{
        const dataSize = countryList.length;
        const lastCountryNo = dataSize === 0 ? 0 : countryList[dataSize-1].countryNo;


        // const response = await axios.get(
        //     `http://localhost:8080/api/country/lastCountryNo/${lastCountryNo}/size/${size}`
        // );

        const response = await axios.post(
            // "http://localhost:8080/api/country/list-more",
            `/api/country/list-more`,
            { lastNo : lastCountryNo, size : size}
        )
        setCountryList([...countryList, ...response.data.list]);//이어쓰기
        setLast(response.data.last);

    }, [countryList, size]);

    return(<>
        <Jumbotron title="국가 목록" content="등록된 국가들의 목록을 확인하세요"/>

        <Row className="mt-4">
            <Col xs={6}>
                <Form.Select value={size} onChange={e=>setSize(parseInt(e.target.value))}>
                    <option value="5">5개씩 보기</option>
                    <option value="10">10개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                </Form.Select>
            </Col>
            <Col xs={6} className="text-end">
                {/* <Link to="/country/add" className="btn btn-success">
                    <FaPlus/>
                    <span className="ms-2">신규등록</span>
                </Link> */}

                <Button as={Link} to="/country/add" variant="success">
                    <FaPlus/>
                    <span className="ms-2">신규 등록</span>
                </Button>
            </Col>
        </Row>

        <Row className="mt-4">
            <Col>
                <Table responsive striped hover className="text-nowrap">
                    <thead>
                        <tr>
                            <th>국가명</th>
                            <th>대륙명</th>
                            <th>수도명</th>
                            <th className="text-end">인구</th>
                        </tr>
                    </thead>
                    <tbody>
                        {countryList.map(country => (
                            <tr key={country.countryNo}>
                                <td>
                                    <Link to={`/country/detail/${country.countryNo}`}>
                                        {country.countryName}
                                    </Link>
                                    </td>
                                <td>{country.countryRegion}</td>
                                <td>{country.countryCapital}</td>
                                <td className="text-end">{country.countryPopulation}</td> 
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>

        {/* 더보기 버튼 */}
        { last === false &&(
            <Row className="mt-2">
                <Col>
                    <Button variant="outline-success" size="lg" onClick={loadMoreList} className="w-100">
                        <FaChevronDown/>
                        <span className="mx-2">더보기</span>
                        <FaChevronDown/>
                    </Button>    
                </Col>
            </Row>
        ) } 
    </>)
}