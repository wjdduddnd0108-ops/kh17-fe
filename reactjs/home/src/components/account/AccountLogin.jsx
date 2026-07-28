import { useCallback, useState } from "react";
import Jumbotron from "../../templates/Jumbotron";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaRightToBracket } from "react-icons/fa6";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";
import { loginUserState } from "@utils/storage";
import { loginActionState } from "@utils/storage";
import { authClient } from "@utils/reaxios";
import AccountBlock from "../error/AccountBlock";

export default function AccountLogin() {
    //state
    const [account, setAccount] = useState({
        accountId: "",
        accountPassword: ""
    });
    //jotai state
    // const [loginUser, setLoginUser] =useAtom(loginUserState)

    //쓰기 전용 atom
    // const [_, loginAction] = useAtom(loginActionState);
    const loginAction = useSetAtom(loginActionState);

    //입력
    const changeStringValue = useCallback(e => {
        const { name, value } = e.target;
        setAccount(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    //navigate
    const navigate = useNavigate();

    //로그인
    const sendLogin = useCallback(async (e) => {
        e.preventDefault(); // 새로고침 방지

        //미입력 시 차단
        if (account.accountId === "" && account.accountPassword === "") {
            await Swal.fire("모든정보를 입력하세요");
            return;
        }
        try {
            // const {data} = await axios.post("/service/auth/login", account);
            const { data } = await authClient.post("/login", account);

            //data에서 needUpdate와 나머지를 뽑아내서 나눠서 사용 (구조 분해 할당)
            const {needUpdate, ...userData } = data;
            loginAction(userData);

            //로그인 성공
            // console.log(data);
            // setLoginUser(data);//jotai storage에 저장 완료

            if(needUpdate){//비밀번호를 바꾼지 오래되어 업데이트가 필요한 상황
                navigate("/account/needUpdate");
            }
            else{//업데이트가 필요하지 않은 일반적인 상황
                navigate("/");
            }
        }
        catch (e) {
            //로그인 실패가 경우가 나눠진다
            //- 404 : 정보 불일치
            //- 403 : 차단된 회원
            if (e.response?.status === 403) {
                navigate("/account/block");
            }
            else if (e.response?.status === 404) {
                await Swal.fire("아이디 또는 비밀번호가 일치하지 않습니다.");
            }
            else {
                await Swal.fire("일시적인 서버 오류입니다.\n잠시 후 실행해주세요.");
            }
        }
    }, [account, loginAction, navigate]);


    return (<>
        <Jumbotron title="회원 로그인" content="로그인을 위한 정보를 입력해주세요" />

        <Form onSubmit={sendLogin}>
            <Row className="mt-4">
                <Form.Label column sm={3}>아이디</Form.Label>
                <Col sm={9}>
                    <Form.Control type="text" name="accountId" value={account.accountId}
                        onChange={changeStringValue} placeholder="User ID" />
                </Col>
            </Row>
            <Row className="mt-4">
                <Form.Label column sm={3}>비밀번호</Form.Label>
                <Col sm={9}>
                    <Form.Control type="password" name="accountPassword" value={account.accountPassword}
                        onChange={changeStringValue} placeholder="User Password" />
                </Col>
            </Row>

            <Row className="mt-5">
                <Col className="text-end">
                    {/* 2. 버튼 타입을 submit으로 변경 (onClick 제거 후 Form의 onSubmit이 처리) */}
                    <Button type="submit" variant="success" className="w-100">
                        <FaRightToBracket />
                        <span className="ms-2">로그인</span>
                    </Button>
                </Col>
            </Row>
        </Form>
    </>)
}