import Jumbotron from "@templates/Jumbotron";
import { apiClient } from "@utils/reaxios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Form, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import NoImage from "@assets/images/no-image.png";
import { FaArrowTrendDown, FaCartShopping, FaXmark } from "react-icons/fa6";
import { BsCashCoin } from "react-icons/bs"
import { debounce } from "lodash-es";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function AccountCart() {

    //시작하자마자 요청을 보내 받아온 장바구니 목록을 표시
    const [cartList, setCartList] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(async () => {
        const { data } = await apiClient.get("/cart/");
        //console.log(data.cartItems);
        // setCartList(data.cartItems);//체크 미설정
        setCartList(data.cartItems.map(//체크 설정
            item => ({ ...item, choice: true })
        ));
    }, []);

    //할인율 계산 함수
    const calculateDiscountRate = useCallback((item) => {
        if (item.origin <= item.discount) return 0;
        if (item.discount === 0) return 100;
        const discount = item.origin - item.discount;
        const rate = discount * 100 / item.origin;
        return rate.toFixed(0);//소수점 2자리
    }, []);

    // 수량 변경 함수 (수량이 변경되면 서버에 바로 반영할것인지 결정)
    // - 수량이 변경되면 함수를 호출하여 서버로 전달하도록 요청
    const changeItemQty = useCallback((e, target) => {
        const { value } = e.target;
        const replacement = value.replace(/[^0-9]+/g, "");
        const number = parseInt(replacement) || 1;

        sendChangeQty(target, number);

        setCartList(
            prev => prev.map(
                item => {
                    if (item.no === target.no) {//찾는 상품이면
                        //number가 qty에 적용된 객체 반환
                        return { ...item, qty: number };
                    }
                    return { ...item };//나머지는 그대로 반환
                }
            )
        );
    }, []);

    const sendChangeQty = useCallback(
        debounce(//성능 저하를 위한 debounce를 500ms로 적용
            async (item, qty) => {
                const { data } = await apiClient.patch(
                    "/cart/", { no: item.no, qty: qty }
                );
                console.log("data", data);
            }, 500)
        , []);

    //항목 체크
    const changeItemSelected = useCallback((e, target) => {
        const { checked } = e.target;

        setCartList(
            prev => prev.map(
                item => {
                    if (item.no === target.no) {//찾는 상품이면
                        return { ...item, choice: checked };
                    }
                    return { ...item };//나머지는 그대로 반환
                }
            )
        );
    }, []);

    //전체 선택 관련
    const checkedAll = useMemo(() => {
        // let all = true;
        // for(let i=0; i < cartList.length; i++) {
        //     all = all && cartList[i].choice;
        // }
        // return all;

        //return cartList.reduce(계산함수, 초기값);
        return cartList.reduce((acc, cur) => acc && cur.choice === true, true);
    }, [cartList]);

    const toggleAll = useCallback(e => {
        const { checked } = e.target;
        setCartList(prev => prev.map(
            item => ({ ...item, choice: checked })
        ))
    }, []);

    //[1] 체크된 상품의 총 계산금액을 구하여 하단에 출력
    const totalAmount = useMemo(() => {
        //return cartList.reduce(계산함수, 초기값);
        return cartList.reduce((acc, cur) => {
            if (cur.choice === true) {//체크되어 있다면
                return acc + cur.discount * cur.qty;//할인가를 합산
            }
            return acc;//아니면 그대로 반환
        }, 0);
    }, [cartList]);

    //[2] 체크된 상품의 할인전/후 금액을 각각 구하여 하단에 출력 (=gmarket)
    const totalAmountObject = useMemo(() => {
        return cartList.reduce(
            (acc, cur) => {//acc가 객체 (origin, discount라는 필드가 존재)
                if (cur.choice === true) {//체크되어 있다면
                    return {
                        origin: acc.origin + cur.origin * cur.qty,
                        discount: acc.discount + cur.discount * cur.qty
                    }
                }
                return acc;//아니면 그대로 반환
            },
            { origin: 0, discount: 0 }//초기값이 객체
        )
    }, [cartList]);

    //구매 확인 페이지로 이동
    //- 주소 생성이 필요 : `?sale=번호:수량&sale=번호:수량' 형태
    const navigate = useNavigate();
    const purchase = useCallback(() => {
        //파라미터 생성 도구 만들기
        const params = new URLSearchParams();

        cartList.forEach(item => {
            if (item.choice === true) {
                const value = `${item.no}:${item.qty}`;
                // params.set("sale", value);
                params.append("sale", value);
            }
        });
        //파라미터를 추가해서 구매페이지로 이동
        navigate(`/pay/v2/buy?${params.toString()}`);
    }, [cartList])

    // 장바구니 상품삭제
    const deleteCart = useCallback(async (item) => {
        try {
            const result = await Swal.fire({
                title: "장바구니에 담긴 상품을 삭제하시겠습니까?",
                icon: "warning",
                confirmButtonText: "확인",
                cancelButtonText: "취소",
                showCancelButton: true,
                confirmButtonColor: "#d63031",
                cancelButtonColor: "#b2bec3"
            });
            if (result.isConfirmed === false) return;//취소
            //삭제요청
            await apiClient.delete(`/cart/${item.no}`);
            setCartList(prev => prev.filter(
                cartItem => cartItem.no !== item.no
            ));
            toast.success("장바구니에서 상품이 제거되었습니다");
        }
        catch (e) {
            //오류 처리
            toast.error("일시적인 오류가 발생했습니다\n잠시 후 다시 시도하세요")
            console.error(e);
        }

    }, [])

    return (<>
        <Jumbotron title="장바구니" content="상품 수량을 확인하고 구매를 진행해주세요" />

        {/* 구매할 상품의 정보와 수량을 출력 */}
        <Row className="mt-5">
            <Col>
                <div className="mb-2">
                    <Form.Check type="checkbox" label="전체 선택"
                        checked={checkedAll}
                        onChange={toggleAll} />
                </div>
                <ListGroup>
                    {cartList.map(item => (
                        <ListGroupItem key={item.no}>
                            <div className="d-flex align-items-center">
                                <Form.Check type="checkbox" className="me-2"
                                    checked={item.choice === true}
                                    onChange={e => changeItemSelected(e, item)} />

                                <img src={
                                    item.thumbnail ?
                                        `${import.meta.env.VITE_SERVER_URL}/api/attach/${item.thumbnail}`
                                        : NoImage
                                } width={100} />

                                <div className="ms-4 flex-grow-1">
                                    <h4 className="fw-bold text-info">
                                        {item.name}
                                    </h4>
                                    <div className="text-start">
                                        {item.origin > item.discount ? (<>
                                            <s className="text-muted">
                                                {item.origin.toLocaleString()} 원
                                            </s>
                                            <br />
                                            <b className="text-danger">
                                                {item.discount.toLocaleString()} 원
                                            </b>
                                            <br />
                                            <span className="text-success">
                                                <FaArrowTrendDown style={{ transform: "rotate(55deg)" }} />
                                                {calculateDiscountRate(item)}%
                                            </span>
                                        </>) : (<>
                                            <b>{item.origin.toLocaleString()} 원</b>
                                        </>)}
                                    </div>
                                    <div className="text-end">
                                        <span>수량 : </span>
                                        <Form.Control type="number" inputMode="numeric"
                                            value={item.qty} min={1}
                                            onChange={e => changeItemQty(e, item)}
                                            className="d-inline-block mx-2"
                                            style={{ width: 75 }}
                                        />
                                        <span>개</span>
                                    </div>
                                </div>

                                {/* 삭제버튼 */}
                                <FaXmark className="mx-2" onClick={e => deleteCart(item)} />
                            </div>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </Col>
        </Row>

        {/* 
        <Row className="mt-5">
            <Col className="text-end fs-2 fw-bold text-info">
                총 {totalAmount.toLocaleString()}원
            </Col>
        </Row> 
        */}

        <Row className="mt-5 text-end fs-3">
            <Col>
                <div className="d-flex justify-content-between">
                    <span>판매금액</span>
                    <span>{totalAmountObject.origin.toLocaleString()}원</span>
                </div>
                <div className="d-flex justify-content-between">
                    <span>할인금액</span>
                    <span>
                        {(totalAmountObject.origin - totalAmountObject.discount)
                            .toLocaleString()}원
                    </span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                    <span>결제금액</span>
                    <span>{totalAmountObject.discount.toLocaleString()}원</span>
                </div>
            </Col>
        </Row>

        <Row className="mt-5">
            <Col>
                <Button variant="success" size="lg" className="w-100" onClick={purchase}>
                    <BsCashCoin />
                    <span className="ms-2">구매하기</span>
                </Button>
            </Col>
        </Row>
    </>)
}