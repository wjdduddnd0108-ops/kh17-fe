import { useCallback } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FaCalendar, FaHouse, FaPenToSquare } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../utils/reaxios";
import { useAtomValue } from "jotai";
import { loginUserState } from "../../utils/storage";

export default function AccountNeedUpdate() {
    const loginUser = useAtomValue(loginUserState);

    const navigate = useNavigate();

    const remindMeLater = useCallback(async()=>{
        const { data } = await apiClient.patch(`/account/remindMeLater/${loginUser.accountId}`);
        navigate("/");
    }, [])
    return (<>
        <Row className="mt-2">
            <Col>
                <h1>비밀번호를 변경하신지 30일이 지났습니다</h1>
            </Col>
        </Row>

        <Row className="mt-5">
            <Col>
                <Button className="w-100" variant="success"
                    as={Link} to={`/account/password`} size="lg">
                    <FaPenToSquare />
                    <span>  비밀번호 변경하러가기</span>
                </Button>

                <Button className="w-100 mt-2" variant="secondary" size="lg"
                    as={Link} to={"/"}>
                    <FaHouse />
                    <span>  다음에 변경하기</span>
                </Button>

                <Button className="w-100 mt-2 text-secondary" variant="link" size="md"
                    onClick={remindMeLater}>
                    <FaCalendar />
                    <span>  30일 뒤에 알리기</span>
                </Button>
            </Col>
        </Row>

    </>)
}