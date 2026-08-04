import Jumbotron from "@templates/Jumbotron";
import { useCallback, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaMoneyCheck } from "react-icons/fa6";
import { apiClient } from "@utils/reaxios";
import { useNavigate } from "react-router-dom";

export default function KakaopayBuyVersion1(){
    //state
    const [buy, setBuy] = useState({
        name : "",
        price : 0
    });
    const changeStringValue = useCallback(e=>{
        const { name, value } = e.target;
        setBuy(prev=>(
            {
            ...prev, [name] : value
            }
    ))
    },[]);
    const changeNumericValue = useCallback(e=>{
        const { name, value } = e.target;
        const replacement = value.replace(/[^0-9]+/g, "");
        const number = parseInt(replacement) || 0;
        setBuy(prev=>(
            {
            ...prev, [name] : number
            }
    ))
    },[]);

    const navigate = useNavigate();
    const purchase = useCallback(async ()=>{
        const { data } = await apiClient.post("/kakaopay/v1/buy", buy);
        navigate(data.url);
    }, [buy])

    return(<>
        <Jumbotron title="세상 무식한 결제 테스트" content="실제로 일어날리 없는 방식"/>

        <Row className="mt-5">
            <Form.Label column sm={3}>상품명</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="name" placeholder="e.g., 한우 A++ 세트"
                        value={buy.name} onChange={changeStringValue}/>
            </Col>
        </Row>
        <Row className="mt-5">
            <Form.Label column sm={3}>결제금액</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" inputMode="numeric"
                        name="price" placeholder="e.g., 500000"
                        value={buy.price} onChange={changeNumericValue}/>
            </Col>
        </Row>

        <Row className="mt-5">
            <Col>
                <Button variant="success" size="lg" className="w-100" onClick={purchase}>
                    <FaMoneyCheck/>
                    <span className="ms-2">구매하기</span>
                </Button>
            </Col>
        </Row>
    </>);
}