import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "@utils/reaxios";
import { Button, Col, Form, Row } from "react-bootstrap";
import  Editor  from "react-simple-wysiwyg";
import { FaPlus, FaSquarePen, FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import NoImage from "@assets/images/no-image.png";

export default function AdminSaleEdit() {
    const navigate = useNavigate();

    const { saleNo } = useParams();

    //state
    const [sale, setSale] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [detailImages, setDetailImages] = useState([]);

    const loadData = useCallback(async () => {
        const { data } = await apiClient.get(`/sale/${saleNo}`);
        const { saleDto, thumbnail, details } = data;
        setSale(saleDto);
        setThumbnail(thumbnail);
        setDetailImages(details);
        //할인 체크박스 처리 추가
        setDiscount(saleDto.saleOriginalPrice > saleDto.saleDicountPrice);
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    //할인 여부 선택 체크박스
    const [discount, setDiscount] = useState(false);

    //callback
    const changeStringValue = useCallback((e) => {
        const { name, value } = e.target;
        setSale(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);
    const changeNumericValue = useCallback((e) => {
        const { name, value } = e.target;
        const replacement = value.replace(/[^0-9]+/g, "");
        const result = replacement.length === 0 ? "" : parseInt(replacement);
        setSale(prev => ({
            ...prev,
            [name]: result
        }));
    }, []);

    //할인을 해제하면 할인가를 삭제
    useEffect(() => {
        if (discount === false) {
            setSale(prev => ({ ...prev, saleDiscountPrice: "" }))
        }
    }, [discount]);

    //수정 정보 전송 함수
    const sendData = useCallback(async ()=>{
        //- 할인 여부에 따른 데이터 제거 처리
        const { saleDiscountPrice, ...copy } = sale;
        if(discount) copy.saleDiscountPrice = saleDiscountPrice;

        const form = new FormData();

        form.append("sale", new Blob(
            [ JSON.stringify(copy) ],
            { type : "application/json" }
        ))

        const { data } = await apiClient.put(`/sale/${saleNo}`, form);
        console.log(data);
    },[sale,discount])

    //sale은 절대로 null이면 안된다
    //-> sale이 null이면 기다려야 한다
    if (sale === null) {
        return <h1>로딩중...</h1>
    }

    return (<>
        <Jumbotron title="상품 정보 수정" />

        <Row className="mt-5">
            <Form.Label column sm={3}>상품명</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="saleName" value={sale.saleName}
                    onChange={changeStringValue} placeholder="e.g., 갤럭시 노트 8" />
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>카테고리</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="saleCategory" value={sale.saleCategory}
                    onChange={changeStringValue} placeholder="e.g., 통신기기" />
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>정가</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="saleOriginalPrice" value={sale.saleOriginalPrice}
                    onChange={changeNumericValue} placeholder="e.g., 2000000" />
            </Col>
        </Row>

        <Row className="mt-2">
            <Col sm={{ offset: 3, span: 9 }}>
                <Form.Check type="switch" label="할인 적용"
                    checked={discount}
                    onChange={e => setDiscount(e.target.checked)} />
            </Col>
        </Row>
        {discount && (
            <Row className="mt-2">
                <Form.Label column sm={3}>할인가</Form.Label>
                <Col sm={9}>
                    <Form.Control type="text" name="saleDiscountPrice" value={sale.saleDiscountPrice}
                        onChange={changeNumericValue} placeholder="e.g., 1990000" />
                </Col>
            </Row>
        )}

        <Row className="mt-4">
            <Form.Label column sm={3}>재고수량</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="saleStock" value={sale.saleStock}
                    onChange={changeNumericValue} placeholder="e.g., 10" />
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>상세설명</Form.Label>
            <Col sm={9}>

                <Editor name="saleContent" value={sale.saleContent}
                    onChange={changeStringValue}
                    containerProps={
                        {
                            style: {
                                resize: "none",//or vertical
                                minHeight: 250
                            }
                        }
                    } />
            </Col>
        </Row>

        <Row className="mt-5">
            <Col className="text-end">
                <Button variant="success" size="lg" className="w-md-auto"
                    onClick={sendData}>
                    <FaSquarePen/>
                    <span className="ms-2">상품 수정하기</span>              
                </Button>
            </Col>
        </Row>
    </>)
}