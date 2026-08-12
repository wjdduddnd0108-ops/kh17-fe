import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "@utils/reaxios";
import Swal from "sweetalert2";
import { Col, Form, Row } from "react-bootstrap";

export default function WebSocketV4RoomClient() {
    //방번호 읽기
    const { roomNo } = useParams();
    const navigate = useNavigate();

    //방정보 불러오기
    const [room, setRoom] = useState(null);
    const loadRoom = useCallback(async () => {
        try {
            const { data } = await apiClient.get(`/room/${roomNo}`);
            setRoom(data.room);
        }
        catch (e) {
            if (e.response?.status === 403) {
                await Swal.fire("당신은 방 참여자가 아닙니다");
                navigate("/websocket/v4");//목록으로 이동
            }
            else if (e.response?.status === 404) {
                await Swal.fire("존재하지 않는 방입니다");
                navigate("/websocket/v4");//목록으로 이동
            }
            else {
                await Swal.fire("일시적인 서버 오류입니다.\n잠시 후 실행해주세요.");
                navigate("/websocket/v4");//목록으로 이동
            }
        }
    }, []);
    useEffect(() => {
        loadRoom();
    }, []);

    if(room === null) {
        return (<h1>로딩중...</h1>);
    }

    return (<>
        <Jumbotron title="그룹 채팅 예제" content={`현재 입장하신 방은 ${roomNo}번방 입니다`} />

        {/* 방 정보 출력 */}
        <Row className="mt-5">
            <Col sm={3} className="text-info fw-bold">방 제목</Col>
            <Col sm={9}>{room.roomName}</Col>
        </Row>
        <Row className="mt-5">
            <Col sm={3} className="text-info fw-bold">방장</Col>
            <Col sm={9}>{room.roomOwner ?? "없음"}</Col>
        </Row>
        <Row className="mt-5">
            <Col sm={3} className="text-info fw-bold">인원</Col>
            <Col sm={9}>? /{room.roomLimit ?? "제한 없음"}</Col>
        </Row>
    </>)
}