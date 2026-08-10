import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { v4 as uuidv4} from "uuid";//랜덤한 UUID 한 개 생성
import { Button, Col, Row, Form } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa6";

import "./WebSocketV2AdvancedClient.css";

import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");//한국어로 설정

export default function WebSocketV2AdvancedClient() {

    const [client, setClient] = useState(null);//서버와의 연결정보를 가진 객체
    const [uuid] = useState(()=>uuidv4());//현재 사용자의 식별번호
    const [input, setInput] = useState("");//사용자의 입력
    const [history, setHistory] = useState([]);//메세지 저장소

    //WebSocket 연결은 들어오자마자 해야하며, 나갈 때 반드시 해제해야 한다
    //→ 연관항목이 없는 useEffect를 사용하고 Clean-Up 함수를 생성해야 한다
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
        const socket = new SockJS(`${import.meta.env.VITE_SERVER_URL}/ws`);

        //연결을 관리할 도구(client) 생성하여 반환
        const client = new Client({
            //연결 객체를 생성하는 함수
            webSocketFactory: () => socket,
            //(+추가) 서버로 전달될 헤더 설정
            connectHeaders: {
                uuid : uuid
            },

            //웹소켓의 상황별 Callback 지정
            onConnect: () =>{//연결되었을 때
                client.subscribe("/public/advanced", (message)=>{
                    const json = JSON.parse(message.body);//JSON 해석해서
                    setHistory(prev=>[...prev, json]);//히스토리에 추가
               });
            },
            //디버깅 설정(옵션)
            debug: (str) => console.log(str)
        });

        //클라이언트 활성화
        client.activate();

        return client;
    }, [uuid]);
    //연결 종료 함수
    const disconnectFromServer = useCallback((client) => {
        if (client) {//client가 존재한다면
            client.deactivate();//비활성화
        }
    }, []);

     //메세지 전송 함수
        const sendMessage = useCallback(()=>{
            //보낼 수 있는 상태인지를 검증
            if(isConnect === false) return;
            if(input.trim() === "") return;
    
            //메세지 전송을 위한 JSON 데이터 생성
            const json = { content : input };
    
            //STOMP 규격에 맞는 메세지 생성
            const stompMessage = {
                destination: "/app/advanced",//서버로 보낼 목적지
                headers: {uuid : uuid},//(+추가)헤더를 key=value 형태로 전달
                body: JSON.stringify(json),//전송할 내용 (직렬화된 JSON)
            };
    
            //전송
            client.publish(stompMessage);
            setInput("");//입력값 청소
        }, [client, input]);
    
        //client가 연결중인지 확인하는 메모
        const isConnect = useMemo(()=>{
            if(client === null) return false;//client가 없는 경우
            if(client.active === false) return false;//deactivate() 상태인 경우
            return true;
        }, [client]);

    return (<>
        <Jumbotron title="WebSocket Version 2" content="STOMP 메세지에 헤더를 추가해서 사용하기" />

         <Row className="mt-5">
            <Form.Label column sm={3}>메세지 입력</Form.Label>
            <Col sm={9}>

                <div className="d-flex">
                    {/* 입력창과 버튼은 연결이 활성화 되어있을 경우에만 사용 가능하도록 설정 */}
                    <Form.Control type="text" disabled={isConnect === false}
                            value={input} 
                            onChange={e=>setInput(e.target.value)}
                            onKeyUp={e=>{
                                //엔터를 누르면 전송버튼과 동일한 기능을 실행
                                if(e.key === "Enter") sendMessage();
                            }}
                    />

                    <Button variant="success" className="text-nowrap ms-2" 
                            disabled={isConnect === false} onClick={sendMessage}>
                        <FaPaperPlane/>
                        <span className="ms-2 d-none d-sm-inline">전송</span>
                    </Button>
                </div>
            </Col>
        </Row>

        {/* 메세지 출력 (+부트스트랩 디자인) */}
        <Row className="mt-5">
            <Col>
                <div className="message-wrapper">
                    {history.map((message, index)=>{
                    //추가 계산 코드 작성
                    const my = uuid === message.sender;
                    return (
                        <div className={`message-outer ${my ? "my" : ""}`} key={index}>
                            <div className="message-inner">
                                {/* 가로로 3칸을 나눠 순서대로 프로필/작성자+내용/작성시각으로 구현*/}
                                {my === false && (
                                <div className="profile-wrapper">
                                    <img src="https://picsum.photos/100"/>
                                </div>
                                )}
                                <div className="content-wrapper">
                                    {my === false && (
                                    <div className="sender">{message.sender}</div>
                                    )}
                                    <div className="content">
                                        <div className="body">{message.content}</div>
                                        <div className="time">{dayjs(message.time).format("a h:mm")}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </Col>
        </Row>
    </>)

}