import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { apiClient } from "@utils/reaxios";
import { toast } from "react-toastify";
import Editor from "react-simple-wysiwyg";
import NoImage from "@assets/images/no-image.png";

export default function AdminSaleAdd() {
    //state
    const [sale, setSale] = useState({
        saleName : "",
        saleCategory : "",
        saleOriginalPrice : "",
        saleDiscountPrice : "",
        saleContent : "",
        saleStock : ""
    });
    const [discount, setDiscount] = useState(false);

    //썸네일(대표이미지) 파일 state
    const [thumbnail, setThumbnail] = useState(null);
    const thumbnailRef = useRef();

    //(+변경사항) 2023년 3월 이후로 취소버튼은 onchange, oninput으로 감지되지 않습니다.
    const changeThumbnail = useCallback(e=>{
        const file = e.target.files[0];
        setThumbnail(file);
    }, []);
    const clearThumbnail = useCallback(()=>{
        setThumbnail(null);
    }, []);
    useEffect(()=>{
        if(thumbnail !== null) return;

        //파일선택창은 비어있는 value밖에 줄 수 없어서 리액트에서 모든 상황을 제어할 수 없다 (HTML보안 이슈)
        //태그를 직접 제어하는 방향으로 우회 처리한다 (ref 사용)
        thumbnailRef.current.value = "";
    }, [thumbnail]);

    //상세이미지 관련 도구들
    const [detailImages, setDetailImages] = useState([]);
    const detailImagesRef = useRef();
    const changeDetailImages = useCallback(e=>{
        setDetailImages(e.target.files);
    }, []);
    const clearDetailImages = useCallback(e=>{
        setDetailImages([]);
    }, []);
    useEffect(()=>{
        if(detailImages.length > 0) return;//이미지 있으면 Pass!
        detailImagesRef.current.value = "";
    }, [detailImages]);

    //callback
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

    const sendData = useCallback(async ()=>{
        //discount가 false면 sale에서 saleDiscountPrice를 제거
        //- 원본을 절대로 지우면 안됨

        // const copy = {...sale};
        // if(discount === false)
        //     delete copy.saleDiscountPrice;
        // const { data } = await apiClient.post("/sale/", copy);

        const { saleDiscountPrice, ...copy } = sale;
        if(discount === true)
            copy.saleDiscountPrice = saleDiscountPrice;
        //const { data } = await apiClient.post("/sale/", copy);

        //보내는 방식이 달라짐 (application/json → multipart/form-data)
        //- 그런데 Form이 없네? 그럼 만들면 된다 (FormData)
        //- <form> 대신 FormData를 쓰고, <input> 대신 append를 이용해서 key=value를 추가
        //- copy를 FormData로 변환한 뒤 전송하면 파일도 이곳에 첨부가 가능하다

        //[1] 데이터와 파일을 같은 레벨로 담아서 전송 → Spring에서 @ModelAttribute로 이름맞춰서 수신
        //[2] 데이터 따로, 파일 따로 담아서 전송 → Spring에서 @RequestPart로 수신

        //[1] 6+1개의 데이터 전송
        // const form = new FormData();
        // form.append("saleName", copy.saleName);
        // form.append("saleCategory", copy.saleCategory);
        // form.append("saleOriginalPrice", copy.saleOriginalPrice);
        // if(discount) 
        //     form.append("saleDiscountPrice", copy.saleDiscountPrice);
        // form.append("saleStock", copy.saleStock);
        // form.append("saleContent", copy.saleContent);

        // //썸네일을 form에 추가 (데이터와 파일을 같은레벨로 처리)
        // form.append("thumbnail", thumbnail);

        // [2] 2개의 파트 데이터를 전송
        const form = new FormData();
        
        form.append("sale", new Blob(
            [ JSON.stringify(copy) ] ,
            { type : "application/json" }
        ));//데이터 추가

        form.append("thumbnail", thumbnail);//썸네일 추가

        //같은 종류의 데이터가 여러개일 경우 같은이름으로 계속 첨부 (배열을 한번에 첨부하는게 아님) → List로 추출
        //→ FileList는 상황에 따라 배열 전용명령이 없을수 있으므로 정상적인 배열로 변환하여 쓰십시오!
        //→ Array.from(FileList)
        Array.from(detailImages).forEach(img=>{
            form.append("detailImages", img);
        });
        
        const { data } = await apiClient.post("/sale/", form);

        toast.success("상품 등록이 완료되었습니다");

        //데이터 초기화
        setSale({
            saleName : "",
            saleCategory : "",
            saleOriginalPrice : "",
            saleDiscountPrice : "",
            saleContent : "",
            saleStock : ""
        });
        clearThumbnail();
        clearDetailImages();
        
        //console.log(data);
    }, [sale, discount, thumbnail, detailImages]);

    //할인을 해제하면 할인가를 삭제
    useEffect(()=>{
        if(discount === false) {
            setSale(prev=>({...prev, saleDiscountPrice : ""}))
        }
    }, [discount]);

    //미리보기에 넣을 src 데이터
    const [previewSrc, setPreviewSrc] = useState(null);
    //썸네일이 변경되면 미리보기를 갱신 (createObjectURL + revokeObjectURL)
    useEffect(()=>{
        if(thumbnail === null) {//이미지가 없으면
            setPreviewSrc(null);//미리보기도 없음
            return;
        }
        
        //이미지 미리보기 주소 생성
        const previewUrl = URL.createObjectURL(thumbnail);
        setPreviewSrc(previewUrl);

        //클린업 함수
        return ()=>{
            //생성된 미리보기 주소 제거
            URL.revokeObjectURL(previewUrl);
        };
    }, [thumbnail]);

    //view
    return (<>
        <Jumbotron title="상품 등록" content="상품 등록을 위한 정보를 입력하세요"/>

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

        {/* 썸네일 */}
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
            <Col>
                <img src={previewSrc ?? NoImage} width={100} height={100}/>
            </Col>
        </Row>

        {/* 상세이미지 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>상세이미지</Form.Label>
            <Col sm={9}>
                <div className="d-flex">
                    <Form.Control type="file" accept="image/*" multiple
                        ref={detailImagesRef} 
                        onInput={changeDetailImages}/>
                    {detailImages.length > 0 && (
                    <Button variant="danger" onClick={clearDetailImages} className="ms-2">
                        <FaXmark/>                        
                    </Button>
                    )}
                </div>
            </Col>
        </Row>

        <Row className="mt-5">
            <Col className="text-end">
                <Button variant="success" size="lg" className="w-md-auto" onClick={sendData}>
                    <FaPlus/>
                    <span className="ms-2">상품 등록하기</span>              
                </Button>
            </Col>
        </Row>
    </>)
}