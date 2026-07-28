import { Col, Row } from "react-bootstrap";
import Jumbotron from "../../templates/Jumbotron";

export default function AccountBlock(){
    return(<>
        <Jumbotron title="차단된 아이디입니다" content="확인 후 다시 로그인해주세요"/>
        {/* 추가 이동 및 문의 버튼등을 배치할 수 있음 */}
    </>)
}