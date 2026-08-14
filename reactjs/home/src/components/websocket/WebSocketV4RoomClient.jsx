import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "@utils/reaxios";
import Swal from "sweetalert2";
import { Badge, Button, Col, Form, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { useAtomValue } from "jotai";
import { loginUserState } from "@utils/storage";
import { FaChevronDown, FaPaperPlane, FaUsers } from "react-icons/fa6";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");//한국어로 설정
import { GiExitDoor } from "react-icons/gi";
import { FaPlus, FaXmark } from "react-icons/fa6";

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
            setUsers(data.users);
        }
        catch (e) {
            if (e.status === 403) {
                await Swal.fire("당신은 방 참여자가 아닙니다");
                navigate("/websocket/v4");//목록으로 이동
            }
            else if (e.status === 404) {
                await Swal.fire("존재하지 않는 방입니다");
                navigate("/websocket/v4");//목록으로 이동
            }
            else {//500
                await Swal.fire("일시적인 서버 오류입니다.\n잠시 후 실행해주세요");
                navigate("/websocket/v4");//목록으로 이동
            }
        }
    }, []);
    useEffect(() => {
        loadRoom();
    }, []);

    //웹소켓 관련
    const loginUser = useAtomValue(loginUserState);
    const [client, setClient] = useState(null);//서버와의 연결정보를 가진 객체
    const [input, setInput] = useState("");//사용자의 입력

    const [history, setHistory] = useState([]);//메세지 이력

    const inputRef = useRef();//입력창 제어용 리모컨
    const [users, setUsers] = useState([]);//접속한 사용자의 목록

    const [last, setLast] = useState(true);//더보기 가능 여부
    const lastMessageNo = useMemo(() => {
        if (!history) return null;
        if (history.length === 0) return null;
        return history[0].no || null;
    }, [history]);

    //웹소켓과 별개로 채팅내역을 불러오는 작업이 필요 (AJAX 사용)
    useEffect(() => {
        loadHistory();
    }, []);
    const loadHistory = useCallback(async () => {
        const { data } = await apiClient.post(
            `/room/${roomNo}/messages`,
            { size: 100 }
        );
        setHistory(data.messages);//덮어쓰기
        setLast(data.last);
    }, []);
    const loadMoreHistory = useCallback(async () => {
        const { data } = await apiClient.post(
            `/room/${roomNo}/messages`,
            { size: 100, lastMessageNo: lastMessageNo }
        );
        setHistory(prev => [...data.messages, ...prev]);//앞에 추가
        setLast(data.last);
    }, [lastMessageNo]);


    //연결 및 해제
    useEffect(() => {
        if (room === null) return;//방 정보가 존재하지 않으면 연결을 하지마라! (기존과 차이점)

        //최초 1회 실행해야할 작업
        const client = connectToServer();
        setClient(client);

        //페이지 이탈 시 해야할 작업
        return () => {
            disconnectFromServer(client);
            setClient(null);
        };
    }, [room]);

    //연결 함수
    const connectToServer = useCallback(() => {
        //연결(socket) 생성
        const socket = new SockJS(`${import.meta.env.VITE_SERVER_URL}/ws-member`);

        //연결을 관리할 도구(client) 생성하여 반환
        const client = new Client({
            //연결 객체를 생성하는 함수
            webSocketFactory: () => socket,

            //웹소켓의 상황별 Callback 지정
            onConnect: () => {//연결되었을 때
                //채널구독 및 수신작업 안내
                client.subscribe(`/public/${roomNo}/chat`, (message) => {
                    const json = JSON.parse(message.body);
                    setHistory(prev => [...prev, json]);
                });
                client.subscribe(`/public/${roomNo}/system`, (message) => {
                    const json = JSON.parse(message.body);
                    setHistory(prev => [...prev, json]);
                });
                client.subscribe(`/public/${roomNo}/users`, (message) => {
                    //여기서의 메세지는 List<TokenParseResponseVO>이다. 즉, 배열이다.
                    const jsonArray = JSON.parse(message.body);
                    setUsers(jsonArray);
                });
                client.subscribe(`/private/${roomNo}/system/${loginUser.accountId}`, (message) => {
                    const json = JSON.parse(message.body);
                    setHistory(prev => [...prev, json]);
                    //toast.error(json.content);
                });
                client.subscribe(`/private/${roomNo}/users/${loginUser.accountId}`, (message) => {
                    //여기서의 메세지는 List<TokenParseResponseVO>이다. 즉, 배열이다.
                    const jsonArray = JSON.parse(message.body);
                    setUsers(jsonArray);
                });
            },
            //디버깅 설정(옵션)
            debug: (str) => console.log(str)
        });

        //클라이언트 활성화
        client.activate();

        return client;
    }, []);
    //연결 종료 함수
    const disconnectFromServer = useCallback((client) => {
        if (client) {//client가 존재한다면
            client.deactivate();//비활성화
        }
    }, []);

    //연결 상태 확인
    const isConnect = useMemo(() => {
        if (client === null) return false;//client가 없는 경우
        if (client.active === false) return false;//deactivate() 상태인 경우
        return true;
    }, [client]);

    //메세지 전송
    const sendMessage = useCallback(() => {
        //보낼 수 있는 상태인지를 검증
        if (isConnect === false) return;
        if (input.trim() === "") return;

        //메세지 전송을 위한 JSON 데이터 생성
        const json = { content: input };

        //STOMP 규격에 맞는 메세지 생성
        const stompMessage = {
            destination: `/app/${roomNo}/chat`,//서버로 보낼 목적지
            body: JSON.stringify(json),//전송할 내용 (직렬화된 JSON)
        };

        //전송
        client.publish(stompMessage);
        setInput("");//입력값 청소
    }, [client, input, isConnect]);

    //(+추가) 스크롤을 끝으로 갱신시키는 처리 (반대도 가능) , * reverse인 상황
    const messageWrapperRef = useRef();
    const topFlag = useRef(true);//최상단(마지막)이면 true, 아니면 false인 값 (태그 제어 목적이 아님)
    useEffect(() => {
        if (topFlag.current === true) {
            keepScrollTop();
        }
    }, [history]);
    const isScrollTop = useCallback(() => {
        if (messageWrapperRef.current) {
            // console.log("스크롤 최상단인지 계산중...");
            const { scrollTop, scrollHeight, clientHeight } = messageWrapperRef.current;
            const diff = scrollHeight - (Math.abs(scrollTop) + clientHeight);
            topFlag.current = diff <= 5;
            console.log("스크롤 최상단 여부 : " + topFlag.current);
        }
    }, []);
    const keepScrollTop = useCallback(() => {
        if (messageWrapperRef.current) {
            //messageWrapperRef.current.scrollTop = 0;//처음으로 (하단)
            messageWrapperRef.current.scrollTop = -messageWrapperRef.current.scrollHeight; //마지막으로 (상단)
        }
    }, []);

    //시간을 표시해야 되는 상황인지 판정하는 함수
    const checkTimeVisible = useCallback((curr, prev) => {
        if (!curr) return true;//null, undefined 모두 제거
        if (!prev) return true;//null, undefined 모두 제거

        if (curr.senderId !== prev.senderId) return true;//작성자 ID가 다르면 시간 표시
        if (curr.type !== prev.type) return true;//메세지 유형이 다르면 시간 표시

        const currTime = dayjs(curr.time);
        const prevTime = dayjs(prev.time);
        const isSameTime = currTime.isSame(prevTime, "minute");
        return isSameTime === false;//작성시각이 다르면 시간 표시
    }, []);

    //작성자와 프로필을 표시해야 하는 상황인지 판정하는 함수
    const checkSenderVisible = useCallback((curr, next) => {
        if (!curr) return true;//null, undefined 제거
        if (!next) return true;//null, undefined 제거

        if (curr.senderId !== next.senderId) return true;//작성자가 다르면 표시
        if (curr.type !== next.type) return true;//메세지 유형이 다르면 시간 표시

        return false;
    }, []);

    //방 나가기
    const exitRoom = useCallback(async () => {
        const result = await Swal.fire({
            title: "방을 나가시겠습니까?",
            text: "사라진 대화내역은 다시 복구할 수 없습니다",
            icon: "warning",
            confirmButtonText: "네 나가겠습니다",
            cancelButtonText: "아니오, 나가지 않겠습니다",
            showCancelButton: true
        });
        if (result.isConfirmed === false) return;

        await apiClient.post("/room/leave", {
            roomNo: Number(roomNo)
        });

        navigate("/websocket/v4");
    }, [roomNo, navigate]);

    const kickRoom = useCallback(async () => {
        const result = await Swal.fire({
            title: `${target.accountId}님을 추방하시겠습니까?`,
            icon: "warning",
            confirmButtonText: "네, 추방하겠습니다",
            cancelButtonText: "아니오, 추방하지 않겠습니다",
            showCancelButton: true
        });
        if (result.isConfirmed === false) return;

        //사용자 목록에서 제거
        const { data } = await apiClient.post(
            "/room/kick", { roomNo : roomNo, accountId : target.accountId}
        );
    }, []);


    //화면
    if (room === null) {
        return (<h1>로딩중...</h1>);
    }

    return (<>
        <Jumbotron title="그룹 채팅 예제" content={`현재 입장하신 방은 ${roomNo}번방 입니다`} />

        {/* 방 정보 출력 */}
        <Row className="mt-2">
            <Col sm={3} className="text-info fw-bold">방 제목</Col>
            <Col sm={9}>{room.roomName}</Col>
        </Row>
        <Row className="mt-2">
            <Col sm={3} className="text-info fw-bold">방장</Col>
            <Col sm={9}>{room.roomOwner ?? "없음"}</Col>
        </Row>
        <Row className="mt-2">
            <Col sm={3} className="text-info fw-bold">인원</Col>
            <Col sm={9}>{users.length} / {room.roomLimit ?? "제한 없음"}</Col>
        </Row>

        {/* 나가기 버튼 */}
        <Row>
            <Col className="text-end">
                <Button variant="danger" onClick={exitRoom}>
                    <GiExitDoor />
                    <span className="ms-2">나가기</span>
                </Button>
            </Col>
        </Row>

        {/* 입력창 */}
        <Row className="mt-5">
            <Form.Label column sm={3}>메세지 입력</Form.Label>
            <Col sm={9}>

                <div className="d-flex">
                    {/* 입력창과 버튼은 연결이 활성화 되어있을 경우에만 사용 가능하도록 설정 */}
                    <Form.Control type="text" disabled={isConnect === false}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyUp={e => {
                            //엔터를 누르면 전송버튼과 동일한 기능을 실행
                            if (e.key === "Enter") sendMessage();
                        }}
                        ref={inputRef}
                    />

                    <Button variant="success" className="text-nowrap ms-2"
                        disabled={isConnect === false} onClick={sendMessage}>
                        <FaPaperPlane />
                        <span className="ms-2 d-none d-sm-inline">전송</span>
                    </Button>
                </div>


            </Col>
        </Row>

        {/* 메세지를 출력 (+부트스트랩 디자인) */}
        <Row className="mt-5">
            <Col xs={12} className="fs-4">
                <FaUsers className="me-2" />
                <span>{users.length}명</span>
            </Col>

            {/* 메세지 이력 */}
            <Col sm={9}>
                <div className="message-wrapper" ref={messageWrapperRef}
                    onScroll={isScrollTop}>
                    {/* 첫지점(맨아래) */}
                    {last === false && (
                        <Button variant="secondary" onClick={loadMoreHistory}>
                            <FaChevronDown />
                            <span className="mx-2">메세지 더 불러오기</span>
                            <FaChevronDown />
                        </Button>
                    )}

                    {history.map((message, index) => {
                        //내 메세지인지 판정
                        const my = loginUser.accountId === message.senderId;
                        const isDiffSender = checkSenderVisible(history[index], history[index + 1]);
                        const isDiffTime = checkTimeVisible(history[index], history[index - 1]);

                        return (
                            <div className={`message-outer ${my ? "my" : ""}`} key={index}>
                                {/* 일반 채팅 메세지 */}
                                {message.type === "chat" && (
                                    <div className="message-inner">
                                        {/* 프로필 출력 */}
                                        {!my && (
                                            <div className="profile-wrapper">
                                                {(isDiffSender) && (
                                                    <img src="https://picsum.photos/100" />
                                                )}
                                            </div>
                                        )}
                                        {/* 컨텐츠(작성자), 내용, 시간 등 출력 */}
                                        <div className="content-wrapper">
                                            {(!my && isDiffSender) && (
                                                <div className="sender">
                                                    {message.senderNickname}
                                                    <Badge bg="primary" className="ms-2">
                                                        {message.senderLevel}
                                                    </Badge>
                                                </div>
                                            )}
                                            <div className="content">
                                                <div className="body">
                                                    {/* 테스트용 번호 */}
                                                    <Badge>{message.no}</Badge>

                                                    {message.content}
                                                </div>
                                                {/* 시간은 경우에 따라서 나오지 않을 수도 있다 */}
                                                <div className="time">
                                                    {isDiffTime && (
                                                        dayjs(message.time).format("a h:mm")
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 시스템 메세지 */}
                                {message.type === "system" && (
                                    <div className={`system-message text-${message.level} bg-${message.level} border-${message.level}`}
                                        style={{ "--bs-bg-opacity": ".10" }}>
                                        {message.content}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* 마지막(맨위) */}
                </div>
            </Col>

            {/* 사용자 목록 */}
            <Col sm={3}>
                <ListGroup>
                    {users.map((user, index) => (
                        <ListGroupItem key={index}
                            className={user.accountId === loginUser.accountId ? "active" : ""}
                            onClick={e => {
                                setInput(`/w ${user.accountId} `);
                                inputRef.current.focus();
                            }}
                            style={{ "cursor": "pointer" }}>

                            <div className="d-flex justify-content-between">
                                <div>
                                    <span>{user.accountId}</span>
                                    {user.accountId === loginUser.accountId && (
                                        <span className="ms-1 fw-bold">(나)</span>
                                    )}
                                </div>
                                <div>
                                    {/* 방장이면서 자신을 제외한 사람에게 X마크를 추가 */}
                                    { ( room.roomOwner === loginUser.accountId 
                                        &&
                                        user.accountId !== loginUser.accountId)&&(
                                        <FaXmark className="text-danger fw-bold"
                                            onClick={e=>kickRoom(user)}/>
                                    )}
                                </div>
                            </div>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </Col>
        </Row>
    </>)
}