import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Jumbotron from "../../templates/Jumbotron";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Col, Row } from "react-bootstrap";
import { FaList, FaPenToSquare, FaTrash } from "react-icons/fa6";
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
        axios({
            url: "http://localhost:8080/api/country/detail",
            method: "get",
            params: { countryNo: countryNo }
        })
            .then(response => {
                setCountry(response.data);
            })
    }, []);

    const deleteCountry = useCallback(() => {
        Swal.fire({
            title: "정말 삭제하시겠습니까?",
            text: "삭제 후에는 복구할 수 없습니다",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
            confirmButtonColor: "#d63031",
            cancelButtonColor: "#b2bec3"
        })
            .then(result => {
                if (result.isConfirmed) {
                    axios({
                        url: "http://localhost:8080/api/country/delete",
                        method: "get",
                        params: { countryNo: countryNo }
                    })
                    .then(response => {
                        toast.error("국가 삭제가 완료되었습니다");
                        navigate("/country/list");
                    });
                }
            })
    }, [countryNo]);

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
                    {country.countryName}
                </Col>
                <Col sm={3} className="text-info fw-bold">
                    대륙
                </Col>
                <Col sm={9}>
                    {country.countryRegion}
                </Col>
                <Col sm={3} className="text-info fw-bold">
                    수도
                </Col>
                <Col sm={9}>
                    {country.countryCapital}
                </Col>
                <Col sm={3} className="text-info fw-bold">
                    인구수
                </Col>
                <Col sm={9}>
                    {country.countryPopulation.toLocaleString()} 명
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