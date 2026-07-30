import Jumbotron from "@templates/Jumbotron";
import { apiClient } from "@utils/reaxios";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Button, Col, Row, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";

import NoImage from "@assets/images/no-image.png";
import { purifyHtml } from "@utils/purify";

export default function SaleDetail(){
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
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    
    //썸네일 주소 계산
    const thumbnailUrl = useMemo(()=>{
        if(thumbnail === null) return NoImage;
        return `${import.meta.env.VITE_SERVER_URL}/api/attach/${thumbnail.attachNo}`
    })

    //sale은 절대로 null이면 안된다
    //-> sale이 null이면 기다려야 한다
    if(sale === null){
        return <h1>기다려</h1>
    }

    return(<>
        <Jumbotron title="상품 상세 정보" content="??? 상품에 대한 상세정보입니다"/>

        <Row className="mt-5">
            {/* 썸네일 영역 */}
            <Col sm={6}>
                <img src={thumbnailUrl} width={"100%"}/>
            </Col>
            {/* 상품정보 영역 */}
            <Col sm={6}>
                <h4>{sale.saleName}</h4>
                <div>
                    <Badge bg="info">{sale.saleCategory}</Badge>
                </div>
                { sale.saleOriginalPrice === sale.saleDiscountPrice && (
                    <div>
                        <b className="text-info">{sale.saleOriginalPrice.toLocaleString()}원</b>
                    </div>
                )}
                {/* 할인이 있는 경우 */}
                { sale.saleOriginalPrice > sale.saleDiscountPrice &&(
                    <div>
                        <s className="text-info">{sale.saleOriginalPrice.toLocaleString()}원</s>
                        <b className="text-danger ms-2">00%</b>
                        <br/>
                        <b className="text-danger fs-4">
                            {sale.saleDiscountPrice.toLocaleString()}원
                        </b>
                    </div>
                )}

                {/* 구매수량 선택 및 구매or장바구니버튼 */}
                <div className="mt-5">
                    현재 <b>{sale.saleStock.toLocaleString()}</b>개 남음
                </div>
                <div className="mt-2">
                    <Form.Control type="number" className="d-inline-block"
                            style={{widht:80}} value={1}/>
                    <Button variant="success">구매</Button>
                    <Button variant="secondary">담기</Button>
                </div>
            </Col>
        </Row>

        {/* 상세 이미지들 출력 */}
        <Row className="mt-5">
            <Col>
            {detailImages.map(detail=>{
                const url = `${import.meta.env.VITE_SERVER_URL}/api/attach/${detail.attachNo}`;
                return(
                    <img key={detail.attachNo} src={url} width={"100%"}/>
                )
            })}
            </Col>
        </Row>

        {/* 추가 상세정보 출력 */}
        <Row className="mt-5">
            <Col>
                {/* 
                    모던 웹에서는 HTML 렌더링을 극도로 경계하며
                    이는 위험한 보안 문제가 발생할 수 있음
                    (XSS : cross site script 공격)

                    ->위험 요소를 제거하는 라이브러리(ex : dompurify)를 사용
                */}
                <div dangerouslySetInnerHTML={
                    // { __html: sale.saleContent }
                    { __html:purifyHtml(sale.saleContent) }
                }></div>
            </Col>
        </Row>

        {/*
        관리자만 볼 수 있는 삭제버튼을 누르면 경고창 출력 후 확인을 누르면 서버로 
        신호를 보내 삭제 그 후 목록으로 이동 서버의 주소: /api/sale/{saleNo} [DELETE]
        */}
    </>)
}