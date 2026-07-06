import { Route, Routes } from "react-router-dom"
import './App.css'
import Header from "./templates/Header"
import Body from "./templates/Body"
import Footer from "./templates/Footer"
import Menu from "./templates/Menu"
import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function App() {

  return (
    <Container fluid>
      {/* 헤더 */}
      <Row className="d-none d-md-block my-4">
        <Col className="py-2">
          <Header/>
        </Col>
      </Row>

      {/* 메뉴 */}
      <Menu/>

      {/* 본문 */}
      <Row className="mt-4" style={ { minHeight: 450} }>
        <Col>
          <Body/>
        </Col>
      </Row>
      {/* 푸터 */}
      <hr/>
      <Row className="mt-4">
        <Col>
          <Footer/>
        </Col>
      </Row>
    </Container>
  )
}
