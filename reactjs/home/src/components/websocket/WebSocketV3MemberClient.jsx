import { Client } from "@stomp/stompjs";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { loginUserState } from "@utils/storage";
import { Button, Col, Row, Form, Badge, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaCircleInfo, FaPaperPlane, FaUsers } from "react-icons/fa6";
import Jumbotron from "@templates/Jumbotron";
import { LuMessageCircleMore } from "react-icons/lu";

import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");//한국어로 설정

import "./WebSocketV2AdvancedClient.css";
import { toast } from "react-toastify";

export default function WebSocketV3MemberClient() {

    const [client, setClient] = useState(null);//서버와의 연결정보를 가진 객체
    const loginUser = useAtomValue(loginUserState);
    const [history, setHistory] = useState([]);//메세지 이력
    const [input, setInput] = useState("");//사용자의 입력
    const [users, setUsers] = useState([]);//접속한 사용자의 목록

    useEffect(() => {
        //최초 1회 실행해야할 작업
        const client = connectToServer();
        setClient(client);

        //페이지 이탈 시 해야할 작업
        return () => {
            disconnectFromServer(client);
            setClient(null);
        };
    }, []);

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
                client.subscribe("/public/chat", (message) => {
                    const json = JSON.parse(message.body);
                    setHistory(prev => [...prev, json]);
                });
                client.subscribe("/public/system", (message) => {
                    const json = JSON.parse(message.body);
                    setHistory(prev => [...prev, json]);
                });
                client.subscribe("/public/users", (message) => {
                    //여기서의 메세지는 List<TokenParseResponseVO>이다. 즉, 배열이다.
                    const jsonArray = JSON.parse(message.body);
                    setUsers(jsonArray);
                });
                client.subscribe(`/private/dm/${loginUser.accountId}`, (message) => {
                    const json = JSON.parse(message.body);
                    setHistory(prev => [...prev, json]);
                });
                client.subscribe(`/private/system/${loginUser.accountId}`, (message) => {
                    const json = JSON.parse(message.body);
                    setHistory(prev => [...prev, json]);
                    //toast.error(json.content);
                });
                client.subscribe(`/private/users/${loginUser.accountId}`, (message) => {
                    const jsonArray = JSON.parse(message.body);
                    setUsers(jsonArray);
                    //toast.error(json.content);
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

    //client가 연결중인지 확인하는 메모
    const isConnect = useMemo(() => {
        if (client === null) return false;//client가 없는 경우
        if (client.active === false) return false;//deactivate() 상태인 경우
        return true;
    }, [client]);

    //메세지 전송 함수
    const sendMessage = useCallback(() => {
        //보낼 수 있는 상태인지를 검증
        if (isConnect === false) return;
        if (input.trim() === "") return;

        //메세지 전송을 위한 JSON 데이터 생성
        const json = { content: input };

        //STOMP 규격에 맞는 메세지 생성
        const stompMessage = {
            destination: "/app/chat",//서버로 보낼 목적지
            body: JSON.stringify(json),//전송할 내용 (직렬화된 JSON)
        };

        //전송
        client.publish(stompMessage);
        setInput("");//입력값 청소
    }, [client, input, isConnect]);

   

    //(+추가) 스크롤을 끝으로 갱신시키는 처리 (반대도 가능) , * reverse인 상황
    const messageWrapperRef = useRef();
    useEffect(() => {
        //messageWrapperRef.current.scrollTop = 0;//처음으로 (하단)
        messageWrapperRef.current.scrollTop = -messageWrapperRef.current.scrollHeight; //마지막으로 (상단)
    }, [history]);

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

    return (<>
        <Jumbotron title="WebSocket Version 3" content="인증된 사용자끼리의 웹소켓 통신 구현" />
        <Row>
            <Col>
                <h4>현재 아이디 : {loginUser.accountId}</h4>
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
                <div className="message-wrapper" ref={messageWrapperRef}>
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
                                                <div className="body">{message.content}</div>
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

                                {/* DM 메세지 */}
                                {message.type === "dm" && (
                                    <div className="message-inner dm">
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
                                            {isDiffSender && (
                                                <div className="sender">
                                                    {/* 
                                            DM은  
                                            - 발신자에게는 수신자의 정보가
                                            - 수신자에게는 발신자의 정보가 
                                            나와야함
                                        */}
                                                    <LuMessageCircleMore className="me-2" />

                                                    {my ? (<>
                                                        {`To.${message.receiverNickname}`}
                                                        <Badge bg="primary" className="ms-2">
                                                            {message.receiverLevel}
                                                        </Badge>
                                                    </>) : (<>
                                                        {`From.${message.senderNickname}`}
                                                        <Badge bg="primary" className="ms-2">
                                                            {message.senderLevel}
                                                        </Badge>
                                                    </>)}
                                                </div>
                                            )}
                                            <div className="content">
                                                <div className="body">{message.content}</div>
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

                            <span>{user.accountId}</span>

                            {user.accountId === loginUser.accountId && (
                                <span className="ms-1 fw-bold">(나)</span>
                            )}
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </Col>
        </Row>
    </>);
}