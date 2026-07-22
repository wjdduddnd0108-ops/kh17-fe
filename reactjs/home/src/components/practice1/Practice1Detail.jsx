import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {Form, Button, Col, Row } from "react-bootstrap";
import { FaCheck, FaList, FaPenToSquare, FaSquarePen, FaTrash, FaXmark } from "react-icons/fa6";
import Swal from "sweetalert2";
import { apiClient } from "../../utils/reaxios";

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

    const loadData = useCallback(async ()=>{
        const response = await apiClient.get(`/practice1/${practice1No}`);
        setPractice1(response.data);
    }, []);

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

        const response = await apiClient.delete(`/practice1/${practice1No}`);
        toast.error("강좌 삭제가 완료되었습니다");
        navigate("/practice1/list");

    },[practice1No]);

    const [backup, setBackup] = useState(null);
    const [editMode, setEditMode] = useState({
        practice1Name:false,
        practice1Category:false,
        practice1Time:false,
        practice1Price:false,
        practice1CourseType:false,
    },[practice1]);
    
    const changeStringValue = useCallback(e=>{
        const {name, value} = e.target;
        setPractice1({
            ...practice1,
            [name] : value
        });
    }, [practice1]);

    const changeNumericValue = useCallback(e=>{
        const {name, value} = e.target;
        const regex = /[^0-9]+/g;
        const replacement = value.replace(regex, "");
        const number = parseInt(replacement || 0);
        setPractice1({
            ...practice1,
            [name] : number
        });
    }, [practice1]);

    const updatePractice1 = useCallback(async (field)=>{
        const response = await apiClient.patch(
            `/practice1/${practice1No}`,
            {[field] : practice1[field]}
        );
        //백업 갱신
        setBackup({...backup, [field]:practice1[field]});
        
        //수정모드 취소
        setEditMode({...editMode, [field]:false});
        toast.success("강좌정보가 변경되었습니다");
    }, [practice1, backup, editMode]);

    const cancleUpdate = useCallback((field)=>{
        //취소 버튼 눌렀을때 백업 해둔 값으로 변경
        setPractice1({...practice1, [field]: backup[field]});
        //수정모드 취소
        setEditMode({...editMode, [field]: false});

        toast.error("정보 변경이 취소되었습니다")
    }, [practice1, backup, editMode]);

    const startUpdate = useCallback((field)=>{
        //수정모드 실행
        setEditMode({...editMode, [field]: true})
    }, [editMode]);

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
                    {editMode.practice1Name !== true ? (<>
                        <span>{practice1.practice1Name}</span>
                        <FaSquarePen className="text-warning ms-2"
                                onClick={e=>startUpdate("practice1Name")}/>
                    </>) : (<>
                        <Form.Control type="text" className="w-auto d-inline-block"
                            name="practice1Name" value={practice1.practice1Name}
                            onChange={changeStringValue}/>
                        <FaCheck className="text-success ms-2"
                                onClick={e=>updatePractice1("practice1Name")}/>
                        <FaXmark className="text-danger ms-2" 
                                onClick={e=>cancleUpdate("practice1Name")}/>
                    </>)}
                </Col>

                <Col sm={3} className="text-info fw-bold">
                    카테고리  
                </Col>
                <Col sm={9}>
                    {editMode.practice1Category !== true ? (<>
                        <span>{practice1.practice1Category}</span>
                        <FaSquarePen className="text-warning ms-2"
                                onClick={e=>startUpdate("practice1Category")}/>
                    </>) : (<>
                        <Form.Select className="w-auto d-inline-block"
                            name="practice1Category" value={practice1.practice1Category}
                            onChange={changeStringValue}>
                            <option>이론</option>
                            <option>실습</option>
                            <option>시험</option>
                        </Form.Select>
                        <FaCheck className="text-success ms-2"
                                onClick={e=>updatePractice1("practice1Category")}/>
                        <FaXmark className="text-danger ms-2" 
                                onClick={e=>cancleUpdate("practice1Category")}/>
                    </>)}
                </Col>

                <Col sm={3} className="text-info fw-bold">
                    강의시간  
                </Col>
                <Col sm={9}>
                    {editMode.practice1Time !== true ? (<>
                        <span>{practice1.practice1Time}</span>
                        <FaSquarePen className="text-warning ms-2"
                                onClick={e=>startUpdate("practice1Time")}/>
                    </>) : (<>
                        <Form.Control type="text" inputMode="numeric" className="w-auto d-inline-block"
                            name="practice1Time" value={practice1.practice1Time}
                            onChange={changeNumericValue}/>
                        <FaCheck className="text-success ms-2"
                                onClick={e=>updatePractice1("practice1Time")}/>
                        <FaXmark className="text-danger ms-2" 
                                onClick={e=>cancleUpdate("practice1Time")}/>
                    </>)}
                </Col>

                <Col sm={3} className="text-info fw-bold">
                    수강료  
                </Col>
                <Col sm={9}>
                    {editMode.practice1Price !== true ? (<>
                        <span>{practice1.practice1Price }</span>
                        <FaSquarePen className="text-warning ms-2"
                                onClick={e=>startUpdate("practice1Price ")}/>
                    </>) : (<>
                        <Form.Control type="text" inputMode="numeric" className="w-auto d-inline-block"
                            name="practice1Price " value={practice1.practice1Price }
                            onChange={changeNumericValue}/>
                        <FaCheck className="text-success ms-2"
                                onClick={e=>updatePractice1("practice1Price ")}/>
                        <FaXmark className="text-danger ms-2" 
                                onClick={e=>cancleUpdate("practice1Price ")}/>
                    </>)}
                </Col>

                <Col sm={3} className="text-info fw-bold">
                    강의형태  
                </Col>
                <Col sm={9}>
                    {editMode.practice1CourseType !== true ? (<>
                        <span>{practice1.practice1CourseType}</span>
                        <FaSquarePen className="text-warning ms-2"
                                onClick={e=>startUpdate("practice1CourseType")}/>
                    </>) : (<>
                        <Form.Select className="w-auto d-inline-block"
                            name="practice1CourseType" value={practice1.practice1CourseType}
                            onChange={changeStringValue}>
                            <option>온라인</option>
                            <option>오프라인</option>
                            <option>혼합</option>
                        </Form.Select>
                        <FaCheck className="text-success ms-2"
                                onClick={e=>updatePractice1("practice1CourseType")}/>
                        <FaXmark className="text-danger ms-2" 
                                onClick={e=>cancleUpdate("practice1CourseType")}/>
                    </>)}
                </Col>
            </Row>

            <Row className="mt-5">
                <Col className="text-end">
                     <Button className="ms-2" variant="secondary"
                        as={Link} to="/practice1/list">
                        <FaList />
                        목록으로
                    </Button>
                    <Button className="ms-2" variant="warning"
                        as={Link} to={`/practice1/edit/${practice1No}`}>
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