import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "@utils/reaxios";
import { Badge, Button, Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { ClockLoader } from "react-spinners";
import NoImage from "@assets/images/no-image.png";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { FaArrowRight } from "react-icons/fa6";
dayjs.locale("ko");//한국어로 설정

//경로변수인 purchaseNo를 받아서 서버에 재조회를 요청한 뒤 나오는 정보를 출력
export default function KakaopayBuySuccessVersion2(){
    //경로변수 수신
    const  { purchaseNo } = useParams();

    const [ purchase,  setPurchase] = useState(null);
    const [ sales, setSales ] =useState(null);

    useEffect(()=>{
        loadData();
    },[]);
    const loadData = useCallback(async ()=>{
        const { data } = await apiClient.get(`/purchase/simple/${purchaseNo}`);
        // console.log(data);
        setPurchase(data.purchase);
        setSales(data.sales);
    },[purchaseNo]);

    const waiting = useMemo(()=>{
        if(purchase === null) return true;
        if(sales === null) return true;
        return false;
    },[purchase, sales]);

    const calculateBackground = useCallback(({ purchaseStatus })=>{
        switch(purchaseStatus){
            case "결제완료" : return "success";
            case "부분취소" : return "warning";
            case "전체취소" : return "danger";
            case "차단" : return "info";
            default: return "secondary"
        }
    }, []);
    return(<>
        <Jumbotron title="상품 결제 완료" content="상품 구매가 완료되었습니다"/>

        {/* 로딩중일 때 */}
        {waiting && (
            <Row className="mt-5">
                <Col>
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <ClockLoader size={75} loading={waiting} />
                        <p className="mt-2">불러오는중</p>
                    </div>
                </Col>
            </Row>
        )}

         {/* 데이터 불러와진 뒤*/}
         {!waiting && (<>
         <Row className="mt-5">
            <Col>
                <div className="d-flex justify-content-between">
                    <h3 className="text-truncate">{purchase.purchaseName}</h3>
                    <span className="fs-4 fw-bold text-info text-nowrap">{purchase.purchaseTotal.toLocaleString()}원</span>
                </div>

                <div className="mt-2">
                    <Badge bg="danger">{purchase.purchaseStatus}</Badge>
                </div>
                <div className="mt-2 text-end">
                    {dayjs(purchase.purchaseCtime).format("YYYY년 M월 D일 H시 m분")}
                </div>
            </Col>
         </Row>
    
         <Row className="mt-4">
            <Col>
                <ListGroup>
                    {sales.map(sale=>(
                    <ListGroupItem key={sale.saleNo}>
                        <div className="d-flex justify-content-between">
                            <img src={
                                sale.attachNo !== null ?
                                `${import.meta.env.VITE_SERVER_URL}/api/attach/${sale.attachNo}`
                                : NoImage
                            } width={100}/>
                            <div className="flex-grow-1 ms-2">
                                <h4 className="flex-grow-1 text-truncate">
                                    <Link to={`/sale/detail/${sale.saleNo}`}>
                                        {sale.saleName}
                                    </Link>
                                </h4>
                                <div className="mt-2">
                                    <Badge bg="info">{sale.saleCategory}</Badge>
                                </div>

                                <div className="mt-2">
                                    {sale.saleDiscountPrice.toLocaleString()}원
                                </div>
                            </div>
                        </div>
                    </ListGroupItem>
                    ))}
                </ListGroup>
            </Col>
         </Row>

         <Row className="mt-5">
            <Col className="text-end">
                <Button variant="success" size="lg" 
                    as={Link} to={`/pay/v2/buy/detail/${purchase.purchaseNo}`}>
                    <span>결제 상세 내역보러가기</span>
                    <FaArrowRight className="ms-2"/>
                </Button>
            </Col>
         </Row>
         </>)}
    </>)
}