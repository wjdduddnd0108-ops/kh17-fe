import { useCallback, useEffect, useState } from "react";
import Jumbotron from "../../templates/Jumbotron";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa6";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

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
    const loadMoreList = useCallback(()=>{
        const dataSize = countryList.length;
        const lastCountryNo = dataSize === 0 ? 0 : countryList[dataSize-1].countryNo;

        axios({
            url:"http://localhost:8080/api/country/listForReact",
            method: "get",
            params: {
                lastCountryNo : lastCountryNo,
                size : size
            }
        })
        .then(response=>{
            //덮어쓰기가 아니라 추가(이어쓰기)가 필요
            //setCountryList(response.data.list);//덮어쓰기
            setCountryList([...countryList, ...response.data.list]);//이어쓰기
            setLast(response.data.last);
        });
    }, [countryList, size]);

    return(<>
        <Jumbotron title="국가 목록" content="등록된 국가들의 목록을 확인하세요"/>

        <Row className="mt-4">
            <Col>
                <Form.Select value={size} onChange={e=>setSize(parseInt(e.target.value))}>
                    <option value="5">5개씩 보기</option>
                    <option value="10">10개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                </Form.Select>
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
                                <td>{country.countryName}</td>
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