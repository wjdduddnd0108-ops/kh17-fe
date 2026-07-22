import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Jumbotron from "../../templates/Jumbotron";
import { Button, Col, Row, Form } from "react-bootstrap";
import { FaAsterisk, FaList, FaSquarePen, FaXmark } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import { apiClient } from "../../utils/reaxios";

export default function Practice1Edit() {
    const { practice1No } = useParams();

    if (/^[0-9]+$/.test(practice1No) === false) {//숫자가 아니면
        toast.error("없는 강좌입니다.");
        return <Navigate to="/practice1/list" replace />;
    }

    const navigate = useNavigate();

    //정상적인 숫자인 경우 처리내용 작성

    const [practice1, setPractice1] = useState({
        practice1Name : "",
        practice1Category : "",
        practice1Time : "",//숫자이지만 미입력 상태로 설정
        practice1Price : "",//숫자이지만 미입력 상태로 설정
        practice1CourseType : ""
    });
    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(async () => {
        const response = await apiClient.get(`/practice1/${practice1No}`);
        setPractice1(response.data);
    }, []);

    const [result, setResult] = useState({
        practice1Name: "",
        practice1Category: "",
        practice1Time: "",
        practice1Price: "",
        practice1CourseType: ""
    }, []);

    //callback
    //- 입력함수들
    const changeStringValue = useCallback(e => {
        const { name, value } = e.target;
        setPractice1({
            ...practice1, //나머지 그대로 유지
            [name]: value
        });
    }, [practice1]);
    const changeNumericValue = useCallback(e => {
        const { name, value } = e.target;
        const regex = /[^0-9]+/g;
        const replacement = value.replace(regex, "");
        if (replacement.length === 0) {
            setPractice1({
                ...practice1,
                [name]: replacement
            });
        }
        else {
            setPractice1({
                ...practice1,
                [name]: parseInt(replacement)
            });
        }
    }, [practice1]);

    //- 검사함수들
    const checkPractice1Name = useCallback(() => {
        const valid = practice1.practice1Name.length > 0;
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result,
            practice1Name: clazz
        });
    }, [practice1.practice1Name, result]);

    const checkPractice1Category = useCallback(() => {
        // const regex = /^(이론|실습|시험)$/;
        // const valid = regex.test(practice1.practice1Category);
        const valid = ['이론', '실습', '시험'].includes(practice1.practice1Category);
        const clazz = valid ? "is-valid" : "is-invalid"
        setResult({
            ...result,
            practice1Category: clazz
        });
    }, [practice1.practice1Category, result]);

    const checkPractice1Time = useCallback(() => {
        const valid =
            practice1.practice1Time !== ""
            && practice1.practice1Time > 0
            && practice1.practice1Time % 30 === 0 && practice1.practice1Time <= 300;
        setResult({
            ...result,
            practice1Time: valid ? "is-valid" : "is-invalid"
        });
    }, [practice1.practice1Time, result]);

    const checkPractice1price = useCallback(() => {
        const valid = practice1.practice1Price >= 0 && practice1.practice1Price <= 100000000;
        setResult({
            ...result,
            practice1Price: valid ? "is-valid" : "is-invalid"
        });
    }, [practice1.practice1Price, result]);

    const checkPractice1CourseType = useCallback(() => {
        // const regex = /^(온라인|오프라인|혼합)$/;
        // const valid = regex.test(practice1.practice1CourseType);
        const valid = ['온라인', '오프라인', '혼합'].includes(practice1.practice1CourseType);

        setResult({
            ...result,
            practice1CourseType: valid ? "is-valid" : "is-invalid"
        });
    }, [practice1.practice1CourseType, result]);

    const send = useCallback(async () => {
        const response = await apiClient.put(`/practice1/${practice1No}`, practice1);
        navigate(`/practice1/detail/${practice1No}`);
        toast.success("강좌 수정이 완료되었습니다");
    }, [practice1, navigate]);

    //memo
    const valid = useMemo(() => {
        if (result.practice1Name !== "is-valid") return false;
        if (result.practice1Category !== "is-valid") return false;
        if (result.practice1Time !== "is-valid") return false;
        if (result.practice1Price !== "is-valid") return false;
        if (result.practice1CourseType !== "is-valid") return false;
        return true;
    }, [result]);

    //effect
    useEffect(() => {
        if (practice1.practice1CourseType === "" && result.practice1CourseType === "") return;

        checkPractice1CourseType();
    }, [practice1.practice1CourseType, result.practice1CourseType]);

    useEffect(() => {
        if (practice1.practice1Category === "" && result.practice1Category === "") return;

        checkPractice1Category();
    }, [practice1.practice1Category, result.practice1Category]);
    return(<>
        <Jumbotron title="강좌 정보 수정"/>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                강좌명
                <FaAsterisk className="text-danger"/>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="practice1Name" className={result.practice1Name} value={practice1.practice1Name || ""}
                    onChange={changeStringValue} onBlur={checkPractice1Name} />
                <div className="valid-feedback">올바른 형식입니다</div>
                <div className="invalid-feedback">필수항목입니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                카테고리
                <FaAsterisk className="text-danger"/>
            </Form.Label>
             <Col sm={9}>
                <Form.Select name="practice1Category" value={practice1.practice1Category || ""} onChange={changeStringValue}
                    className={result.practice1Category}>
                    <option value="">선택하세요</option>
                    <option>이론</option>
                    <option>실습</option>
                    <option>시험</option>
                </Form.Select>

                <div className="invalid-feedback">필수항목입니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                강의시간
                <FaAsterisk className="text-danger"/>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" inputMode="numeric" name="practice1Time" className={result.practice1Time} 
                    value={practice1.practice1Time || ""}
                    onChange={changeNumericValue} onBlur={checkPractice1Time} />
                <div className="valid-feedback">강의시간이 설정되었습니다</div>
                <div className="invalid-feedback">30시간 단위로 최대 300시간 이내에서 설정 가능합니다.</div>
            </Col>
        </Row>

        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                수강료
                <FaAsterisk className="text-danger"/>
            </label>
            <div className="col-sm-9">
                <input type="text" inputMode="numeric" name="practice1Price" className={`form-control ${result.practice1Price}`}
                value={practice1.practice1Price || ""}
                onChange={changeNumericValue}
                onBlur={checkPractice1price}
                />
                <div className="valid-feedback">수강료가 설정되었습니다</div>
                <div className="invalid-feedback">3수강료는 0 이상으로 설정해야 합니다.</div>
            </div>
        </div>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                강의형태
                <FaAsterisk className="text-danger"/>
            </Form.Label>
             <Col sm={9}>
                <Form.Select name="practice1CourseType" value={practice1.practice1CourseType || ""} onChange={changeStringValue}
                    className={result.practice1CourseType}>
                    <option value="">선택하세요</option>
                    <option>온라인</option>
                    <option>오프라인</option>
                    <option>혼합</option>
                </Form.Select>

                <div className="invalid-feedback">필수항목입니다</div>
            </Col>
        </Row>
            
        <Row className="mt-4">
            <Col className="text-end">
                <Button as={Link} to={"/practice1/list"} variant="secondary">
                    <FaList className="me-2" />
                    <span>목록으로</span>
                </Button>
                <Button as={Link} to={`/practice1/detail/${practice1No}`} variant="danger" className="ms-2">
                    <FaXmark className="me-2" />
                    <span>취소하기</span>
                </Button>
                <Button type="button" variant="success" className="ms-2"
                    disabled={valid === false} onClick={send}>
                    <FaSquarePen className="me-2" />
                    <span>수정하기</span>
                </Button>
            </Col>
        </Row>
    </>)
}