import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Jumbotron from "../../templates/Jumbotron";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaCheck, FaList, FaPenToSquare, FaSquarePen, FaTrash, FaXmark } from "react-icons/fa6";
import Swal from "sweetalert2";

export default function CountryDetail() {
    // Route에 선언된 파라미터 변수를 읽으려면 useParams()를 사용해야 한다
    // <Route path="/country/detail/:countryNo">롤 써있으면 구조분해할당으로 추출이 가능
    const { countryNo } = useParams();

    // 만약 countryNo가 원치 않는 값(ex : 숫자가 아닌 경우)을 가지면 다른 화면을 반환시켜야 한다
    // 스플링에서는 redirect라고 불렀는데... React에서는 어떻게 처리하느냐?
    // useNavigate()를 이용해서 처리가 가능한가? (불가능)
    // -> 이런 상황을 대비해서 화면이면서 이동이 가능한 태그를 제공 : <Navigate>
    if (/^[0-9]+$/.test(countryNo) === false) {//숫자가 아니면
        toast.error("없는 국가입니다.");
        return <Navigate to="/country/list" replace />;
    }

    const navigate = useNavigate();

    //countryNo가 정상적인 숫자인 경우의 처리내용 작성
    const [country, setCountry] = useState(null);
    useEffect(() => {
       loadData();
    }, []);

    const loadData = useCallback(async ()=>{
        const response = await axios.get(`http://localhost:8080/api/country/${countryNo}`)
        setCountry(response.data);
        setBackup(response.data);
    }, []);

    const deleteCountry = useCallback(async () => {
        const result = await Swal.fire({
            title: "정말 삭제하시겠습니까?",
            text: "삭제 후에는 복구할 수 없습니다",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
            confirmButtonColor: "#d63031",
            cancelButtonColor: "#b2bec3"
        });

        if(result.isConfirmed === false) return;

        const response = await axios.delete(`http://localhost:8080/api/country/${countryNo}`)
        toast.error("국가 삭제가 완료되었습니다");
        navigate("/country/list");
    }, [countryNo]);

    //수정을 구현하기 위해서 논리형 state와 백업용 state 구현
    const [backup, setBackup] =useState(null);
    const [editMode, setEditMode] = useState({
        countryName:false,
        countryCapital:false,
        countryRegion:false,
        countryPopulation:false,
    });

    const changeStringValue = useCallback(e=>{
        const {name, value} = e.target;
        setCountry({
            ...country,
            [name] : value
        });
    })
    const changeNumericValue = useCallback(e=>{
        const {name, value} = e.target;
        const regex = /[^0-9]+/g;
        const replacement = value.replace(regex, "");
        const number = parseInt(replacement || 0);
        setCountry({
            ...country,
            [name]:number
        });
    }, [country]);

    //국가명만 변경하는 함수
    const updateCountry = useCallback(async (field)=>{
        const response = await axios.patch(
            `http://localhost:8080/api/country/${countryNo}`, 
            // {countryName : country.countryName}
            {[field] : country[field]}
        );
        //백업을 갱신
        //setBackup({...backup, countryName:country.countryName});
        setBackup({...backup, [field]:country[field]});

        //수정모드를 취소
        // setEditMode({...editMode, countryName:false});
        setEditMode({...editMode, [field]:false});
        toast.success("국가정보가 변경되었습니다");
    }, [country, backup, editMode]);

    const cancleUpdate = useCallback((field)=>{
        setCountry({...country, [field]: backup[field]})
        setEditMode({...editMode, [field] : false})

        toast.error("정보 변경이 취소되었습니다")
    }, [country, backup, editMode]);

    const startUpdate = useCallback((field)=>{
        setEditMode({...editMode, [field] : true})
    },[editMode])

    return (<>
        <Jumbotron title="국가 상세 정보" content={`${countryNo}번 국가의 상세 정보 화면입니다`} />

        {/* 상태를 나누어서 출력 */}
        {country === null ? (
            <h1>로딩중입니다...</h1>
        ) : (<>
            <Row className="mt-4 fs-3">
                <Col sm={3} className="text-info fw-bold">
                    국가명
                </Col>
                <Col sm={9}>
                    {editMode.countryName !== true ? (<>
                        <span>{country.countryName}</span>
                        <FaSquarePen className="text-warning ms-2"
                                onClick={e=>startUpdate("countryName")}/>
                    </>) : (<>
                        <Form.Control type="text" className="w-auto d-inline-block"
                            name="countryName" value={country.countryName}
                            onChange={changeStringValue}/>
                        {/* <FaCheck className="text-success ms-2"
                                onClick={updateCountryName}/> */}
                        <FaCheck className="text-success ms-2"
                                onClick={e=>updateCountry("countryName")}/>
                        <FaXmark className="text-danger ms-2" 
                                onClick={e=>cancleUpdate("countryName")}/>
                    </>)}
                    
                </Col>
                <Col sm={3} className="text-info fw-bold">
                    대륙
                </Col>
                <Col sm={9}>
                    {editMode.countryRegion !== true ? (<>
                        <span>{country.countryRegion}</span>
                        <FaSquarePen className="text-warning ms-2"
                                onClick={e=>startUpdate("countryRegion")}/>
                    </>) : (<>
                        <Form.Select className="w-auto d-inline-block"
                            name="countryRegion" value={country.countryRegion}
                            onChange={changeStringValue}>
                            <option>아시아</option>
                            <option>아프리카</option>
                            <option>북아메리카</option>
                            <option>남아메리카</option>
                            <option>유럽</option>
                            <option>오세아니아</option>
                        </Form.Select>
                        <FaCheck className="text-success ms-2"
                                onClick={e=>updateCountry("countryRegion")}/>
                        <FaXmark className="text-danger ms-2" 
                                onClick={e=>cancleUpdate("countryRegion")}/>
                    </>)}
                </Col>
                <Col sm={3} className="text-info fw-bold">
                    수도
                </Col>
                <Col sm={9}>
                    {editMode.countryCapital !== true ? (<>
                        <span>{country.countryCapital}</span>
                        <FaSquarePen className="text-warning ms-2"
                                onClick={e=>startUpdate("countryCapital")}/>
                    </>) : (<>
                        <Form.Control type="text" className="w-auto d-inline-block"
                            name="countryCapital" value={country.countryCapital}
                            onChange={changeStringValue}/>
                        <FaCheck className="text-success ms-2"
                                onClick={e=>updateCountry("countryCapital")}/>
                        <FaXmark className="text-danger ms-2" 
                                onClick={e=>cancleUpdate("countryCapital")}/>
                    </>)}
                </Col>
                <Col sm={3} className="text-info fw-bold">
                    인구수
                </Col>
                <Col sm={9}>
                     {editMode.countryPopulation !== true ? (<>
                        <span>{country.countryPopulation.toLocaleString()} 명</span>
                        <FaSquarePen className="text-warning ms-2"
                                onClick={e=>startUpdate("countryPopulation")}/>
                    </>) : (<>
                        <Form.Control type="text" className="w-auto d-inline-block"
                            name="countryPopulation" value={country.countryPopulation}
                            onChange={changeNumericValue}/>
                        <FaCheck className="text-success ms-2"
                                onClick={e=>updateCountry("countryPopulation")}/>
                        <FaXmark className="text-danger ms-2" 
                                onClick={e=>cancleUpdate("countryPopulation")}/>
                    </>)}
                </Col>
            </Row>

            <Row className="mt-5">
                <Col className="text-end">
                    <Button className="ms-2" variant="secondary"
                        as={Link} to="/country/list">
                        <FaList />
                        목록으로
                    </Button>
                    <Button className="ms-2" variant="warning">
                        <FaPenToSquare />
                        수정하기
                    </Button>
                    <Button className="ms-2" variant="danger"
                        onClick={deleteCountry}>
                        <FaTrash />
                        삭제하기
                    </Button>
                </Col>
            </Row>
        </>)}
    </>)
}