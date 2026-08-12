import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@utils/reaxios";
import { Badge, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useAtomValue } from "jotai";
import { loginUserState, isLoginState} from "@utils/storage";
import { useNavigate } from "react-router-dom";

export default function WebSocketV4RoomList() {

    //채팅방 목록
    const loginUser = useAtomValue(loginUserState);
    const isLogin = useAtomValue(isLoginState);
    const [rooms, setRooms] = useState([]);//채팅방 목록

    useEffect(() => {
        loadRooms();//시작하자마자 방 목록을 불러온다
    }, []);

    const loadRooms = useCallback(async () => {
        const { data } = await apiClient.get("/room/")
        setRooms(data);
    }, []);
    const [show, setShow] = useState(false);
    const handleClose = useCallback(() => {
        setInput({name : "", limit : ""});
        setShow(false)
    }, []);
    const handleShow =  useCallback(() => setShow(true), []);

    //등록 관련
    const [input, setInput] =useState({ name : "" , limit : ""});
    const changeName = useCallback(e=>{
        setInput(prev=>({
            name : e.target.value,
            limit : prev.limit
        }))
    },[]);
    const changeLimit = useCallback(e=>{
        const replace = e.target.value.replace(/[^0-9]+/g, "");
        setInput(prev=>({
            name : prev.name,
            limit : parseInt(replace) || ""
        }));
    }, []);

    const createRoom = useCallback(async()=>{
        if(isLogin === false) return;
        //input이 원치 않는 값이면 차단
        if(input.name.trim() === "") return;

        try{
            //순서가 중요하면 await
            const { data } = await apiClient.post("/room/", input);
            toast.success("채팅방이 생성되었습니다");
            loadRooms();
            handleClose();
        }
        catch(e){
            toast.error("채팅방 생성에 실패했습니다");
        }
    },[input, isLogin]);

    const deleteRoom = useCallback(async(target)=>{
        try{
            const { data } = await apiClient.delete(`/room/${target.roomNo}`);
            // loadRooms();
            setRooms(prev=>prev.filter(
                room=>room.roomNo !== target.roomNo
            ));//직접제거
        }
        catch(e){
            toast.error("방 삭제에 실패했습니다");
        }
    })

    // 방 참여 신청 후 이동
    const navigate = useNavigate();
    const joinRoom = useCallback(async (target)=>{
        //방 신청 요청

        //방 페이지로 이동
        Navigate(`/websocket/v4/${target.roomNo}`);
    }, []);

    return (<>
        <Jumbotron title="채팅방 목록" content="그룹 채팅 예제" />

        {/* 방 목록 출력 */}
        <Row className="mt-5">
            <Col xs={8}>
                <h4>현재 개설된 채팅방은 총 {rooms.length}개 입니다</h4>
            </Col>
            <Col xs={4} className="text-end">
               {isLogin &&(
                <Button variant="success" onClick={handleShow}>
                    <FaPlus />
                    <span className="ms-2">방 만들기</span>
                </Button>
               )}
            </Col>
            {rooms.map(room => (
                <Col key={room.roomNo} xs={12} sm={6} md={4}>
                    {/* outer */}
                    <div className="p-2">
                        {/* inner */}
                        <div className={`shadow p-4 
                        ${(isLogin && loginUser.accountId === room.roomOwner) 
                            ? "border border-info" : ""}
                        `}>
                            <h4>
                                <Badge className="me-2">{room.roomNo}</Badge>
                                {room.roomName}
                            </h4>
                            <div>방장 : {room.roomOwner ?? "없음"}</div>
                            <div>인원 : {room.roomLimit ?? "제한 없음"}</div>
                            <div className="text-end">
                                {/* 내 소유의 방이라면 삭제 버튼을 생성 */}
                                { (isLogin && loginUser.accountId === room.roomOwner) && (
                                <Button variant="danger" className="me-2"
                                    onClick={e=>deleteRoom(room)}>
                                    삭제
                                </Button>
                                )}

                                <Button variant="success" disabled={!isLogin}
                                    onClick={e=>joinRoom(room)}>
                                    참여
                                </Button>
                            </div>
                        </div>
                    </div>
                </Col>
            ))}
        </Row>

        {/* 생성을 위한 모달 */}
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>신규 방 만들기</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Row>
                    <Form.Label column sm={3}>방 제목</Form.Label>
                    <Col sm={9}>
                        <Form.Control type="text" name="name"
                                value={input.name}
                                onChange={changeName}/>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Form.Label column sm={3}>인원 제한</Form.Label>
                    <Col sm={9}>
                        <Form.Control type="text" inputMode="numeric" name="limit"
                            placeholder="미작성 시 무제한으로 설정"
                            value={input.limit}
                            onChange={changeLimit}/>
                    </Col>
                </Row>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    <FaXmark/>
                    <span className="ms-2">닫기</span>
                </Button>
                <Button variant="success" onClick={createRoom}>
                    <FaPlus/>
                    <span className="ms-2">생성</span>
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
}