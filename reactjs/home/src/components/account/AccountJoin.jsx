import Jumbotron from "@templates/Jumbotron";
import { use, useCallback, useMemo, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaAsterisk, FaMagnifyingGlass, FaUserPlus, FaXmark } from "react-icons/fa6";

export default function AccountJoin(){
    //state
    const [account, setAccount] = useState({
        accountId: "",
        accountPassword: "",
        accountPassword2: "",
        accountEmail: "",
        accountNickname: "",
        accountBirth: "",
        accountContact: "",
        accountPost: "",
        accountAddress1: "",
        accountAddress2: "",
        accountMessage: ""
    });

    const [result, setResult] = useState({
        accountId: null,
        accountPassword: null,
        accountPassword2: null,
        accountEmail: null,
        accountNickname: null,
        accountBirth: null,
        accountContact: null,
        accountPost: null,
        accountAddress1: null,
        accountAddress2: null,
        accountMessage: null
    });

    //callback
    //-입력
    const changeStringValue = useCallback(e=>{
        const { name, value } = e.target;
        setAccount(prev=>({
            ...prev,
            [name] : value
        }));
    }, []);

    //- 검사
    //아이디검사
    const checkAccountId = useCallback(e=>{
        const regex = /^[a-z][a-z0-9]{4,19}$/;
        const valid = regex.test(account.accountId);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult(prev=>({...prev, accountId : clazz}));
    }, [account.accountId]);

    //이메일검사
    const checkAccountEmail = useCallback(e=>{
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const valid = regex.test(account.accountEmail);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult(prev=>({...prev, accountEmail : clazz}));
    }, [account.accountEmail]);

    //비밀번호검사
    const checkAccountPassword = useCallback(e=>{
        //비밀번호 검사
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|\\:;"'<>,.?/~`-])[A-Za-z\d!@#$%^&*()_+[\]{}|\\:;"'<>,.?/~`-]{8,16}$/;
        const valid = regex.test(account.accountPassword);
        const clazz = valid ? "is-valid" : "is-invalid";

        //비밀번호 확인 검사
        const checkValid = account.accountPassword === account.accountPassword2 && account.accountPassword2.length > 0;
        const clazz2 = checkValid ? "is-valid" : "is-invalid";
        setResult(prev=>({
                ...prev, 
                accountPassword : clazz,
                accountPassword2 : clazz2 
            }));
    }, [account.accountPassword, account.accountPassword2]);

    //닉네임검사
    const checkAccountNickname =useCallback(e=>{
        const regex = /^[가-힣A-Za-z0-9]{1,10}$/;
        const valid = regex.test(account.accountNickname);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult(prev=>({...prev, accountNickname : clazz}));
    }, [account.accountNickname]);

    //생년월일검사
    const checkAccountBirth = useCallback(e=>{
        const regex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/; 
        const valid = account.accountBirth.length === 0 ||
            regex.test(account.accountBirth);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult(prev=>({...prev, accountBirth : clazz}));
    }, [account.accountBirth]);

    //연락처검사
    const checkAccountContact = useCallback(e=>{
        const regex = /^010[1-9][0-9]{7}$/; 
        const valid = account.accountContact.length === 0 ||
            regex.test(account.accountContact);
            const clazz = valid ? "is-valid" : "is-invalid";
            setResult(prev=>({...prev, accountContact : clazz}));
    }, [account.accountContact]);
    
    //주소검사
    const checkAccountAddress = useCallback(e=>{
        const empty = account.accountPost === "" && account.accountAddress1 === "" && account.accountAddress2 === "";
        const fill = account.accountPost !== "" && account.accountAddress1 !== "" && account.accountAddress2 !== "";
        const valid = empty || fill;
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult(prev=>({
            ...prev,
            accountPost: clazz,
            accountAddress1: clazz,
            accountAddress2: clazz
        }));
    },[account]);

    //상태메세지검사
    const checkAccountMessage = useCallback(e=>{
        const valid = account.accountMessage.length <= 100;
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult(prev=>({...prev, accountMessage : clazz}));
    }, [account.accountMessage]);

    //memo
    const allvalid = useMemo(()=>{
        if(result.accountId !== "is-valid") return false;//필수
        if(result.accountPassword !== "is-valid") return false;//필수
        if(result.accountPassword2 !== "is-valid") return false;//필수
        if(result.accountNickname !== "is-valid") return false;//필수
        if(result.accountEmail !== "is-valid") return false;//필수

        if(result.accountBirth === "is-invalid") return false;//선택
        if(result.accountContact === "is-invalid") return false;//선택
        if(result.accountPost === "is-invalid") return false;//선택
        if(result.accountAddress1 === "is-invalid") return false;//선택
        if(result.accountAddress2 === "is-invalid") return false;//선택
        if(result.accountMessage === "is-invalid") return false;//선택
        
        return true;
    }, [result]);
    //view
    return (<>
        <Jumbotron title="가입 정보 입력" content="부정확한 정보 입력이 확인된 경우 계정 이용이 제한될 수 있습니다"/>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>아이디</span>
                <FaAsterisk className="text-danger"/>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="accountId"
                    value={account.accountId} onChange={changeStringValue}
                    placeholder="알파벳 소문자 시작, 숫자 포함 5-20자 이내"
                    onBlur={checkAccountId}
                    className={result.accountId}/>
                <div className="valid-feedback">아이디 설정이 완료되었습니다</div>
                <div className="invalid-feedback">형식오류 or 사용중</div>
            </Col>
        </Row>

        {/* 이메일 입력창 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>이메일</span>
                <FaAsterisk className="text-danger"/>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" inputMode="email" name="accountEmail"
                    value={account.accountEmail} onChange={changeStringValue}
                    placeholder="example@email.com"
                    onBlur={checkAccountEmail}
                    className={result.accountEmail}/>
                <div className="valid-feedback">이메일 인증 완료</div>
                <div className="invalid-feedback">올바르지않거나 사용중인 이메일</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>비밀번호</span>
                <FaAsterisk className="text-danger"/>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="accountPassword"
                    value={account.accountPassword} onChange={changeStringValue}
                    placeholder="비밀번호를 입력하세요"
                    onBlur={checkAccountPassword}
                    className={result.accountPassword}/>
                <div className="valid-feedback">비밀번호 설정이 완료되었습니다</div>
                <div className="invalid-feedback">형식오류</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>비밀번호 확인</span>
                <FaAsterisk className="text-danger"/>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="accountPassword2"
                    value={account.accountPassword2} onChange={changeStringValue}
                    placeholder="비밀번호를 한 번 더 입력하세요"
                    onBlur={checkAccountPassword}
                    className={result.accountPassword2}/>
                <div className="valid-feedback">비밀번호가 일치합니다</div>
                <div className="invalid-feedback">비밀번호가 입력하지 않았거나 일치하지 않습니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>닉네임</span>
                <FaAsterisk className="text-danger"/>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="accountNickname"
                    value={account.accountNickname} onChange={changeStringValue}
                    placeholder="닉네임을 입력하세요"
                    onBlur={checkAccountNickname}
                    className={result.accountNickname}/>
                <div className="valid-feedback">닉네임 설정이 완료되었습니다</div>
                <div className="invalid-feedback">올바르지 않거나 사용중인 닉네임</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>생년월일</span>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="date" name="accountBirth"
                    value={account.accountBirth} onChange={changeStringValue}
                    placeholder="알파벳 소문자 시작, 숫자 포함 5-20자 이내"
                    onBlur={checkAccountBirth}
                    className={result.accountBirth}/>
                <div className="valid-feedback">생년월일 설정이 완료되었습니다</div>
                <div className="invalid-feedback">형식오류</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>연락처</span>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" inputMode="tel" name="accountContact"
                    value={account.accountContact} onChange={changeStringValue}
                    placeholder="010-1234-5678"
                    onBlur={checkAccountContact}
                    className={result.accountContact}/>
                <div className="invalid-feedback">연락처 형식이 올바르지않습니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>주소</span>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" inputMode="numeric" name="accountPost"
                    value={account.accountPost} onChange={changeStringValue}
                    onBlur={checkAccountAddress}
                    placeholder="우편번호"
                    className={`${result.accountPost} w-auto d-inline-block`}/>
                <Button className="ms-2" variant="success">
                    <FaMagnifyingGlass/>
                    <span className="d-none d-md-inline-block">우편번호 검색</span>
                </Button>
                <Button variant="danger" className="ms-2">
                    <FaXmark/>
                    <span className="d-none d-md-inline-block">작성내역 지우기</span>
                </Button>
            </Col>
        </Row>
        <Row className="mt-2">
            {/* <Col sm={9} className="offset-sm-3"> */}
            <Col sm={ {span:9, offset:3} }>
                <Form.Control type="text" inputMode="numeric" name="accountAddress1"
                    value={account.accountAddress1} onChange={changeStringValue}
                    onBlur={checkAccountAddress}
                    placeholder="기본주소"
                    className={result.accountAddress1}/>
            </Col>
        </Row>
        <Row className="mt-2">
            {/* <Col sm={9} className="offset-sm-3"> */}
            <Col sm={ {span:9, offset:3} }>
                <Form.Control type="text" inputMode="numeric" name="accountAddress2"
                    value={account.accountAddress2} onChange={changeStringValue}
                    onBlur={checkAccountAddress}
                    placeholder="상세주소"
                    className={result.accountAddress2}/>
                <div className="invalid-feedback">주소는 비우거나 모두 작성해야 합니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>상태 메세지</span>
            </Form.Label>
            <Col sm={9}>
                <Form.Control as="textarea" name="accountMessage"
                    value={account.accountMessage} onChange={changeStringValue}
                    placeholder="상태 메세지 입력"
                    onBlur={checkAccountMessage} rows={5}
                    className={result.accountMessage}/>
            </Col>
        </Row>

        <Row className="my-5">
            <Col>
                <Button variant="success" size="lg" className="w-100"
                    disabled={allvalid === false}>
                    <FaUserPlus/>
                    <span className="ms-2">회원 가입하기</span>
                </Button>
            </Col>
        </Row>
    </>)
}