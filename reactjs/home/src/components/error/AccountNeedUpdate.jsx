import { Button, Col, Row } from "react-bootstrap";
import { FaHouse, FaPenToSquare } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function AccountNeedUpdate() {

    return (<>
        <Row className="mt-2">
            <Col>
                <h1>비밀번호를 변경하신지 30일이 지났습니다</h1>
            </Col>
        </Row>

        <Row className="mt-5">
            <Col>
                <Button className="w-100" variant="secondary"
                    as={Link} to="/">
                    <FaHouse />
                    <span>  다음에 변경하기</span>
                </Button>
            </Col>
        </Row>

        <Row className="mt-2">
            <Col>
                <Button className="w-100" variant="warning"
                    as={Link} to={`/account/password`}>
                    <FaPenToSquare />
                    <span>  비밀번호 변경하러가기</span>
                </Button>
            </Col>
        </Row>


    </>)
}