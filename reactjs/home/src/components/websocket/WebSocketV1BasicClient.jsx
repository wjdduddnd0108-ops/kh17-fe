
import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function WebSocketV1BasicClient(){

    //WebSocket은 연결을 기반으로 하기 때문에 연결에 사용할 객체가 있어야 한다
    const [client, setClient] = useState(null);//서버와의 연결정보를 가진 객체

    //WebSocket 연결은 들어오자마자 해야하며, 나갈 때 반드시 해제해야 한다
    //-> 연관항목이 없는 useEffect를 사용하고 Clean-Up 함수를 생성해야 한다
    useEffect(()=>{
        //최초 1회 실행해야할 작업
        const client = connectToServer();
        setClient(client);

        //페이지 이탈 시 해야할 작업
        return ()=>{
            disconnectFromServer(client);
            setClient(null);
        };
    },[]);

    //연결 함수
    const connectToServer = useCallback(()=>{
        //연결(socket) 생성
        const socket = new SockJS("http://localhost:8080/ws");

        //연결을 관리할 도구(client) 생성하여 반환
        // - client에 구독할 채널, 메세지 수/발신에 대한 코드를 콜백 함수 형태로 설정
        // - 구독할 채널 : /public/basic
        // - 메세지를 보낼 채널 : /app/basic
        const client = new Client({
            webSocketFactory : () => socket , //연결 객체를 생성하는 함수
            //웹소켓의 상황별 Callback 지정
            onConnect: ()=>{//연결되었을 때
                //client.subscribe(채널명, 콜백함수);
                client.subscribe("/public/basic", (message)=>{
                    console.log(message);
                });
            },
            //디버깅 설정(옵션)
            debug: (str)=>console.log(str)
        });

        //클라이언트 활성화
        client.activate();

        return client;
    },[]);
    //연결 종료 함수
    const disconnectFromServer = useCallback((client)=>{
        if(client){//client가 존재한다면
            client.deactivate();//비활성화
        }
    }, []);

    return(<>
        <Jumbotron title="WebSocket Version 1" content="기본 웹소켓 예제"/>

    </>)
}