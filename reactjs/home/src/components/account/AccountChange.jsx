import { Button, Col, Form, Row } from "react-bootstrap";
import Jumbotron from "../../templates/Jumbotron";
import { useAtomValue } from "jotai";
import { act, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiClient, certClient } from "../../utils/reaxios";
import { loginUserState } from "@utils/storage";
import { useKakaoPostcodePopup } from 'react-daum-postcode';
import { result } from "lodash-es";
import { Link, useNavigate } from "react-router-dom";
import { FaAsterisk, FaCheck, FaEye, FaEyeSlash, FaMagnifyingGlass, FaPaperPlane, FaRotateRight, FaSpinner, FaSquarePen, FaUserPlus, FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function AccountChange() {
    // const { accountId, accountNickname, accountLevel } = useAtomValue(loginUserState);

    //kakao post
    const open = useKakaoPostcodePopup(
        "//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    );

    //state
    const [account, setAccount] = useState({
        accountPassword: "",
        accountNickname: "",
        accountEmail: "",
        accountBirth: "",
        accountContact: "",
        accountPost: "",
        accountAddress1: "",
        accountAddress2: "",
        accountMessage: ""
    });

    const [backup, setBackup] = useState(null);

    const [result, setResult] = useState({
        accountPassword: null,
        accountNickname: { clazz: null, code: null },
        accountEmail: {clazz : null , code : null },
        accountBirth: null,
        accountContact: null,
        accountPost: null,
        accountAddress1: null,
        accountAddress2: null,
        accountMessage: null
    });

    const [visible, setVisible] = useState({
        accountPassword : false
    });

    useEffect(() => {
        loadData();
    }, [])
    useEffect(()=>{
        if(backup === null)return;//아직 로딩이 완료되지 않은 상황

        checkAccountNickname();//null일 수 없음
        checkAccountEmail();//null일 수 없음
        checkAccountBirth();//null일 수 있음
        checkAccountContact();//null일 수 있음
        checkAccountAddress();//null일 수 있음
        checkAccountMessage();//null일 수 있음
    }, [backup]);

    //callback
    //- 데이터 로드
    const loadData = useCallback(async () => {
        const { data } = await apiClient.get(`/account/me`);

        //state의 필드명을 백업하고
        const keyList = Object.keys(account);

        //data에 존재하는 null을 모두 ""로 변경한 뒤 설정
        //- 배열이 아니라 객체라서 배열 명령(map)만으로는 처리가 어려움
        const entry = Object.entries(data);//객체를 엔트리로 변환
        const replace = entry
                            .filter(
                                ( [key, value] ) => keyList.includes(key)
                            )
                            .map(//엔트리를 순회하며 null을 ""로 치환
                                ( [key, value] ) => ( [key, value ?? ""])
                            );
        const convert = Object.fromEntries(replace);//엔트리 배열을 객체로 되돌림
        convert.accountPassword = "";

        console.table(convert);

        setAccount(convert);
        setBackup(convert);
    }, [account]);

    //callback
    //- 입력
    const changeStringValue = useCallback(e => {
        const { name, value } = e.target;
        setAccount(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const changeAccountEmail = useCallback(e=>{
        //인증이 완료되었는데 입력을 또 한 경우 -> 인증완료를 없었던 일로 한다
        if(result.accountEmail.clazz === "is-valid"){
            setResult(prev=>({
                ...prev,
                accountEmail : { clazz : null, code : null }
            }));
        }

        setAccount(prev=>({
                ...prev,
                accountEmail : e.target.value
            }));
    }, [result]);

    //- 검사
    const checkAccountPassword = useCallback(e=>{
        //비밀번호 검사
        const valid = account.accountPassword !== "";
        const clazz = valid ? "is-valid" : "is-invalid";

        //결과 변경
        setResult(prev=>({
            ...prev,
            accountPassword : clazz
        }));
    }, [account]);


    const checkAccountNickname = useCallback(async e => {
        // 기존 닉네임과 동일하면 통과
        if (account.accountNickname === backup.accountNickname) {
            setResult(prev => ({
                ...prev,
                accountNickname: { clazz: "is-valid", code: null }
            }));
            return;
        }

        const regex = /^[가-힣A-Za-z0-9]{1,10}$/;
        const valid = regex.test(account.accountNickname);
        if (valid === false) {//형식위반
            setResult(prev => ({
                ...prev,
                accountNickname: { clazz: "is-invalid", code: "format" }
            }));
            return
        }
        //형식 통과 -> 중복 검사
        const { data } = await apiClient.get(`/account/check-nickname/${account.accountNickname}`);
        const clazz = data === true ? "is-valid" : "is-invalid";
        const code = data === true ? null : "duplicate";

        setResult(prev => ({
            ...prev,
            accountNickname: { clazz: clazz, code: code }
        }));
    }, [account, backup]);

    const checkAccountEmail = useCallback(async e=>{
         // 기존 닉네임과 동일하면 통과
        if (account.accountEmail === backup.accountEmail) {
            setResult(prev => ({
                ...prev,
                accountEmail: { clazz: "is-valid", code: null }
            }));
            return;
        }

        const regex = /^([a-z][a-z0-9]{4,19})@([A-Za-z0-9\-\.]{1,})(\.[a-z]{2,3})$/;
        const valid = regex.test(account.accountEmail);
        if(valid === false){
            setResult(prev=>({
                ...prev,
                accountEmail : {clazz : "is-invalid" , code : "format" }
            }));
            return;
        }
        //형식 통과 -> 중복 검사
        const { data } = await apiClient.get(`/account/check-email/${account.accountEmail}`);
        const clazz = data ? "" : "is-invalid";//형식과 중복검사를 통과하더라도 아직 인증번호가 남아있음
        const code = data ? null : "duplicate";
        setResult(prev=>({
            ...prev,
            accountEmail : { clazz : clazz, code : code }
        }));
    }, [account, backup]);

    const checkAccountBirth = useCallback(e => {
        const regex = /^([0-9]{4})-(((02)-(0[1-9]|1[0-9]|2[0-9]))|((0[469]|11)-(0[1-9]|1[0-9]|2[0-9]|30))|((0[13578]|1[02])-(0[1-9]|1[0-9]|2[0-9]|3[01])))$/;
        const valid = account.accountBirth.length === 0 || regex.test(account.accountBirth);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult(prev => ({
            ...prev,
            accountBirth: clazz
        }));
    }, [account]);

    const checkAccountContact = useCallback(e => {
        const regex = /^010[1-9][0-9]{7}$/;
        const valid = account.accountContact.length === 0 || regex.test(account.accountContact);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult(prev => ({
            ...prev,
            accountContact: clazz
        }));
    }, [account]);

    const checkAccountAddress = useCallback(e => {
        const empty = account.accountPost === "" && account.accountAddress1 === "" && account.accountAddress2 === "";
        const fill = account.accountPost !== "" && account.accountAddress1 !== "" && account.accountAddress2 !== "";
        const valid = empty || fill;
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult(prev => ({
            ...prev,
            accountPost: clazz,
            accountAddress1: clazz,
            accountAddress2: clazz
        }));
    }, [account]);

    const checkAccountMessage = useCallback(e => {
        setResult(prev => ({
            ...prev,
            accountMessage: "is-valid"
        }));
    }, [account]);

    const address2ref = useRef();

    //우편번호 처리
    const addressSearch = useCallback((e) => {
        // if(이벤트 발생이 입력창이고 입력창에 이미 글자가 있다면)return;
        const { tagName, value } = e.target;
        if (tagName === "INPUT" && value !== "") return;

        open({
            onComplete: (data) => {
                // console.log(data);
                //- useSelectedType : 선택한 주소의 유형 (R or J)
                //- roadAddress : 도로명 주소(신주소)
                //- jibunAddress : 지번 주소(구주소)
                //- zonecode : 우편번호
                const zonecode = data.zonecode;
                const address = data.userSelectedType === "R" ?
                    data.roadAddress : data.jibunAddress;
                //주소 변경
                setAccount(prev => ({
                    ...prev,
                    accountPost: zonecode,
                    accountAddress1: address,
                    accountAddress2: "",
                }));

                //상세주소창에 포커스를 줄 수 있나?
                //기존코드 - 태그 선택 후 명령을 사용
                //document.querySelector("[name=accountAddress2").focus();

                //리액트는? ref를 사용
                address2ref.current.focus();

            }
        });
    }, []);

    const addressRemove = useCallback(e => {
        // console.log(e.currentTarget.style.opacity);//기존의 this와 완전히 같은 역할
        if (parseInt(e.currentTarget.style.opacity) === 0) return;

        setAccount(prev => ({
            ...prev,
            accountPost: "",
            accountAddress1: "",
            accountAddress2: ""
        }));

        setResult(prev => ({
            ...prev,
            accountPost: null,
            accountAddress1: null,
            accountAddress2: null,
        }));
        setVisible2(false);
    }, [])

    //주소 삭제버튼이 나와야되는지 판정하기 위한 memo 
    const isAddressWritten = useMemo(() => {
        if (account.accountPost !== "") return true;
        if (account.accountAddress1 !== "") return true;
        if (account.accountAddress2 !== "") return true;
    })

    //이메일 인증 관련 기능들
    const sendCert = useCallback(async () => {
        //다시보내기일 수도 있으니 result의 accountEmail의 상태를 초기화한다
        setResult(prev => ({
            ...prev,
            accountEmail: { class: null, code: null }
        }));
        setCertNumberResult(null);
        setCertNumber("");

        try {
            setSending(true);
            const response = await certClient.post(
                "/service/cert/send",
                { certEmail: account.accountEmail }
            );
            console.log("이메일 발송 완료");
        }
        catch (e) {
            toast.error("이메일 발송 오류")
        }
        finally {
            setSending(false);//오류 여부와 관계없이 상태 원위치
        }
    }, [account.accountEmail]);

    //인증번호
    const [certNumber, setCertNumber] = useState("");
    const [certNumberResult, setCertNumberResult] = useState(null);//인증번호 판정결과 클래스
    const [sending, setSending] = useState(null);//이메일 발송중 여부 (null / true / false)

    const changeCertNumber = useCallback(e => {
        const replacement = e.target.value.replace(/[^0-9]+/g, "");
        setCertNumber(replacement);
    }, []);

    const checkCert = useCallback(async () => {
        const { data } = await certClient.post(
            "/service/cert/check",
            { certEmail: account.accountEmail, certNumber: certNumber }
        );
        // console.log("결과 : ", data.valid);
        setCertNumberResult(data.valid ? "is-valid" : "is-invalid");
        if (data.valid) {//인증결과가 성공이라면
            // result에 있는 accountEmail의 clazz에 is-valid를 넣어라
            setResult(prev => ({
                ...prev,
                accountEmail: { clazz: "is-valid", code: null }
            }));
        }
    }, [account.accountEmail, certNumber]);


    //memo
    const allValid = useMemo(() => {
        if(result.accountPassword !== "is-valid") return false;//필수
        if (result.accountNickname.clazz !== "is-valid") return false;//필수
        if(result.accountEmail.clazz !== "is-valid") return false;//필수
        
        if(account.accountEmail !== backup.accountEmail){
            if(certNumberResult !== "is-valid")return false;//인증번호 (이메일이 달라졌을 경우만)
        }
        if (result.accountBirth === "is-invalid") return false;//선택
        if (result.accountContact === "is-invalid") return false;//선택
        if (result.accountPost === "is-invalid") return false;//선택
        if (result.accountAddress1 === "is-invalid") return false;//선택
        if (result.accountAddress2 === "is-invalid") return false;//선택
        if (result.accountMessage === "is-invalid") return false;//선택

        return true;
    }, [result, certNumberResult, backup, account]);

    // 최종 가입
    const navigate = useNavigate();

    const send = useCallback(async () => {
        try{
            const response = await apiClient.put(`/account/`, account);
            navigate("/account/mypage");
            toast.success("회원 정보가 수정되었습니다");
        }
        catch(e){
            console.error(e);
            // navigate("/account/joinFail");
        }
    }, [account, navigate]);





    return (<>
        <Jumbotron title="회원 정보 수정" />

        <Row className="mt-4">
            <Form.Label column sm={3}>
                닉네임
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="accountNickname" className={result.accountNickname.clazz} value={account.accountNickname}
                    onChange={changeStringValue} onBlur={checkAccountNickname} />
                <div className="invalid-feedback">
                    {result.accountNickname.code === "format" && (<>
                        한글, 영문, 숫자 10글자 이내로 작성해야 합니다.
                    </>)}
                    {result.accountNickname.code === "duplicate" && (<>
                        이미 사용중인 닉네임입니다.
                    </>)}
                </div>
            </Col>
        </Row>

        {/* 이메일은 인증번호 처리가 추가로 필요 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>이메일</span>
                <FaAsterisk className="text-danger" />
            </Form.Label>
            <Col sm={9}>
                <div className="d-flex flex-wrap">
                    <Form.Control type="text" inputMode="email" name="accountEmail"
                        value={account.accountEmail}
                        onChange={changeAccountEmail}
                        placeholder="test@email.com"
                        onBlur={checkAccountEmail}
                        className={`${result.accountEmail.clazz} w-auto d-inline-block`}
                        readOnly={sending} />
                    {/* 인증번호 발송버튼 */}
                    <Button variant={sending === false ? "danger" : "info"} className="ms-2" onClick={sendCert}
                        disabled={
                            result.accountEmail.clazz === "is-invalid"
                            || result.accountEmail.clazz === "is-invalid"//형식오류or중복 문제 발생시
                            || sending === true
                        }>
                        {sending === null && (<>
                            <FaPaperPlane />
                            <span className="ms-2 d-none d-sm-inline">인증번호 보내기</span>
                        </>)}
                        {sending === false && (<>
                            <FaRotateRight />
                            <span className="ms-2 d-none d-sm-inline">메일 다시 보내기</span>
                        </>)}
                        {sending === true && (<>
                            <FaSpinner className="spin" />
                            <span className="ms-2 d-none d-sm-inline">인증메일 발송중</span>
                        </>)}
                    </Button>
                    <div className="invalid-feedback">
                        {result.accountEmail.code === "format" && (<>
                            올바르지 않은 이메일 형식입니다.
                        </>)}
                        {result.accountEmail.code === "duplicate" && (<>
                            이미 사용중인 이메일입니다
                        </>)}
                    </div>
                </div>
            </Col>
        </Row>

        {/* 인증번호 입력화면은 발송이 완료된 경우만 나와야 함 */}
        {(sending === false && certNumberResult !== "is-valid") && (
            <Row className="mt-2">
                <Col sm={{ span: 9, offset: 3 }}>
                    <div className="d-flex flex-wrap">
                        <Form.Control type="text" placeholder="인증번호"
                            value={certNumber} onChange={changeCertNumber}
                            className={`w-auto ${certNumberResult}`} />
                        {/* 인증번호확인 */}
                        <Button variant="success" className="ms-2" onClick={checkCert}>
                            <FaCheck />
                            <span className="ms-2 d-none d-sm-inline">인증번호 확인</span>
                        </Button>
                        <div className="valid-feedback">인증번호 확인이 완료되었습니다</div>
                        <div className="invalid-feedback">인증번호가 일치하지 않습니다</div>

                    </div>
                </Col>
            </Row>
        )}

        <Row className="mt-4">
            <Form.Label column sm={3}>
                생년월일
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="date" name="accountBirth" className={result.accountBirth} value={account.accountBirth}
                    onChange={changeStringValue} onBlur={checkAccountBirth} />
                <div className="invalid-feedback">날짜 형식이 올바르지 않습니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                연락처
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" inputMode="tel" name="accountContact" className={result.accountContact} value={account.accountContact}
                    onChange={changeStringValue} onBlur={checkAccountContact} />
                <div className="invalid-feedback">연락처 형식이 올바르지 않습니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>주소</span>
            </Form.Label>
            <Col sm={9}>
                <div className="d-flex">
                    {/* 우편번호 입력창 */}
                    <Form.Control type="text" inputMode="numeric"
                        name="accountPost" value={account.accountPost}
                        readOnly onClick={addressSearch}
                        className={`${result.accountPost} w-auto d-inline-block`}
                        placeholder="우편번호"
                        value={account.accountPost}
                    />
                    {/* 검색창 */}
                    <Button variant="success" className="ms-2" onClick={addressSearch}>
                        <FaMagnifyingGlass />
                        <span className="d-none d-md-inline-block">우편번호 검색</span>
                    </Button>


                    <Button variant="danger" className="ms-2" onClick={addressRemove}
                        style={
                            {
                                opacity: isAddressWritten === true ? 100 : 0,
                                transition: "opacity 0.1s ease-out",
                                cursor: isAddressWritten ? "pointer" : "default",
                            }
                        }>
                        <FaXmark />
                        <span className="d-none d-md-inline-block">작성내역 지우기</span>
                    </Button>
                </div>
            </Col>
        </Row>
        <Row className="mt-2">
            {/* <Col sm={9} className="offset-sm-3" > */}
            <Col sm={{ span: 9, offset: 3 }}>
                <Form.Control type="text"
                    name="accountAddress1" value={account.accountAddress1}
                    readOnly onClick={addressSearch}
                    className={result.accountAddress1}
                    placeholder="기본주소"
                    value={account.accountAddress1}
                />
            </Col>
        </Row>
        <Row className="mt-2">
            <Col sm={{ span: 9, offset: 3 }}>
                <Form.Control type="text"
                    name="accountAddress2" value={account.accountAddress2}
                    onChange={changeStringValue}
                    onBlur={checkAccountAddress}
                    className={result.accountAddress2}
                    placeholder="상세주소"
                    ref={address2ref}
                    value={account.accountAddress2}
                />
                <div className="invalid-feedback">주소는 비우거나 모두 작성해야 합니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>상태메세지</span>
            </Form.Label>
            <Col sm={9}>
                <Form.Control as="textarea" rows={5} name="accountMessage"
                    value={account.accountMessage} onChange={changeStringValue}
                    onBlur={checkAccountMessage}
                    className={result.accountMessage}/>
            </Col>
        </Row>


        {/* 비밀번호는 변경하는 항목이 아니라 검증을 위하여 한번 더 입력하는 값 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>비밀번호</span>
                <FaAsterisk className="text-danger"/>

                { visible.accountPassword === true ? (
                    <FaEye className="text-danger ms-4" onClick={e=>{
                        setVisible(prev=>({...prev, accountPassword : false}))
                    }}/>
                ):(
                    <FaEyeSlash className="text-info ms-4" onClick={e=>{
                        setVisible(prev=>({...prev, accountPassword : true}))
                    }}/>
                )}

            </Form.Label>
            <Col sm={9}>
                <Form.Control type={visible.accountPassword ? "text" : "password"} 
                    name="accountPassword"
                    value={account.accountPassword} onChange={changeStringValue}
                    placeholder="확인용 비밀번호 입력"
                    onBlur={checkAccountPassword}
                    className={result.accountPassword}/>
                <div className="invalid-feedback">비밀번호는 반드시 입력하셔야 합니다</div>
            </Col>
        </Row>


        <Row className="mt-4">
            <Col className="text-end">
                <Button as={Link} to={"/account/mypage"} variant="danger" className="ms-2">
                    <FaXmark className="me-2" />
                    <span>취소하기</span>
                </Button>
                <Button type="button" variant="success" className="ms-2"
                    disabled={allValid === false} 
                    onClick={send}>
                    <FaSquarePen className="me-2" />
                    <span>수정하기</span>
                </Button>
            </Col>
        </Row>
    </>)
}