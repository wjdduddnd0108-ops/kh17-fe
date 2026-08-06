import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "@utils/reaxios";
import { ClockLoader } from "react-spinners";
import { Badge, Button, Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import NoImage from "@assets/images/no-image.png";
import { MdSubdirectoryArrowRight } from "react-icons/md";

import dayjs from "dayjs";

//상대시간 표시를 원할 경우 (000분전...)
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
//한국어로 설정
import "dayjs/locale/ko";
import { FaXmark } from "react-icons/fa6";
dayjs.locale("ko");

export default function KakaopayBuyDetailVersion2() {
    //path variable
    const { purchaseNo } = useParams();

    //state
    const [purchase, setPurchase] = useState(null);
    const [details, setDetails] = useState(null);
    const [payResponse, setPayResponse] = useState(null);

    useEffect(()=>{
        loadData();
    }, []);
    const loadData = useCallback(async ()=>{
        const { data } = await apiClient.get(`/purchase/heavy/${purchaseNo}`);
        const { purchase, details, payResponse } = data;
        setPurchase(purchase);
        setDetails(details);
        setPayResponse(payResponse);
        console.log(purchase, details, payResponse);
    }, []);

    //상품 개수까지 고려한 결제금액 계산
    const calculateTotalPrice = useCallback((detail)=>{
        if(!detail) throw "detail 없음";

        const { purchaseDetailQty, purchaseDetailPrice } = detail;
        const total = purchaseDetailPrice * purchaseDetailQty;
        return total.toLocaleString();
    }, []);

    //memo
    const withInPeriod = useMemo(()=>{
        if(purchase === null) return false;
        return dayjs().diff(purchase.purchaseCtime, 'day', false) <= 7;
    }, [purchase]);

    if(purchase === null || details === null || payResponse === null) {
        return (<>
            <Jumbotron title="상품 결제 상세" content="결제 내역을 불러오는 중입니다..."/>

            <Row className="mt-5">
                <Col>
                    <div className="d-flex justify-content-center align-items-center">
                        <ClockLoader size={100}/>
                    </div>
                </Col>
            </Row>
        </>);
    }

    return (<>
        <Jumbotron title="상품 결제 상세" content="PG사와 연동된 결제 정보 내역입니다"/>

        {/* 결제 대표 정보(purchase) */}
        <Row className="mt-2">
            <Col sm={3} className="text-info fw-bold">결제고유번호</Col>
            <Col sm={9} className="text-secondary">
                {String(purchase.purchaseNo).padStart(10, "0")}
            </Col>
        </Row>
        <Row className="mt-2">
            <Col sm={3} className="text-info fw-bold">결제 상품명</Col>
            <Col sm={9} className="text-secondary">
                {purchase.purchaseName}
            </Col>
        </Row>
        <Row className="mt-2">
            <Col sm={3} className="text-info fw-bold">결제 금액</Col>
            <Col sm={9} className="text-secondary">
                {purchase.purchaseTotal.toLocaleString()}원
            </Col>
        </Row>
        <Row className="mt-2">
            <Col sm={3} className="text-info fw-bold">현재 상태</Col>
            <Col sm={9} className="text-secondary">
                {purchase.purchaseStatus}
            </Col>
        </Row>
        <Row className="mt-2">
            <Col sm={3} className="text-info fw-bold">거래번호(TID)</Col>
            <Col sm={9} className="text-secondary">
                {purchase.purchaseTid}
            </Col>
        </Row>
        <Row className="mt-2">
            <Col sm={3} className="text-info fw-bold">결제시작시각</Col>
            <Col sm={9} className="text-secondary">
                <span>{dayjs(purchase.purchaseCtime).format("YYYY년 M월 D일 dddd H시 m분 s초")}</span>
                <span className="ms-2">({dayjs(purchase.purchaseCtime).fromNow()})</span>
            </Col>
        </Row>
        <Row className="mt-2">
            <Col sm={3} className="text-info fw-bold">최종변경시각</Col>
            <Col sm={9} className="text-secondary">
                <span>{dayjs(purchase.purchaseUtime).format("YYYY년 M월 D일 dddd H시 m분 s초")}</span>
                <span className="ms-2">({dayjs(purchase.purchaseUtime).fromNow()})</span>
            </Col>
        </Row>

        {/* 전체 취소 버튼 */}
        { (withInPeriod && purchase.purchaseRemain > 0) && (
        <Row className="mt-4 text-end">
            <Col>
                <Button variant="danger" size="lg">
                    <FaXmark/>
                    <span className="ms-2">현재 구매내역 취소하기</span>
                </Button>
            </Col>
        </Row>
        ) }

        {/* 결제 상세 상품 정보 (purchase_detail) */}
        <hr className="my-5"/>

        <Row>
            <Col>
                <ListGroup>
                    {details.map(detail=>(
                    <ListGroupItem key={detail.purchaseDetailNo} className="p-4">
                        <div className="d-flex">
                            {/* 상품 이미지(해결 필요) */}
                            <div style={{width:100, height:100, overflow:"hidden"}}>
                                <img src={NoImage} width={"100%"}/>
                            </div>

                            {/* 상품 정보(스냅샷)와 구매 수량 */}
                            <div className="flex-grow-1 ms-2">
                                <h4 className="text-truncate">
                                    <Link to={`/sale/detail/${detail.purchaseDetailItem}`}>
                                        {detail.purchaseDetailName}
                                    </Link>
                                </h4>
                                <div className="mt-4">
                                    구매 수량 : {detail.purchaseDetailQty.toLocaleString()}개
                                </div>
                                <div className="mt-2">
                                    구매 금액 : {calculateTotalPrice(detail)}원
                                    &nbsp;
                                    (개당 {detail.purchaseDetailPrice.toLocaleString()}원)
                                </div>
                                <div className="mt-2">
                                    <Badge bg={
                                        detail.purchaseDetailStatus === "승인" ? "success" : "danger"
                                    }>
                                        {detail.purchaseDetailStatus}
                                    </Badge>
                                </div>
                                {/* 
                                    취소버튼 등장조건 
                                    1. 해당 상품 구매내역의 현재상태가 "승인"일 것
                                    2. 구매한지 일정 시간 이내일 것 (ex : 7일)
                                */}
                                { 
                                    detail.purchaseDetailStatus === "승인"
                                    &&
                                    withInPeriod
                                    && (
                                <div className="mt-2 text-end">
                                    <Button variant="danger" size="sm">
                                        <FaXmark/>
                                        <span className="ms-2">이 항목 취소하기</span>
                                    </Button>
                                </div>
                                ) }
                            </div>
                        </div>
                    </ListGroupItem>                    
                    ))}
                </ListGroup>
            </Col>
        </Row>

        {/* 카카오페이 정보 */}
        <hr className="my-5"/>
        <Row className="mt-2">
            <Col sm={3} className="text-info fw-bold">지불방식</Col>
            <Col sm={9} className="text-secondary">
                {payResponse.paymentMethodType}
            </Col>
        </Row>
        <Row className="mt-2">
            <Col sm={3} className="text-info fw-bold">결제 시작시간</Col>
            <Col sm={9} className="text-secondary">
                {dayjs(payResponse.createdAt).format("YYYY년 M월 D일 dddd H시 m분 s초")}
            </Col>
        </Row>
        <Row className="mt-2">
            <Col sm={3} className="text-info fw-bold">결제 승인시간</Col>
            <Col sm={9} className="text-secondary">
                {dayjs(payResponse.approvedAt).format("YYYY년 M월 D일 dddd H시 m분 s초")}
            </Col>
        </Row>
        {payResponse.canceledAt !== null && (
        <Row className="mt-2">
            <Col sm={3} className="text-info fw-bold">결제 취소시간</Col>
            <Col sm={9} className="text-secondary">
                {dayjs(payResponse.canceledAt).format("YYYY년 M월 D일 dddd H시 m분 s초")}
            </Col>
        </Row>
        ) }
        <Row className="mt-2">
            <Col sm={3} className="text-info fw-bold">금액상세</Col>
            <Col sm={9} className="text-secondary">
                <div>
                    총 
                    <span className="text-info fw-bold mx-2">
                        {payResponse.amount.total.toLocaleString()}
                    </span>
                    원
                </div>
                <div className="ps-2">
                    <MdSubdirectoryArrowRight/>
                    <span>
                        상품가 
                        <span className="text-info fw-bold mx-2">
                            {(payResponse.amount.total - payResponse.amount.vat).toLocaleString()}
                        </span>    
                        원
                    </span>
                </div>
                <div className="ps-2">
                    <MdSubdirectoryArrowRight/>
                    <span>
                        부가세 
                        <span className="text-muted fw-bold mx-2">
                            {payResponse.amount.vat.toLocaleString()}
                        </span>    
                        원
                    </span>
                </div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Col sm={3} className="text-info fw-bold">결제 상세</Col>
            <Col sm={9} className="text-secondary">
                <ListGroup>
                    {payResponse.paymentActionDetails.map((action, index)=>(
                    <ListGroupItem key={index}>
                        <div className="d-flex justify-content-between">
                            <div>
                                <Badge bg={
                                    action.paymentActionType === "PAYMENT" ? "success" : "danger"
                                }>{action.paymentActionType}</Badge>

                                <span className="ms-2">
                                    {action.amount.toLocaleString()} 원
                                </span>
                            </div>
                            <div>
                                {dayjs(action.approvedAt).format()}
                            </div>
                        </div>
                    </ListGroupItem>
                    ))}
                </ListGroup>
            </Col>
        </Row>
    </>)
}