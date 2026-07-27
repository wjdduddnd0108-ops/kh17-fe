import Jumbotron from "@templates/Jumbotron"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { FaChevronDown, FaEraser, FaMagnifyingGlass } from "react-icons/fa6";
import { apiClient } from "@utils/reaxios";
import { TbTilde } from "react-icons/tb";

import "./AdminUsersScroll.css";

import { ko } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { throttle } from "lodash-es";

import dayjs from "dayjs";
import "dayjs/locale/ko";
import { Link } from "react-router-dom";
dayjs.locale("ko");//한국어로 설정

//등급을 미리 정의 (갱신의 여지가 없고 화면의 변화와 관계가 없으므로 바깥에 만듦)
// const levelList = ["브론즈","실버","골드","다이아","플래티넘"];
// const fruitList = ["사과", "딸기", "바나나"];
const dataList = {
    accountLevels : ["브론즈","실버","골드","다이아","플래티넘"],
    // fruits = ["사과", "딸기", "바나나"]
}

export default function AdminUsersScroll() {
    //state
    const [condition, setCondition] = useState({
        accountId: "",
        accountNickname : "",
        accountContact : "",
        accountEmail : "",
        accountAddress : "",
        accountBirthBegin : "", accountBirthEnd : "",
        accountJoinBegin : "", accountJoinEnd : "",
        accountLoginBegin : "", accountLoginEnd : "",
        accountPointMin : "", accountPointMax : "",
        accountLevels : [],
        accountBlock : "",
        // fruits:[]
    });

    const changeStringValue = useCallback(e=>{
        const { name, value } = e.target;
        setCondition(prev=>({
            ...prev,
            [name] : value
        }));
    }, []);
    const changeNumericValue = useCallback(e=>{
        const { name, value } = e.target;
        const replacement = value.replace(/[^0-9]+/g, "");
        const replacement2 = parseInt(replacement) || "";
        setCondition(prev=>({
            ...prev,
            [name] : replacement2
        }));
    }, []);
    const changeListValue = useCallback(e=>{
        const { name, value, checked } = e.target;

        if(checked) {//체크되었다면
            setCondition(prev=>({
                ...prev,
                // [name] : [ ...prev.accountLevels , value ]
                // [name] : [ ...prev["accountLevels"] , value ]
                [name] : [ ...prev[name] , value ]
            }));
        }
        else {//체크되지 않았다면
            setCondition(prev=>({
                ...prev,
                [name] : prev[name].filter(level => level !== value)
            }));
        }
    }, []);
    const changeListValueAll = useCallback(e=>{
        const { name, checked } = e.target;
        if(checked) {//전체선택 ON
            setCondition(prev=>({
                ...prev,
                // [name] : ["브론즈","실버","골드","다이아","플래티넘"]
                // [name] : levelList//절대안됨(얕은복사, shallow copy)
                // [name] : [...levelList]//깊은복사(deep copy)
                [name] : [...dataList[name]]
            }));
        }   
        else {//전체선택 OFF
            setCondition(prev=>({
                ...prev,
                [name] : []
            }));
        }     
    }, []);
    const checkedAll = useMemo(()=>{
        // return condition.accountLevels.length == levelList.length;
        return {
            accountLevels : condition.accountLevels.length === dataList.accountLevels.length,
            // fruit : condition.fruits.length === dataList.fruits.length,
        };
    }, [condition]);

    const [list, setList] = useState([]);
    // const [last, setLast] = useState(true);//사용불가(그렇게됐다...)
    const last = useRef(true);//연관항목없이도 아무데서나 접근 가능한 동기식 데이터
    const [size, setSize] = useState(10);
    const lastAccountId = useMemo(()=>{
        if(list.length === 0) return null;
        // return list[list.length-1].accountId//마지막
        return list.at(-1).accountId;
    },[list]);

    //검색
    const sendSearch = useCallback(async e=>{
        if(loading.current === true) return;//이미 로딩중이면 하지마!
        loading.current = true;//로딩시작했다

        e.preventDefault();//기본 form 전송 차단
        
        // const { data } = await apiClient.post("/account/search", condition);
        const copy = {
            //객체에 데이터를 추가할 때 이름을 적지 않으면 해당 변수명과 동일하게 생김
            ...condition, lastAccountId, size
        };
        const { data } = await apiClient.post("/admin/complexSearch", copy);

        setList(data.list);//덮어쓰기
        // setList(prev=>[...prev, ...data.list]);//이어쓰기
        // setLast(data.last);
        last.current = data.last;

        loading.current = false;//로딩 끝났다
    }, [condition, lastAccountId, size]);

    const sendMore = useCallback(async e=>{
        console.log("더보기가 실행하려고 생각중입니다");
        if(loading.current === true) return;//이미 로딩중이면 하지마!
        loading.current = true;//로딩시작했다
        console.log("더보기가 실행되었습니다")

        const copy = {
            //객체에 데이터를 추가할 때 이름을 적지 않으면 해당 변수명과 동일하게 생김
            ...condition, lastAccountId, size
        };
        const { data } = await apiClient.post("/admin/complexSearch", copy);

        // setList(data.list);//덮어쓰기
        setList(prev=>[...prev, ...data.list]);//이어쓰기
        // setLast(data.last);
        last.current = data.last;

        loading.current = false;//로딩 끝났다
    }, [condition, lastAccountId, size]);

    const getScrollPercent = useCallback(()=>{
        //필요한 데이터들을 추출
        const { scrollY } = window;
        const { scrollTop, scrollHeight, clientHeight } = window.document.documentElement;
        //콘텐츠가 창보다 작은 경우 (스크롤이 없는 경우) 처리
        if(scrollHeight <= clientHeight) return 0;
        //현재 스크롤의 위치 계산
        const current = scrollY ||scrollTop;
        //스크롤 가능한 최대 위치 계산
        const max = scrollHeight - clientHeight;
        //부동소수점 방식에서 발생하는 오차를 제거
        if(max - current < 1) return 100;
        //비율을 계산해서 반환
        return current * 100 / max;
    }, []);

    //로딩중 상태를 표시하기 위한 값
    // const [loading, setLoading] = useState(false);//실행빈도가 낮을때
    const loading = useRef(false);//실행빈도가 매우 높을 때 (ex : scroll, resize)

    // 화면이 시작되면 스크롤 이벤트를 설정 + 화면이 사라지면 스크롤 이벤트를 제거
    // -> 클린업 함수를 포함하여 useEffect 훅을 작성해야함

    // 문제 발생 : 스크롤이벤트를 등록하는 시점의 sendMore에는 lastAccountNo = null, size = 10이다.
    //- 갱신이 스스로 안된다
    //- [1번 해결책] 사용되는 데이터를 Ref로 변경(하책)
    //- [2번 해결책] 사용되는 함수를 Ref로 변경 (상책..?)
    const sendMoreRef = useRef(null);
    useEffect(()=>{
        sendMoreRef.current = sendMore;
    }, [sendMore]);

    useEffect(()=>{
        // console.log("화면시작했다");
        const listener = throttle(()=>{
            // console.log("스크롤 움직였어")
            const percent = getScrollPercent();
            console.log("현재 스크롤의 위치 : " + percent.toFixed(2) + "%");

            //useRef로 만든 데이터는 연관항목에 없어도 마음대로 접근할 수 있다
            if(last.current === false && percent === 100) {
                if(sendMoreRef.current){
                    // console.log("더보기 실행")
                    sendMoreRef.current();
                }
            }
        }, 250);

        window.addEventListener("scroll", listener);

        //클린업(clean-up) 함수
        return ()=>{
            // console.log("화면 끝났다");
            window.removeEventListener("scroll", listener);
        };
    },[]);
    //view
    return (<>
        <Jumbotron title="관리자용 회원 검색"/>

        {/* 옵션 입력화면 */}
        <Form onSubmit={sendSearch}>

        <Row className="mt-5">
            <Form.Label column sm={3}>아이디</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="accountId"
                    value={condition.accountId} onChange={changeStringValue}
                    placeholder="정확히 일치해야 검색"/>
            </Col>
        </Row>
        <Row className="mt-2">
            <Form.Label column sm={3}>닉네임</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="accountNickname"
                    value={condition.accountNickname} onChange={changeStringValue}
                    placeholder="정확히 일치해야 검색"/>
            </Col>
        </Row>
        <Row className="mt-2">
            <Form.Label column sm={3}>연락처</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="accountContact" inputMode="tel"
                    value={condition.accountContact} onChange={changeStringValue}
                    placeholder="정확히 일치해야 검색"/>
            </Col>
        </Row>
        <Row className="mt-2">
            <Form.Label column sm={3}>이메일</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="accountEmail" inputMode="email"
                    value={condition.accountEmail} onChange={changeStringValue}
                    placeholder="일부분만 일치해도 검색"/>
            </Col>
        </Row>
        <Row className="mt-2">
            <Form.Label column sm={3}>주소</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="accountAddress"
                    value={condition.accountAddress} onChange={changeStringValue}
                    placeholder="일부분만 일치해도 검색"/>
            </Col>
        </Row>

        <Row className="mt-2">
            <Form.Label column sm={3}>생년월일</Form.Label>
            <Col sm={9}>
                <div className="d-flex align-items-center">
                    <DatePicker 
                        name="accountBirthBegin" 
                        selected={condition.accountBirthBegin}
                        onChange={(date)=>{
                            //date가 우리가 원하는 형식이 아님(내일 변경 후 설정)
                            //→ dayjs를 이용해서 "YYYY-MM-DD" 형태로 변경
                            const convertDate = dayjs(date).format("YYYY-MM-DD");
                            setCondition(prev=>({...prev, accountBirthBegin: convertDate}))
                        }}
                        dateFormat={"yyyy-MM-dd"}
                        customInput={<Form.Control/>}
                        wrapperClassName={`w-100`}
                        
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"

                        locale={ko}
                    />
                    <TbTilde size={24} className="mx-2"/>
                    <DatePicker 
                        name="accountBirthEnd" 
                        selected={condition.accountBirthEnd}
                        onChange={(date)=>{
                            //date가 우리가 원하는 형식이 아님(내일 변경 후 설정)
                            //→ dayjs를 이용해서 "YYYY-MM-DD" 형태로 변경
                            const convertDate = dayjs(date).format("YYYY-MM-DD");
                            setCondition(prev=>({...prev, accountBirthEnd: convertDate}))
                        }}
                        dateFormat={"yyyy-MM-dd"}
                        customInput={<Form.Control/>}
                        wrapperClassName={`w-100`}
                        
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"

                        locale={ko}
                    />
                </div>
            </Col>
        </Row>
        <Row className="mt-2">
            <Form.Label column sm={3}>가입일</Form.Label>
            <Col sm={9}>
                <div className="d-flex align-items-center">
                    <DatePicker 
                        name="accountJoinBegin" 
                        selected={condition.accountJoinBegin}
                        onChange={(date)=>{
                            //date가 우리가 원하는 형식이 아님(내일 변경 후 설정)
                            //→ dayjs를 이용해서 "YYYY-MM-DD" 형태로 변경
                            const convertDate = dayjs(date).format("YYYY-MM-DD");
                            setCondition(prev=>({...prev, accountJoinBegin: convertDate}))
                        }}
                        dateFormat={"yyyy-MM-dd"}
                        customInput={<Form.Control/>}
                        wrapperClassName={`w-100`}
                        
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"

                        locale={ko}
                    />
                    <TbTilde size={24} className="mx-2"/>
                    <DatePicker 
                        name="accountJoinEnd" 
                        selected={condition.accountJoinEnd}
                        onChange={(date)=>{
                            //date가 우리가 원하는 형식이 아님(내일 변경 후 설정)
                            //→ dayjs를 이용해서 "YYYY-MM-DD" 형태로 변경
                            const convertDate = dayjs(date).format("YYYY-MM-DD");
                            setCondition(prev=>({...prev, accountJoinEnd: convertDate}))
                        }}
                        dateFormat={"yyyy-MM-dd"}
                        customInput={<Form.Control/>}
                        wrapperClassName={`w-100`}
                        
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"

                        locale={ko}
                    />
                </div>
            </Col>
        </Row>
        <Row className="mt-2">
            <Form.Label column sm={3}>최종로그인</Form.Label>
            <Col sm={9}>
                <div className="d-flex align-items-center">
                    <DatePicker 
                        name="accountLoginBegin" 
                        selected={condition.accountLoginBegin}
                        onChange={(date)=>{
                            //date가 우리가 원하는 형식이 아님(내일 변경 후 설정)
                            //→ dayjs를 이용해서 "YYYY-MM-DD" 형태로 변경
                            const convertDate = dayjs(date).format("YYYY-MM-DD");
                            setCondition(prev=>({...prev, accountLoginBegin: convertDate}))
                        }}
                        dateFormat={"yyyy-MM-dd"}
                        customInput={<Form.Control/>}
                        wrapperClassName={`w-100`}
                        
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"

                        locale={ko}
                    />
                    <TbTilde size={24} className="mx-2"/>
                    <DatePicker 
                        name="accountLoginEnd" 
                        selected={condition.accountLoginEnd}
                        onChange={(date)=>{
                            //date가 우리가 원하는 형식이 아님(내일 변경 후 설정)
                            //→ dayjs를 이용해서 "YYYY-MM-DD" 형태로 변경
                            const convertDate = dayjs(date).format("YYYY-MM-DD");
                            setCondition(prev=>({...prev, accountLoginEnd: convertDate}))
                        }}
                        dateFormat={"yyyy-MM-dd"}
                        customInput={<Form.Control/>}
                        wrapperClassName={`w-100`}
                        
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"

                        locale={ko}
                    />
                </div>
            </Col>
        </Row>


        <Row className="mt-2">
            <Form.Label column sm={3}>포인트</Form.Label>
            <Col sm={9}>
                <div className="d-flex align-items-center">
                    <Form.Control type="text" inputMode="numeric"
                        name="accountPointMin" value={condition.accountPointMin}
                        onChange={changeNumericValue}
                        placeholder="최소 포인트"/>
                    <TbTilde size={24} className="mx-2"/>
                    <Form.Control type="text" inputMode="numeric"
                        name="accountPointMax" value={condition.accountPointMax}
                        onChange={changeNumericValue}
                        placeholder="최대 포인트"/>
                </div>
            </Col>
        </Row>

        <Row className="mt-2">
            <Form.Label column sm={3}>차단여부</Form.Label>
            <Col sm={9}>
                <Form.Check type="radio" label="전체" 
                            name="accountBlock" value=""
                            checked={condition.accountBlock === ""}
                            onChange={e=>setCondition(prev=>({...prev, accountBlock:""}))}/>
                <Form.Check type="radio" label="차단된 회원만" 
                            name="accountBlock" value="Y"
                            checked={condition.accountBlock === "Y"}
                            onChange={e=>setCondition(prev=>({...prev, accountBlock:"Y"}))}/>
                <Form.Check type="radio" label="차단되지 않은 회원만" 
                            name="accountBlock" value="N"
                            checked={condition.accountBlock === "N"}
                            onChange={e=>setCondition(prev=>({...prev, accountBlock:"N"}))}/>
            </Col>
        </Row>

        <Row className="mt-2">
            <Form.Label column sm={3}>등급</Form.Label>
            <Col sm={9}>
                <Form.Check type="checkbox" label="전체선택"
                    name="accountLevels"
                    onChange={changeListValueAll}
                    checked={checkedAll.accountLevels}/>
                {dataList.accountLevels.map((level, index)=>(
                <Form.Check type="checkbox" label={level} key={index}
                    name="accountLevels" value={level}
                    onChange={changeListValue}
                    checked={condition.accountLevels.includes(level)}/>
                ))}
            </Col>
        </Row>


        {/* <Row className="mt-2">
            <Form.Label column sm={3}>연습용</Form.Label>
            <Col sm={9}>
                <Form.Check type="checkbox" label="전체선택"
                    name="fruits"
                    onChange={changeListValueAll}
                    checked={checkedAll.fruits}/>
                {dataList.fruits.map((fruit, index)=>(
                <Form.Check type="checkbox" label={fruit} key={index}
                    name="fruits" value={fruit}
                    onChange={changeListValue}
                    checked={condition.fruits.includes(fruit)}/>
                ))}
            </Col>
        </Row> */}

        <Row className="mt-2">
            <Form.Label column sm={3}>등급</Form.Label>
            <Col sm={9}>
                <Form.Select onChange={e=>setSize(parseInt(e.target.value))}
                    value={size}>
                    <option value="10">10개</option>
                    <option value="20">20개</option>
                    <option value="50">50개</option>
                    <option value="100">100개</option>
                </Form.Select>
            </Col>
        </Row>

        <Row className="mt-4 text-end">
            <Col>
                {/* 
                <Button type="reset" variant="danger" size="lg"
                        className="w-md-auto">
                    <FaEraser className="me-2"/>
                    <span>초기화</span>
                </Button> 
                */}

                <Button type="submit" variant="success" size="lg"
                        className="w-md-auto">
                    <FaMagnifyingGlass className="me-2"/>
                    <span>검색하기</span>
                </Button>
            </Col>
        </Row>

        </Form>

        <hr/>
        {/* 결과 출력화면 */}
        <Row className="mt-5">
            <Col>
                <Table responsive striped hover className="text-nowrap">
                    <thead>
                        <tr>
                            <th>아이디</th>                            
                            <th>닉네임</th>                            
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(account=>(
                        <tr key={account.accountId}>
                            <td>
                                <Link to={`/admin/detail/${account.accountId}`}>
                                    {account.accountId}
                                </Link>
                            </td>
                            <td>{account.accountNickname}</td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>
    </>)
}