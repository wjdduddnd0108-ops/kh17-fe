import Jumbotron from "@templates/Jumbotron";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Col, Form, ListGroup, Row } from "react-bootstrap";
import { throttle, debounce } from "lodash-es";

export default function CountrySearch() {
    //state
    const [keyword, setKeyword] = useState("");
    const [searchList, setSearchList] = useState([]);

    //callback
    const changeKeyword = useCallback(e => {
        setKeyword(e.target.value);
    }, []);

    //effect
    //- keyword가 변하면 ajax 요청을 서버로 전송
    useEffect(() => {
        searchKeyword(keyword);
    }, [keyword]);

    //throttle(함수, 실행주기) => 새로운 함수가 생성됨
    //- (주의) 함수를 만들 때 연관항목을 설정하지 말아야 한다 (함수가 재생성이 안되어야 함)
    //- 일반적으로 실행주기는 250ms ~ 350ms 정도가 적당 (1초에 3~4번)
    const searchKeyword = useCallback(throttle(async (keyword)=> {
        console.log("searchKeyword 실행");
        if(keyword.length === 0) {
            setSearchList([]);
            return;
        }
        const response = await axios.get(`/api/country/countryName/${keyword}`);
        setSearchList(response.data);
    }, 350), []);

    return (<>
        <Jumbotron title="국가명 검색 샘플" />

        {/* 검색창 */}
        <Row className="mt-4">
            <Col>
                <div className="position-relative">
                    <Form.Control placeholder="검색어 입력" size="lg"
                        value={keyword}
                        onChange={changeKeyword} />
                    <ListGroup className="position-absolute start-0 end-0 top-100">
                        {searchList.map(country => (
                            <ListGroup.Item key={country.countryNo}>
                                {country.countryName}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Col>
                <h2>결과가 표시될 영역</h2>
            </Col>
        </Row>
    </>)
}