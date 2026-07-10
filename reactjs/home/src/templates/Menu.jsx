import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function Menu() {
    return (<>
        <Navbar expand="lg" className="bg-body-tertiary sticky-top"
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
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/practice1/list">강좌정보</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/book/list">도서정보</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/book/spa">도서정보2</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link as={Link} to="/member/join">회원가입</Nav.Link>
                        <Nav.Link as={Link} to="/member/login">로그인</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>)
}