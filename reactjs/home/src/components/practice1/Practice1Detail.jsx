import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Col, Row } from "react-bootstrap";
import { FaList, FaPenToSquare, FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";

export default function Practice1Detail(){
    const { practice1No } = useParams();

    if (/^[0-9]+$/.test(practice1No) === false) {//숫자가 아니면
        toast.error("없는 강좌입니다.");
        return <Navigate to="/practice1/list" replace />;
    }

    const navigate = useNavigate();

    //정상적인 숫자인 경우 처리내용 작성
    const [practice1, setPractice1] = useState(null);
    useEffect(()=>{
        loadData();
        
    }, []);

    //[1] 일반 함수에서 비동기 작업을 호출 : .then() 으로 후속작업을 지정
    // const loadData = useCallback(()=>{
    //     axios({
    //         url: "http://localhost:8080/api/practice1/detail",
    //         method: "get",
    //         params: { practice1No: practice1No }
    //     })
    //     .then(response=>{
    //         setPractice1(response.data);
    //     })
    // }, []);

    //[2] 비동기 함수를 사용
    // - 함수 앞에 async 키워드를 추가
    // - then 대시 await 키워드 사용 가능
    // async+await 사용시 
    const loadData = useCallback(async ()=>{
        // const response = await axios({
        //     url: `http://localhost:8080/api/practice1/detail/${practice1No}`,
        //     method: "get",

        // });
        const response = await axios.get(`/api/practice1/detail/${practice1No}`);
        setPractice1(response.data);
    }, [])

    //삭제 함수 (async+await)
    const deletePractice1 = useCallback(async () => {
        const result= await Swal.fire({
            title: "정말 삭제하시겠습니까?",
            text: "삭제 후에는 복구할 수 없습니다",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
            confirmButtonColor: "#d63031",
            cancelButtonColor: "#b2bec3"
        });
        if(result.isConfirmed === false)return

        const response = await axios.get(`/api/practice1/delete/${practice1No}`);
        toast.error("강좌 삭제가 완료되었습니다");
        navigate("/practice1/list");

    },[practice1No]);

    // const deletePractice1 = useCallback(() => {
    //     Swal.fire({
    //         title: "정말 삭제하시겠습니까?",
    //         text: "삭제 후에는 복구할 수 없습니다",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonText: "삭제",
    //         cancelButtonText: "취소",
    //         confirmButtonColor: "#d63031",
    //         cancelButtonColor: "#b2bec3"
    //     })
    //         .then(result => {
    //             if (result.isConfirmed) {
    //                 axios({
    //                     url: "http://localhost:8080/api/practice1/delete",
    //                     method: "get",
    //                     params: { practice1No: practice1No }
    //                 })
    //                 .then(response => {
    //                     toast.error("강좌 삭제가 완료되었습니다");
    //                     navigate("/practice1/list");
    //                 });
    //             }
    //         })
    // }, [practice1No]);

    return(<>
        <Jumbotron title="강좌 상세 정보"/>

        {practice1 === null ? (<>
            <h1>로딩중입니다...</h1>
        </>) : (<>
            <Row className="mt-4 fs-3">
                <Col sm={3} className="text-info fw-bold">
                    강좌명
                </Col>
                <Col sm={9}>
                    {practice1.practice1Name}
                </Col>
                <Col sm={3} className="text-info fw-bold">
                    카테고리  
                </Col>
                <Col sm={9}>
                    {practice1.practice1Category}
                </Col>
                <Col sm={3} className="text-info fw-bold">
                    강의시간  
                </Col>
                <Col sm={9}>
                    {practice1.practice1Time}
                </Col>
                <Col sm={3} className="text-info fw-bold">
                    수강료  
                </Col>
                <Col sm={9}>
                    {practice1.practice1Price}
                </Col>
                <Col sm={3} className="text-info fw-bold">
                    강의형태  
                </Col>
                <Col sm={9}>
                    {practice1.practice1CourseType}
                </Col>
            </Row>

            <Row className="mt-5">
                <Col className="text-end">
                     <Button className="ms-2" variant="secondary"
                        as={Link} to="/practice1/list">
                        <FaList />
                        목록으로
                    </Button>
                    <Button className="ms-2" variant="warning">
                        <FaPenToSquare />
                        수정하기
                    </Button>
                    <Button className="ms-2" variant="danger"
                        onClick={deletePractice1}>
                        <FaTrash />
                        삭제하기
                    </Button>
                </Col>
            </Row>
        </>)}
    </>)
}