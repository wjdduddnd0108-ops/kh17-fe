import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { loginUserState } from"@utils/storage";
import { useCallback, useMemo } from "react";
import { RESET } from "jotai/utils";
import { isLoginState, isAdminState } from "@utils/storage";
import { logoutActionState } from "@utils/storage";
import axios from "axios";
import { loginActionState } from "@utils/storage";
import { authClient } from "@utils/reaxios";
import { FaCartShopping } from "react-icons/fa6";

export default function Menu() {
    //메뉴에서는 로그인 상태 데이터가 필요하다
    const [loginUser, setLoginUser] = useAtom(loginUserState);

    //읽기전용 atom을 불러오는법
    // const [isLogin] = useAtom(isLoginState);
    const isLogin = useAtomValue( isLoginState);
    const isAdmin = useAtomValue(isAdminState);

    const loginAction = useSetAtom(loginActionState);
    const logoutAction = useSetAtom(logoutActionState);

    //서버에 로그아웃 요청 및 Jotai 저장소 초기화 요청을 수행하는 함수
    const logout = useCallback(async ()=>{
        try {
            // await axios.delete("/service/auth/logout");//쿠기 삭제 요청
            await authClient.delete("/logout");
        }
        catch(e){
            console.error(e);
        }
        finally{
            logoutAction();//에러여부와 관계없이 화면상의 데이터는 삭제
        }
    },[]);

    //토큰 갱신 요청을 보내는 연습용 함수
    const refresh = useCallback(async ()=>{
        try{
            // const {data} = await axios.post("/service/auth/refresh");
            const {data} = await authClient.post("/refresh");
            //갱신이 된 경우(200 ok)
            loginAction(data);
        }
        catch(e){
            //갱신이 안된 경우(401 unauthorized)
            logoutAction();
        }
    }, []);
    return (<>
        <Navbar expand="md" className="bg-body-tertiary sticky-top"
                    bg="dark" data-bs-theme="dark">
            {/* 메뉴 메인 컨테이너 */}
            <Container fluid>
                {/* 메인 브랜드 로고 */}
                <Navbar.Brand as={Link} to="/">KH정보교육원</Navbar.Brand>
                {/* 접이식 버튼(좁은 화면에서만 보임) */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                {/* 접이식 영역(좁은 화면에서만 보임) */}
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* 
                        <Nav.Link as={Link} to="/country/list">국가정보</Nav.Link>
                        <Nav.Link as={Link} to="/country/search">국가명검색</Nav.Link>
                        <Nav.Link as={Link} to="/practice1/list">강좌정보</Nav.Link>
                        <Nav.Link as={Link} to="/book/list">도서정보</Nav.Link>
                        <Nav.Link as={Link} to="/book/spa">도서정보2</Nav.Link>
                        */}
                
                        <NavDropdown title="데이터베이스" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/country/list">국가정보</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/country/search">국가명검색</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/country/complex">국가복합검색</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/practice1/list">강좌정보</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/book/list">도서정보</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/book/spa">도서정보2</NavDropdown.Item>
                            
                        </NavDropdown>
                        <NavDropdown title="카카오페이" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/pay/v1/buy">무식한 결제</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/pay/v1/buy/success">결제완료(v1)</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/pay/v2/buy/success">결제</NavDropdown.Item>
                        </NavDropdown>
                        {/* <Nav.Link as={Link} to="/session/test">세션테스트</Nav.Link> */}
                        <Nav.Link as={Link} to="/sale/list">상품 목록</Nav.Link>
                        
                    </Nav>
                    <Nav>
                        {isLogin === true && (<>
                        { isAdmin === true && (<>
                        <NavDropdown title="관리메뉴" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/admin/users">회원관리</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/admin/users2">회원관리2</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item as={Link} to="/admin/saleAdd">상품등록</NavDropdown.Item>
                        </NavDropdown>
                        </>)}
                        { isAdmin === false && (<>
                        <Nav.Link as={Link} to="/account/cart">
                            <FaCartShopping/>
                            <span className="ms-2">장바구니</span>
                        </Nav.Link>
                        <Nav.Link as={Link} to="/account/mypage">내정보</Nav.Link>
                        </>)}
                        <Nav.Link onClick={logout}>로그아웃</Nav.Link>
                        </>)}
                        {isLogin !== true && (<>
                        <Nav.Link as={Link} to="/account/join">회원가입</Nav.Link>
                        <Nav.Link as={Link} to="/account/login">로그인</Nav.Link>
                        </>) }

                        {/* 연습용 Refresh 버튼 (향후 삭제가 필요) */}
                        <Nav.Link onClick={refresh}>갱신(Refresh)</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>)
}