import Jumbotron from "@templates/Jumbotron"
import { useCallback } from "react";
import { useState } from "react"
import { Button, Col, Form, Row, Table } from "react-bootstrap"
import { FaMagnifyingGlass, FaPlus, FaTrash, FaChevronDown } from "react-icons/fa6"
import { TbTilde } from "react-icons/tb";
import axios from "axios";
import { useMemo } from "react";
import { toast } from "react-toastify";

export default function CountryComplexSearch() {
    //state
    const [condition, setCondition] = useState({
        countryRegions: [],
        countryName: "",
        countryCapital: "",
        minCountryPopulation: "",
        maxCountryPopulation: "",
        size: 10,
        orders: [
            // "country_population desc",
            // "country_name asc",
        ]
    });
    const [countryList, setCountryList] = useState([]);
    const [last, setLast] = useState(true);

    //callback
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
        setCondition(prev => ({
            ...prev,
            [name]: replacement
        }));
    }, []);
    
    const send = useCallback(async () => {
        const response = await axios.post("/api/country/complexSearch", condition);
        //console.log(response.data);
        setCountryList(response.data.list);
        setLast(response.data.last);
    }, [condition]);

    const lastCountryNo = useMemo(() => {
        if (countryList.length === 0) return null;
        return countryList[countryList.length - 1].countryNo;
    }, [countryList]);
    const loadMoreList = useCallback(async () => {
        const response = await axios.post(
            "/api/country/complexSearch",
            //condition의 모든내용 + lastCountryNo 추가하여 전송
            { ...condition, lastCountryNo: lastCountryNo }
        );
        setCountryList(prev => [...prev, ...response.data.list]);//이어쓰기
        setLast(response.data.last);
    }, [lastCountryNo, condition]);

    const checkCountryRegion = useCallback(e => {
        //console.log(e.target.checked, e.target.value);
        //true면 추가, false면 제거
        const { checked, value } = e.target;

        const clone = [...condition.countryRegions];
        const clone2 = checked ? [...clone, value] : clone.filter(region => region !== value);

        setCondition({ ...condition, countryRegions: clone2 });
    }, [condition]);

    //state는 변경이 가능하므로 변경 불가능한건 memo로 생성할 수도 있다
    //const [orderList, setOrderList] = useState(["..."]);
    const orderList = useMemo(() => {
        return [
            "country_name asc",
            "country_name desc",
            "country_population desc",
            "country_population asc",
            "country_capital asc",
            "country_capital desc"
        ];
    }, []);

    //선택 가능한 목록 : orderList의 항목 중에 condition.orders에 없는 요소들만 검색하여 반환
    const availableOrderList = useMemo(() => {
        //기존 : 같은 요소만 제거
        // return orderList.filter(order=>!condition.orders.includes(order));

        //변경 : 접두사(항목)이 같은 경우를 제거
        return orderList.filter(order => {
            const prefix = order.split(" ")[0];//order의 접두사(항목)만 잘라내서
            return condition.orders.findIndex(ord => {
                const prefix2 = ord.split(" ")[0];//ord의 접두사(항목)만 잘라내서
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
        const curr = clone[index];//현재 적용중인 값

        //같으면 중지
        if (dest === curr) return;

        //(+추가) 같은 항목을 오름차순/내림차순 동시 추가하는것을 차단
        //→ 현재 위치(index)가 아닌 곳에 dest와 항목만 같고 정렬방식이 다른 값이 존재하는지를 확인
        //→ 만약 [2]에 country_population desc를 선택했는데 [0]에 country_population asc가 있으면 안됨
        const destParts = dest.split(" ");
        const duplicateIndex = clone.findIndex((order, idx) => {
            if (idx === index) return false;//같은 위치는 제외
            const orderParts = order.split(" ");
            if (destParts[0] === orderParts[0] && destParts[1] !== orderParts[1]) return true;
            return false;
        });
        if (duplicateIndex >= 0) {//항목은 같은데 정렬방식이 다른 요소가 이미 만들어져 있다면
            toast.error("동일한 항목이 다른 정렬 방식으로 이미 존재합니다");
            return;
        }

        //예상 시나리오
        //1. 바꿀값(dest)이 선택항목(clone)에 없으면 해당 위치만 변경하면 됨
        if (!clone.includes(dest)) {
            const clone2 = clone.map((order, idx) => {
                if (idx === index) {
                    return dest;//변경
                }
                return order;//유지
            });
            setCondition({ ...condition, orders: clone2 });
        }
        //2. 바꿀값(dest)이 선택항목(clone)에 있으면 해당 위치와 현재 위치의 값을 바꿈
        else {
            const destIndex = clone.indexOf(dest);//dest의 위치를 찾는다
            //현재 위치 index이므로 destIndex와 교체
            [clone[index], clone[destIndex]] = [clone[destIndex], clone[index]];
            //바뀐 결과를 condition.orders에 설정
            setCondition({ ...condition, orders: clone });
        }

    }, [condition]);

    const changeToKorean = useCallback((eng) => {
        if (eng === "country_name asc") return "국가명 오름차순";
        if (eng === "country_name desc") return "국가명 내림차순";
        if (eng === "country_capital asc") return "수도명 오름차순";
        if (eng === "country_capital desc") return "수도명 내림차순";
        if (eng === "country_population asc") return "인구 적은순";
        if (eng === "country_population desc") return "인구 많은순";
    }, []);

    const checkAll = useCallback(e => {
        const isAll = condition.countryRegions.length === 6;
        if (isAll) {//전체 선택중인 상태
            setCondition({ ...condition, countryRegions: [] });
        }
        else {//전체 선택중이 아닌 상태
            setCondition({
                ...condition, countryRegions: [
                    "아시아", "아프리카", "북아메리카", "남아메리카", "유럽", "오세아니아"
                ]
            });//채워!
        }
    }, [condition]);


    //view
    return (<>
        <Jumbotron title="국가 복합 검색 예제" content="조건이 있을지 없을지 모르는 형태를 처리해봅시다" />

        {/* 검색 화면 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>대륙</Form.Label>
            <Col sm={9}>
                <Form.Check type="checkbox" label="전체 선택"
                    onChange={checkAll}
                    checked={condition.countryRegions.length === 6} />
                <hr />
                <Form.Check type="checkbox" value={"아시아"} label="아시아" onChange={checkCountryRegion} checked={condition.countryRegions.includes("아시아")} />
                <Form.Check type="checkbox" value={"아프리카"} label="아프리카" onChange={checkCountryRegion} checked={condition.countryRegions.includes("아프리카")} />
                <Form.Check type="checkbox" value={"북아메리카"} label="북아메리카" onChange={checkCountryRegion} checked={condition.countryRegions.includes("북아메리카")} />
                <Form.Check type="checkbox" value={"남아메리카"} label="남아메리카" onChange={checkCountryRegion} checked={condition.countryRegions.includes("남아메리카")} />
                <Form.Check type="checkbox" value={"오세아니아"} label="오세아니아" onChange={checkCountryRegion} checked={condition.countryRegions.includes("오세아니아")} />
                <Form.Check type="checkbox" value={"유럽"} label="유럽" onChange={checkCountryRegion} checked={condition.countryRegions.includes("유럽")} />
            </Col>
        </Row>
        <Row className="mt-4">
            <Form.Label column sm={3}>국가명</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" value={condition.countryName}
                    name="countryName" onChange={changeStringValue} />
            </Col>
        </Row>
        <Row className="mt-4">
            <Form.Label column sm={3}>수도명</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" value={condition.countryCapital}
                    name="countryCapital" onChange={changeStringValue} />
            </Col>
        </Row>
        <Row className="mt-4">
            <Form.Label column sm={3}>인구수</Form.Label>
            <Col sm={9}>
                <div className="d-flex align-items-center">
                    <Form.Control type="text" name="minCountryPopulation"
                        value={condition.minCountryPopulation}
                        onChange={changeNumericValue} />
                    <TbTilde className="mx-2" size={30} />
                    <Form.Control type="text" name="maxCountryPopulation"
                        value={condition.maxCountryPopulation}
                        onChange={changeNumericValue} />
                </div>
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
                            <Form.Select value={order} className="w-auto"
                                onChange={e => changeOrder(e, index)}>
                                {orderList.map((opt, idx) => (
                                    <option key={idx} value={opt}>{changeToKorean(opt)}</option>
                                ))}
                            </Form.Select>

                            <FaTrash className="ms-2 text-danger" size={20}
                                onClick={e => deleteOrder(index)} />
                        </div>
                    ))}
                </>)}
            </Col>
        </Row>

        <Row className="mt-4">
            <Col>
                <Button variant="success" size="lg" className="w-100"
                    onClick={send}>
                    <FaMagnifyingGlass className="me-2" />
                    <span>검색하기</span>
                </Button>
            </Col>
        </Row>

        {/* 검색 결과 표시 */}
        <hr />
        <Row className="mt-4">
            <Col>
                <Table responsive striped hover className="text-nowrap">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>국가</th>
                            <th>대륙</th>
                            <th>수도</th>
                            <th className="text-end">인구</th>
                        </tr>
                    </thead>
                    <tbody>
                        {countryList.map(country => (
                            <tr key={country.countryNo}>
                                <td>{country.countryNo}</td>
                                <td>{country.countryName}</td>
                                <td>{country.countryRegion}</td>
                                <td>{country.countryCapital}</td>
                                <td className="text-end">{country.countryPopulation.toLocaleString()}</td>
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
    </>)
}