import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "@utils/reaxios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaPlus, FaSquarePen, FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import Editor from "react-simple-wysiwyg";
import NoImage from "@assets/images/no-image.png";

export default function AdminSaleEdit() {
    //parameter
    const { saleNo } = useParams();

    //state
    const [sale, setSale] = useState(null);
    const [beforeThumbnail, setBeforeThumbnail] = useState(null);//AttachDto(DB정보)
    const [detailImages, setDetailImages] = useState([]);

    const loadData = useCallback(async ()=>{
        const { data } = await apiClient.get(`/sale/${saleNo}`);
        const { saleDto, thumbnail, details } = data;
        setSale(saleDto);
        setBeforeThumbnail(thumbnail);
        setDetailImages(details);
        //할인 체크박스 처리 추가
        setDiscount(saleDto.saleOriginalPrice > saleDto.saleDiscountPrice);
    }, []);
    useEffect(()=>{
        loadData();
    }, []);

    //할인 여부 선택 체크박스
    const [discount, setDiscount] = useState(false);

    const changeStringValue = useCallback((e)=>{
        const { name, value } = e.target;
        setSale(prev=>({
            ...prev, 
            [name] : value
        }));
    }, []);
    const changeNumericValue = useCallback((e)=>{
        const { name, value } = e.target;
        const replacement = value.replace(/[^0-9]+/g, "");
        const result = replacement.length === 0 ? "" : parseInt(replacement);
        setSale(prev=>({
            ...prev, 
            [name] : result
        }));
    }, []);

    //할인을 해제하면 할인가를 삭제
    useEffect(()=>{
        if(discount === false) {
            setSale(prev=>({...prev, saleDiscountPrice : ""}))
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
        ));

        const { data } = await apiClient.put(`/sale/${saleNo}`, form);
        console.log(data);
    }, [sale, discount]);

    //썸네일(thumbnail) 관련 기능들
    const [thumbnail, setThumbnail] = useState(null);//파일
    const thumbnailRef = useRef();

    //(+변경사항) 2023년 3월 이후로 취소버튼은 onchange, oninput으로 감지되지 않습니다.
    const changeThumbnail = useCallback(async e=>{
        //선택된 파일을 서버로 전송시켜서 진짜 이미지 변경을 시킨다(+업로드 & DB변경)
        const file = e.target.files[0];

        const form = new FormData();
        form.append("thumbnail", file);
        const { data } = await apiClient.patch(`/sale/thumbnail/${saleNo}`, form);

        setBeforeThumbnail(data.attach);//변경된 이미지를 기존 이미지 정보에 덮어쓰기
    }, []);
    const clearThumbnail = useCallback(async ()=>{
        //서버에 삭제 요청을 한 뒤 제거
         const result= await Swal.fire({
            title: `썸네일을 삭제하시겠습니까?`,
            text:"삭제한 이미지는 다시 복구할 수 없습니다",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "네",
            cancelButtonText: "아니오",
            confirmButtonColor: "#d63031",
            cancelButtonColor: "#b2bec3"
        });
        if(result.isConfirmed === false)return;//취소

        const { data } = await apiClient.delete(`/sale/thumbnail/${saleNo}`);
        setBeforeThumbnail(null);
    }, []);
    useEffect(()=>{
        if(thumbnail !== null) return;

        //파일선택창은 비어있는 value밖에 줄 수 없어서 리액트에서 모든 상황을 제어할 수 없다 (HTML보안 이슈)
        //태그를 직접 제어하는 방향으로 우회 처리한다 (ref 사용)
        if(thumbnailRef.current) {
            thumbnailRef.current.value = "";
        }
    }, [thumbnail]);


    //sale은 절대로 null이면 안된다
    //→ sale이 null이면 기다려야 한다
    if(sale === null) {
        return <h1>로딩중...</h1>
    }

    return (<>
        <Jumbotron title="상품 정보 수정"/>

        <Row className="mt-5">
            <Form.Label column sm={3}>상품명</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="saleName" value={sale.saleName}
                        onChange={changeStringValue} placeholder="e.g., 갤럭시 노트 8"/>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>카테고리</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="saleCategory" value={sale.saleCategory}
                        onChange={changeStringValue} placeholder="e.g., 통신기기"/>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>정가</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="saleOriginalPrice" value={sale.saleOriginalPrice}
                        onChange={changeNumericValue} placeholder="e.g., 2000000"/>
            </Col>
        </Row>

        <Row className="mt-2">
            <Col sm={{offset:3, span:9}}>
                <Form.Check type="switch" label="할인 적용"
                            checked={discount}
                            onChange={e=>setDiscount(e.target.checked)}/>
            </Col>
        </Row>
        {discount && (
        <Row className="mt-2">
            <Form.Label column sm={3}>할인가</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="saleDiscountPrice" value={sale.saleDiscountPrice}
                        onChange={changeNumericValue} placeholder="e.g., 1990000"/>
            </Col>
        </Row>
        )}

        <Row className="mt-4">
            <Form.Label column sm={3}>재고수량</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="saleStock" value={sale.saleStock}
                        onChange={changeNumericValue} placeholder="e.g., 10"/>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>상세설명</Form.Label>
            <Col sm={9}>
                {/* 
                <Form.Control as="textarea" rows={6} 
                        name="saleContent" value={sale.saleContent}
                        onChange={changeStringValue} placeholder="상품에 대한 설명 작성"/>
                */}

                <Editor name="saleContent" value={sale.saleContent} 
                        onChange={changeStringValue}
                        containerProps={ 
                            { 
                                style : {
                                    resize : "none",//or vertical
                                    minHeight : 250
                                } 
                            } 
                        }/>
            </Col>
        </Row>

        {/* 썸네일 이미지 표시 및 수정 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>대표이미지</Form.Label>
            <Col sm={9}>
                <div className="d-flex">
                    <Form.Control type="file" accept="image/*" 
                        ref={thumbnailRef} 
                        onInput={changeThumbnail}/>
                    {thumbnail !== null && (
                    <Button variant="danger" onClick={clearThumbnail} className="ms-2">
                        <FaXmark/>                        
                    </Button>
                    )}
                </div>
            </Col>
        </Row>
        <Row className="mt-2">
            <Col sm={{offset:3, span:9}}>
                {/* 기존 이미지를 표시하고 제거, 변경 버튼을 추가 */}
                {beforeThumbnail === null && (
                <img src={NoImage} width={100} className="border"/>
                ) }
                {beforeThumbnail !== null && (
                <img src={`${import.meta.env.VITE_SERVER_URL}/api/attach/${beforeThumbnail.attachNo}`} width={300} className="border"/>
                ) }
            </Col>
        </Row>

        {/* 수정버튼 */}
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