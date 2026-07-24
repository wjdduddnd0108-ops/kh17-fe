import Jumbotron from "@templates/Jumbotron"
import { useCallback, useMemo, useState } from "react"
import { apiClient } from "@utils/reaxios";
import { el } from "date-fns/locale";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { TbTilde } from "react-icons/tb";
import { compareDesc } from "date-fns";
import { FaEraser, FaMagnifyingGlass, FaPlus, FaTrash } from "react-icons/fa6";

import { ko } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");//한국어로 설정

export default function AdminComplexSearch() {
    //state
    const [condition, setCondition] = useState({
        accountId: "",
        accountNickname: "",
        accountContact: "",
        accountEmail: "",
        accountAddress: "",
        accountBirthBegin: "", accountBirthEnd: "",
        accountJoinBegin: "", accountJoinEnd: "",
        accountLoginBegin: "", accountLoginEnd: "",
        accountPointMin: "", accountPointMax: "",
        accountLevels: [],
        accountBlock: "",
        // size: 10,
        // orders: [

        // ]
    });
    const [list, setlist] = useState([]);
    const [last, setLast] = useState(true);

    const changeStringValue = useCallback(e => {
        const { name, value } = e.target;
        setCondition(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);
    const changeNumericValue = useCallback(e => {
        const { name, value } = e.target;
        const replacement = value.replace(/[^0-9]+/g, "");
        const replacement2 = parseInt(replacement) || "";
        setCondition(prev => ({
            ...prev,
            [name]: replacement2
        }));
    }, []);

    const send = useCallback(async e => {
        e.preventDefault();//기본 form 전송 차단

        const { data } = await apiClient.post("/admin/complexSearch", condition);
        console.log("data", data);
        setList(prev => [...prev, ...data.list]);//이어쓰기
        setLast(data.last);
    }, [condition]);

    const lastAccountId = useMemo(() => {
        if (list.length === 0) return null;
        return list[list.length - 1].accountId
    }, [list]);

    const loadMoreList = useCallback(async () => {
        const response = await apiClient.post(
            "/admin/complexSearch",
            { ...condition, lastAccountId: lastAccountId }
        );
        setList(prev => [...prev, ...response.data.list]);
        setLast(response.data.last);
    }, [lastAccountId, condition]);

    const checkAccountLevel = useCallback(e => {
        const { checked, value } = e.target;

        const clone = [...condition.accountLevels];
        const clone2 = checked
            ? [...clone, value]
            : clone.filter(level => level !== value);

        setCondition({ ...condition, accountLevels: clone2 });
    }, [condition]);

    const checkAccountBlocks = useCallback(e => {
        const { checked, value } = e.target;

        const clone = [...condition.accountBlocks];
        const clone2 = checked
            ? [...clone, value]
            : clone.filter(block => block !== value);

        setCondition({ ...condition, accountBlocks: clone2 });
    }, [condition]);




    const orderList = useMemo(() => {
        return [
            { name: "가입일 최신순", value: "account_join desc" },
            { name: "가입일 오래된순", value: "account_join asc" },

            { name: "최근 로그인순", value: "account_login desc" },
            { name: "로그인 오래된순", value: "account_login asc" },

            { name: "포인트 높은순", value: "account_point desc" },
            { name: "포인트 낮은순", value: "account_point asc" },

            { name: "아이디 오름차순", value: "account_id asc" },
            { name: "아이디 내림차순", value: "account_id desc" },

            { name: "닉네임 오름차순", value: "account_nickname asc" },
            { name: "닉네임 내림차순", value: "account_nickname desc" },

            { name: "등급 높은순", value: "account_level desc" },
            { name: "등급 낮은순", value: "account_level asc" },
        ];
    }, []);

    //선택 가능한 목록 : orderList의 항목 중에 condition.orders에 없는 요소들만 검색하여 반환
    const availableOrderList = useMemo(() => {
        //기존 : 같은 요소만 제거
        // return orderList.filter(order=>!condition.orders.includes(order));

        //변경 : 접두사(항목)이 같은 경우를 제거
        return orderList.filter(order => {
            const prefix = order.value.split(" ")[0];
            return condition.orders.findIndex(ord => {
                const prefix2 = ord.value.split(" ")[0];
                return prefix === prefix2;//같은지 비교하고
            }) === -1;//다른녀석들만 반환
        });
    }, [orderList, condition.orders]);

    //condition 중에서 orders에 한 개의 데이터를 추가
    const addOrder = useCallback(e => {
        if (availableOrderList.length === 0) {
            toast.error("더 이상 추가가 불가능합니다");
            return;
        }

        const clone = [...condition.orders];
        const clone2 = [...clone, availableOrderList[0]];
        setCondition({ ...condition, orders: clone2 });
    }, [condition, availableOrderList]);

    const deleteOrder = useCallback(index => {
        const clone = [...condition.orders];
        const clone2 = clone.filter((order, idx) => idx !== index);
        setCondition({ ...condition, orders: clone2 });
    }, [condition]);

    const changeOrder = useCallback((e, index) => {
        //console.log(e.target.value, index, condition.orders[index]);
        const dest = e.target.value;//바꿀 예정인 값
        const clone = [...condition.orders];//기존 정렬방식 복제
        const curr = clone[index].value;//현재 적용중인 값

        //같으면 중지
        if (dest === curr) return;

        //(+추가) 같은 항목을 오름차순/내림차순 동시 추가하는것을 차단
        //→ 현재 위치(index)가 아닌 곳에 dest와 항목만 같고 정렬방식이 다른 값이 존재하는지를 확인
        //→ 만약 [2]에 country_population desc를 선택했는데 [0]에 country_population asc가 있으면 안됨
        const destParts = dest.split(" ");
        const duplicateIndex = clone.findIndex((order, idx) => {
            if (idx === index) return false;//같은 위치는 제외
            const orderParts = order.value.split(" ");
            if (destParts[0] === orderParts[0] && destParts[1] !== orderParts[1]) return true;
            return false;
        });
        if (duplicateIndex >= 0) {//항목은 같은데 정렬방식이 다른 요소가 이미 만들어져 있다면
            toast.error("동일한 항목이 다른 정렬 방식으로 이미 존재합니다");
            return;
        }

        //예상 시나리오
        //1. 바꿀값(dest)이 선택항목(clone)에 없으면 해당 위치만 변경하면 됨
        if (!clone.some(order => order.value === dest)) {
            const clone2 = clone.map((order, idx) => {
                if (idx === index) {
                    return orderList.find(opt => opt.value === dest);//변경
                }
                return order;//유지
            });
            setCondition({ ...condition, orders: clone2 });
        }
        //2. 바꿀값(dest)이 선택항목(clone)에 있으면 해당 위치와 현재 위치의 값을 바꿈
        else {
            const destIndex = clone.indexOf(order => order.value === dest);//dest의 위치를 찾는다
            //현재 위치 index이므로 destIndex와 교체
            [clone[index], clone[destIndex]] = [clone[destIndex], clone[index]];
            //바뀐 결과를 condition.orders에 설정
            setCondition({ ...condition, orders: clone });
        }

    }, [condition]);

    const changeToKorean = useCallback((eng) => {
        if (eng === "account_join asc") return "가입일 오래된순";
        if (eng === "account_join desc") return "가입일 최신순";

        if (eng === "account_login asc") return "로그인 오래된순";
        if (eng === "account_login desc") return "최근 로그인순";

        if (eng === "account_point asc") return "포인트 낮은순";
        if (eng === "account_point desc") return "포인트 높은순";

        if (eng === "account_id asc") return "아이디 오름차순";
        if (eng === "account_id desc") return "아이디 내림차순";

        if (eng === "account_nickname asc") return "닉네임 오름차순";
        if (eng === "account_nickname desc") return "닉네임 내림차순";

        return "";
    }, []);

    const checkAllLevel = useCallback(e => {
        const isAll = condition.accountLevels.length === 6;

        setCondition({
            ...condition,
            accountLevels: isAll
                ? []
                : [
                    "브론즈",
                    "실버",
                    "골드",
                    "플래티넘",
                    "다이아",
                    "마스터"
                ]
        });
    }, [condition]);

    const checkAllBlock = useCallback(e => {
        const isAll = condition.accountBlocks.length === 2;

        setCondition({
            ...condition,
            accountBlocks: isAll
                ? []
                : [
                    "Y",
                    "N"
                ]
        });
    }, [condition]);

    //view
    return (<>
        <Jumbotron title="회원 복합 검색" />
        <Form onSubmit={send}>

            {/* 아이디 검색 */}
            <Row className="mt-4">
                <Form.Label column sm={3}>아이디</Form.Label>
                <Col sm={9}>
                    <Form.Control type="text" value={condition.accountId}
                        name="accountId" onChange={changeStringValue}
                        placeholder="정확히 일치해야 검색" />
                </Col>
            </Row>
            {/* 닉네임 검색 */}
            <Row className="mt-4">
                <Form.Label column sm={3}>닉네임</Form.Label>
                <Col sm={9}>
                    <Form.Control type="text" value={condition.accountNickname}
                        name="accountNickname" onChange={changeStringValue}
                        placeholder="정확히 일치해야 검색" />
                </Col>
            </Row>
            {/* 연락처 검색 */}
            <Row className="mt-4">
                <Form.Label column sm={3}>연락처</Form.Label>
                <Col sm={9}>
                    <Form.Control type="text" inputMode="tel" value={condition.accountContact}
                        name="accountContact" onChange={changeStringValue}
                        placeholder="정확히 일치해야 검색" />
                </Col>
            </Row>
            {/* 이메일 검색 */}
            <Row className="mt-4">
                <Form.Label column sm={3}>이메일</Form.Label>
                <Col sm={9}>
                    <Form.Control type="text" inputMode="email" value={condition.accountEmail}
                        name="accountEmail" onChange={changeStringValue}
                        placeholder="일부분만 일치해도 검색" />
                </Col>
            </Row>
            {/* 주소 검색 */}
            <Row className="mt-4">
                <Form.Label column sm={3}>주소</Form.Label>
                <Col sm={9}>
                    <Form.Control type="text" value={condition.accountAddress}
                        name="accountAddress" onChange={changeStringValue} />
                </Col>
            </Row>
            {/* 생년월일 검색 */}
            <Row className="mt-4">
                <Form.Label column sm={3}>생년월일</Form.Label>
                <Col sm={9}>
                    <div className="d-flex align-items-center">
                        <DatePicker name="accountBirthBegin"
                            selected={account.accountBirthBegin}
                            onChange={(date) => {
                                //date가 우리가 원하는 형식이 아님(내일 변경 후 설정)
                                //→ dayjs를 이용해서 "YYYY-MM-DD" 형태로 변경
                                const convertDate = dayjs(date).format("YYYY-MM-DD");
                                setAccount(prev => ({ ...prev, accountBirthBegin: convertDate }))
                            }}
                            dateFormat={"yyyy-MM-dd"}
                            customInput={<Form.Control />}
                            wrapperClassName={`w-100`}
                            className={result.accountBirth}

                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"

                            locale={ko}
                        />
                        <TbTilde className="mx-2" size={30} />
                        <DatePicker name="accountBirthEnd"
                            selected={account.accountBirthEnd}
                            onChange={(date) => {
                                //date가 우리가 원하는 형식이 아님(내일 변경 후 설정)
                                //→ dayjs를 이용해서 "YYYY-MM-DD" 형태로 변경
                                const convertDate = dayjs(date).format("YYYY-MM-DD");
                                setAccount(prev => ({ ...prev, accountBirthEnd: convertDate }))
                            }}
                            dateFormat={"yyyy-MM-dd"}
                            customInput={<Form.Control />}
                            wrapperClassName={`w-100`}
                            className={result.accountBirth}

                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"

                            locale={ko}
                        />
                    </div>
                </Col>
            </Row>
            {/* 가입일 검색 */}
            <Row className="mt-4">
                <Form.Label column sm={3}>가입일</Form.Label>
                <Col sm={9}>
                    <div className="d-flex align-items-center">
                        <DatePicker name="accountJoinBegin"
                            selected={account.accountJoinBegin}
                            onChange={(date) => {
                                //date가 우리가 원하는 형식이 아님(내일 변경 후 설정)
                                //→ dayjs를 이용해서 "YYYY-MM-DD" 형태로 변경
                                const convertDate = dayjs(date).format("YYYY-MM-DD");
                                setAccount(prev => ({ ...prev, accountJoinBegin: convertDate }))
                            }}
                            dateFormat={"yyyy-MM-dd"}
                            customInput={<Form.Control />}
                            wrapperClassName={`w-100`}
                            className={result.accountBirth}

                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"

                            locale={ko}
                        />
                        <TbTilde className="mx-2" size={30} />
                        <DatePicker name="accountJoinEnd"
                            selected={account.accountJoinEnd}
                            onChange={(date) => {
                                //date가 우리가 원하는 형식이 아님(내일 변경 후 설정)
                                //→ dayjs를 이용해서 "YYYY-MM-DD" 형태로 변경
                                const convertDate = dayjs(date).format("YYYY-MM-DD");
                                setAccount(prev => ({ ...prev, accountJoinEnd: convertDate }))
                            }}
                            dateFormat={"yyyy-MM-dd"}
                            customInput={<Form.Control />}
                            wrapperClassName={`w-100`}
                            className={result.accountBirth}

                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"

                            locale={ko}
                        />
                    </div>
                </Col>
            </Row>
            {/* 마지막 로그인 검색 */}
            <Row className="mt-4">
                <Form.Label column sm={3}>마지막 로그인</Form.Label>
                <Col sm={9}>
                    <div className="d-flex align-items-center">
                        <DatePicker name="accountLoginBegin"
                            selected={account.accountLoginBegin}
                            onChange={(date) => {
                                //date가 우리가 원하는 형식이 아님(내일 변경 후 설정)
                                //→ dayjs를 이용해서 "YYYY-MM-DD" 형태로 변경
                                const convertDate = dayjs(date).format("YYYY-MM-DD");
                                setAccount(prev => ({ ...prev, accountLoginBegin: convertDate }))
                            }}
                            dateFormat={"yyyy-MM-dd"}
                            customInput={<Form.Control />}
                            wrapperClassName={`w-100`}
                            className={result.accountBirth}

                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"

                            locale={ko}
                        />
                        <TbTilde className="mx-2" size={30} />
                        <DatePicker name="accountLoginEnd"
                            selected={account.accountLoginEnd}
                            onChange={(date) => {
                                //date가 우리가 원하는 형식이 아님(내일 변경 후 설정)
                                //→ dayjs를 이용해서 "YYYY-MM-DD" 형태로 변경
                                const convertDate = dayjs(date).format("YYYY-MM-DD");
                                setAccount(prev => ({ ...prev, accountLoginEnd: convertDate }))
                            }}
                            dateFormat={"yyyy-MM-dd"}
                            customInput={<Form.Control />}
                            wrapperClassName={`w-100`}
                            className={result.accountBirth}

                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"

                            locale={ko}
                        />
                    </div>
                </Col>
            </Row>
            {/* 포인트 검색 */}
            <Row className="mt-4">
                <Form.Label column sm={3}>포인트</Form.Label>
                <Col sm={9}>
                    <div className="d-flex align-items-center">
                        <Form.Control type="text" inputMode="numeric" name="accountPointMin"
                            value={condition.accountPointMin}
                            onChange={changeNumericValue} 
                            placeholder="최소 포인트"/>
                        <TbTilde className="mx-2" size={30} />
                        <Form.Control type="text" inputMode="numeric" name="accountPointMax"
                            value={condition.accountPointMax}
                            onChange={changeNumericValue}
                            placeholder="최대 포인트"/>
                    </div>
                </Col>
            </Row>
            {/* 등급 검색 */}
            <Row className="mt-4">
                <Form.Label column sm={3}>등급</Form.Label>
                <Col sm={9}>
                    <Form.Check type="checkbox" label="전체 선택"
                        onChange={checkAllLevel}
                        checked={condition.accountLevels.length === 6} />
                    <hr />
                    <Form.Check type="checkbox" value={"브론즈"} label="브론즈" onChange={checkAccountLevel} checked={condition.accountLevels.includes("브론즈")} />
                    <Form.Check type="checkbox" value={"실버"} label="골드" onChange={checkAccountLevel} checked={condition.accountLevels.includes("실버")} />
                    <Form.Check type="checkbox" value={"골드"} label="골드" onChange={checkAccountLevel} checked={condition.accountLevels.includes("골드")} />
                    <Form.Check type="checkbox" value={"플래티넘"} label="플래티넘" onChange={checkAccountLevel} checked={condition.accountLevels.includes("플래티넘")} />
                    <Form.Check type="checkbox" value={"다이아"} label="다이아" onChange={checkAccountLevel} checked={condition.accountLevels.includes("다이아")} />
                    <Form.Check type="checkbox" value={"마스터"} label="마스터" onChange={checkAccountLevel} checked={condition.accountLevels.includes("마스터")} />
                </Col>
            </Row>
            {/* 차단여부 검색 */}
            <Row className="mt-4">
                <Form.Label column sm={3}>차단여부</Form.Label>
                <Col sm={9}>
                    <Form.Check type="checkbox" label="전체 선택"
                        onChange={checkAllBlock}
                        checked={condition.accountBlocks.length === 2} />
                    <hr />
                    <Form.Check type="radio" value={"Y"} label="Y" onChange={checkAccountBlocks} checked={condition.accountBlocks.includes("Y")} />
                    <Form.Check type="radio" value={"N"} label="N" onChange={checkAccountBlocks} checked={condition.accountBlocks.includes("N")} />
                </Col>
            </Row>

            <Row className="mt-4">
                <Form.Label column sm={3}>검색 개수</Form.Label>
                <Col sm={9}>
                    <Form.Select name="size" value={condition.size} onChange={changeNumericValue}>
                        <option value={""}>한번에 보기</option>
                        <option value={10}>10개씩 보기</option>
                        <option value={20}>20개씩 보기</option>
                        <option value={50}>50개씩 보기</option>
                        <option value={100}>100개씩 보기</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row className="mt-4">
                <Form.Label column sm={3} className="d-inline-flex align-items-center">
                    <span>정렬 방식</span>
                    {availableOrderList.length > 0 && (
                        <FaPlus className="ms-2 text-info" onClick={addOrder} />
                    )}
                </Form.Label>
                <Col sm={9}>
                    {condition.orders.length === 0 ? (
                        <span>기본값(번호순)</span>
                    ) : (<>
                        {/* condition.orders의 내용을 반복적으로 출력 */}
                        {condition.orders.map((order, index) => (
                            <div key={index} className="mb-2 d-flex align-items-center">

                                <Form.Select
                                    value={order.value}
                                    className="w-auto"
                                    onChange={e => changeOrder(e, index)}
                                >
                                    {orderList.map((opt, idx) => (
                                        <option key={idx} value={opt.value}>
                                            {opt.name}
                                        </option>
                                    ))}
                                </Form.Select>

                                <FaTrash
                                    className="ms-2 text-danger"
                                    size={20}
                                    onClick={() => deleteOrder(index)}
                                />
                            </div>
                        ))}
                    </>)}
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Button type="reset" variant="danger" size="lg" className="w-md-auto">
                        <FaEraser className="me-2" />
                        <span>초기화</span>
                    </Button>

                    <Button type="submit" variant="success" size="lg" className="w-md-auto">
                        <FaMagnifyingGlass className="me-2" />
                        <span>검색하기</span>
                    </Button>
                </Col>
            </Row>

            {/* 검색 결과 표시 */}
            <hr />
            <Row className="mt-5">
                <Col>
                    <Table responsive striped hover className="text-nowrap">
                        <thead>
                            <tr>
                                <th>아이디</th>
                                <th>닉네임</th>
                                <th>이메일</th>
                                <th>등급</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map(account => (
                                <tr key={account.accountId}>
                                    <td>{account.accountId}</td>
                                    <td>{account.accountNickname}</td>
                                    <td>{account.accountEmail}</td>
                                    <td>{account.accountLevels}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* 더보기 버튼 */}
            {last === false && (
                <Row className="mt-2">
                    <Col>
                        <Button variant="outline-success" size="lg"
                            onClick={loadMoreList} className="w-100">
                            <FaChevronDown />
                            <span className="mx-2">더보기</span>
                            <FaChevronDown />
                        </Button>
                    </Col>
                </Row>
            )}
        </Form>
    </>)
}