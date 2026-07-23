import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import Jumbotron from "../../templates/Jumbotron";
import { FaLock } from "react-icons/fa6";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLinkClickHandler, useNavigate } from "react-router-dom";
import { apiClient } from "../../utils/reaxios";
import { toast } from "react-toastify";

export default function(){
    const navigate = useNavigate();

    const passwordRef = useRef(null);

    const [account, setAccount] =useState({
        prevAccountPassword : "",
        newAccountPassword : ""
    });

    const [result, setResult] = useState(null);//피드백이 아니라 서버에서 오는 응답

    //callback
    const changeStringValue = useCallback(e=>{
        const { name, value } = e.target;
        setAccount(prev=>({
            ...prev,
            [name] : value
        }));
    }, []);

    const sendRequest = useCallback(async (e)=>{
        e.preventDefault();

        if(account.prevAccountPassword === "") return;
        if(account.newAccountPassword === "") return;

        //axios는 더이상 사용할 수 없다
        const {data} = await apiClient.patch("/account/password", account);
        setResult(data);
    }, [account]);

    //성공일 때만 토스트메세지 + 내정보로 이동
    useEffect(()=>{
        if(result === null) return; //변경 전 pass
        if(result.result !== true) return; //변경 실패 pass

        navigate("/account/mypage");
        toast.success("비밀번호가 변경되었습니다");
    }, [result]);

    useEffect(()=>{
        passwordRef.current?.focus();
    }, []);


    return (<>
        <Jumbotron title="비밀번호 변경" content="현재 비밀번호와 변경하실 비밀번호를 입력하세요"/>

        {/* result의 상태에 따라 메세지를 표시 */}
        { result !== null && (
            <Row  className="mt-5">
                <Alert variant={result.result ? "success" : "danger"}>
                    {result.message}
                </Alert>
            </Row>
        )}

        <Form autoComplete="off" onSubmit={sendRequest}>
            <Row className="mt-5">
                <Form.Label column sm={3}>현재 비밀번호</Form.Label>
                <Col sm={9}>
                    <Form.Control type="password" name="prevAccountPassword"
                            value={account.prevAccountPassword}
                            onChange={changeStringValue}
                            ref={passwordRef}/>
                </Col>
            </Row>

            <Row className="mt-5">
                <Form.Label column sm={3}>변경할 비밀번호</Form.Label>
                <Col sm={9}>
                    <Form.Control type="password" name="newAccountPassword"
                            value={account.newAccountPassword}
                            onChange={changeStringValue}/>
                </Col>
            </Row>

            <Row className="mt-5 text-end">
                <Col>
                    <Button variant="danger" size="lg" className="w-md-auto" type="submit">
                        <FaLock className="me-2"/>
                        <span>비밀번호 변경하기</span>
                    </Button>
                </Col>
            </Row>
        </Form>

    </>)
}