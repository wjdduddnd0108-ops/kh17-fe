import { Button, Col, Form, Row } from "react-bootstrap";
import Jumbotron from "../../templates/Jumbotron";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiClient } from "../../utils/reaxios";
import { loginUserState } from "@utils/storage";
import { useKakaoPostcodePopup } from 'react-daum-postcode';
import { result } from "lodash-es";
import { Link, useNavigate } from "react-router-dom";
import { FaList, FaMagnifyingGlass, FaSquarePen, FaXmark } from "react-icons/fa6";

export default function AccountEdit() {
    // const { accountId, accountNickname, accountLevel } = useAtomValue(loginUserState);

    //state
    const [account, setAccount] = useState({
        accountNickname: "",
        accountBirth: "",
        accountContact: "",
        accountPost: "",
        accountAddress1: "",
        accountAddress2: "",
        accountMessage: ""
    });

    const [originNickname, setOriginNickname] = useState("");

    const [result, setResult] = useState({
        //accountId: null,
        accountNickname: { clazz: null, code: null },
        accountBirth: null,
        accountContact: null,
        accountPost: null,
        accountAddress1: null,
        accountAddress2: null,
        accountMessage: null
    });

    useEffect(() => {
        loadData();
    }, [])

    //callback
    const loadData = useCallback(async () => {
        const { data } = await apiClient.get(`/account/me`);
        setAccount(data);
        setOriginNickname(data.accountNickname);
    }, [originNickname]);

    //callback
    //- 입력
    const changeStringValue = useCallback(e => {
        const { name, value } = e.target;
        setAccount(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    //- 검사
    const checkAccountNickname = useCallback(async e => {
        // 기존 닉네임과 동일하면 통과
        if(account.accountNickname === originNickname) {
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
    }, [account]);

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

    //memo
    const allValid = useMemo(()=>{
        if(result.accountNickname.clazz !== "is-valid") return false;//필수
        if(result.accountBirth === "is-invalid") return false;//선택
        if(result.accountContact === "is-invalid") return false;//선택
        if(result.accountPost === "is-invalid") return false;//선택
        if(result.accountAddress1 === "is-invalid") return false;//선택
        if(result.accountAddress2 === "is-invalid") return false;//선택
        if(result.accountMessage === "is-invalid") return false;//선택

        return true;
    }, [result]);

     // 최종 가입
    const navigate = useNavigate();

    const send = useCallback(async ()=>{
            const response = await apiClient.put(`/account/edit`, account);
            navigate("/account/mypage");
            toast.success("회원 정보가 수정되었습니다");
    }, [account, navigate])





    return (<>
        <Jumbotron title="회원 정보 수정" />

        <Row className="mt-4">
            <Form.Label column sm={3}>
                닉네임
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="accountNickname" className={result.accountNickname.clazz} value={account.accountNickname}
                    onChange={changeStringValue} onBlur={checkAccountNickname}/>
                <div className="invalid-feedback">
                    {result.accountNickname.code === "format" &&(<>
                        한글, 영문, 숫자 10글자 이내로 작성해야 합니다.
                    </>)}
                    {result.accountNickname.code === "duplicate" &&(<>
                        이미 사용중인 닉네임입니다.
                    </>)}
                </div>
            </Col>
        </Row>
        
        <Row className="mt-4">
            <Form.Label column sm={3}>
                생년월일
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="date" name="accountBirth" className={result.accountBirth} value={account.accountBirth}
                    onChange={changeStringValue} onBlur={checkAccountBirth}/>
                <div className="invalid-feedback">날짜 형식이 올바르지 않습니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                연락처
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" inputMode="tel" name="accountContact" className={result.accountContact} value={account.accountContact}
                    onChange={changeStringValue} onBlur={checkAccountContact}/>
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
                                <FaMagnifyingGlass/>
                                <span className="d-none d-md-inline-block">우편번호 검색</span>
                            </Button>
        
                            
                            <Button variant="danger" className="ms-2" onClick={addressRemove}
                                style={
                                    {
                                        opacity : isAddressWritten === true ? 100 : 0,
                                        transition : "opacity 0.1s ease-out",
                                        cursor : isAddressWritten ? "pointer" : "default",
                                    }
                                }>
                                <FaXmark/>
                                <span className="d-none d-md-inline-block">작성내역 지우기</span>
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Row className="mt-2">
                    {/* <Col sm={9} className="offset-sm-3" > */}
                    <Col sm={ {span:9 , offset:3} }>
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
                    <Col sm={ {span:9 , offset:3} }>
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
            <Col className="text-end">
                <Button as={Link} to={"/account/mypage"} variant="danger" className="ms-2">
                    <FaXmark className="me-2" />
                    <span>취소하기</span>
                </Button>
                <Button type="button" variant="success" className="ms-2"
                    disabled={allValid === false} onClick={send}>
                    <FaSquarePen className="me-2" />
                    <span>수정하기</span>
                </Button>
            </Col> 
        </Row>
    </>)
}