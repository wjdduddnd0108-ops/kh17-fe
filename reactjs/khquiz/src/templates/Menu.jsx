import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


export default function Menu() {

    return(<>
    <Navbar expand="md" className="bg-body-tertiary sticky-top"
                    bg="dark" data-bs-theme="dark">
        <Container fluid>
            <Navbar.Brand as={Link} to="/">KH정보교육원</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/anonymous">
                        익명 게시판
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>                
    </Navbar>
    </>)
}