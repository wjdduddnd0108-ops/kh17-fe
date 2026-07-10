import Jumbotron from "@templates/Jumbotron";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Col, Form, ListGroup, Row } from "react-bootstrap";

export default function CountrySearch(){
    //state
    const [keyword, setKeyword] = useState("");
    const [searchList, setSearchList] = useState([]);
    const [composition, setComposition] = useState(false);//입력 글자가 조합중인지 상태값

    //입력중인 값을 제거한 검색용 키워드
    const [result, setResult] = useState("");

    //callback
    const changeKeyword = useCallback(e=>{
        //e.data가 존재하면 onCompositionUpdate 상황, 없으면 onChange 상황
        if(e.data !== undefined){//onCompositionUpdate 상황이면 e.data를 확인해서 keyword를 갱신
            // console.log(e.target.value, e.data);
            setResult(e.target.value.substring(0, e.target.value.length-1));
        }
        else{//onChange 상황 (기존처럼 keyword를 업데이트)
            setKeyword(e.target.value);
        }
    }, []);

    useEffect(()=>{
        searchKeyword();
    }, [result]);

    //effect
    // - keyword가 변하면 ajax 요청을 서버로 전송
    // useEffect(()=>{
    //     searchKeyword();
    // }, [keyword]);

    const searchKeyword = useCallback(async()=>{
        console.log(composition, keyword);
         if(result.length === 0) {
            setSearchList([]);
            return;
        }

        const response = await axios.get(`/api/country/countryName/${result}`);
        setSearchList(response.data);
    },[result, composition]);

    return(<>
        <Jumbotron title="국가명 검색 샘플"/>

        {/* 검색창 */}
        <Row className="mt-4">
            <Col>
                <div className="position-relative">
                    <Form.Control placeholder="검색어 입력" size="lg"
                        value={keyword}
                        onChange={changeKeyword}
                        onCompositionStart={e=>setComposition(true)}
                        onCompositionUpdate={changeKeyword}
                        onCompositionEnd={e=>{
                            setResult(e.target.value);
                            setComposition(false)
                        }}/>
                    <ListGroup className="position-absolute start-0 end-0 top-100">
                        {searchList.map(country=>(
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