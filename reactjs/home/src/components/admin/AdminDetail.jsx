import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "../../utils/reaxios";
import { Link, Navigate, Route, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaList } from "react-icons/fa6";
import axios from "axios";

export default function AdminDetail() {
    const { accountId } = useParams();

    if (accountId === null && accountId === "") {
        toast.error("없는 회원아이디입니다.");
        return <Navigate to="/admin/users2" replace />
    }

    const navigate = useNavigate();

    const [account, setAccount] = useState(null);
    useEffect(() => {
        loadData();
    }, []);

    //callback
    const loadData = useCallback(async () => {
        const { data } = await apiClient.get(`/account/${accountId}`)
        setAccount(data);
    }, [accountId]);

    //주소를 완성해서 반환하는 메모
    const unionAddress = useMemo(() => {
        if (account === null) return "";
        if (account.accountPost === null) return "";
        if (account.accountAddress1 === null) return "";
        if (account.accountAddress2 === null) return "";
        return `[${account.accountPost}] ${account.accountAddress1} ${account.accountAddress2}`
    }, [account]);

    // 차단 여부 변경
    const chnageBlock = useCallback(async (e) => {
        const accountBlock = e.target.value;

        try {
            await apiClient.patch(`/admin/${accountId}`, {
                accountBlock,
            });

            setAccount({
                ...account,
                accountBlock,
            });

            toast.success("차단여부가 변경되었습니다");
        }
        catch {
            toast.error("차단 여부 변경에 실패했습니다");
        }
    });

    return (<>
        <Jumbotron title={`${account?.accountNickname}님의 정보`} />

        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">아이디</Col>
            <Col sm={9} className="text-secondary">{account?.accountId}</Col>
        </Row>

        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">닉네임</Col>
            <Col sm={9} className="text-secondary">{account?.accountNickname}</Col>
        </Row>

        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">이메일</Col>
            <Col sm={9} className="text-secondary">{account?.accountEmail}</Col>
        </Row>

        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">생년월일</Col>
            <Col sm={9} className="text-secondary">{account?.accountBirth}</Col>
        </Row>

        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">연락처</Col>
            <Col sm={9} className="text-secondary">{account?.accountContact}</Col>
        </Row>

        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">주소</Col>
            <Col sm={9} className="text-secondary">
                {unionAddress}
            </Col>
        </Row>

        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">등급</Col>
            <Col sm={9} className="text-secondary">{account?.accountLevel}</Col>
        </Row>

        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">포인트</Col>
            <Col sm={9} className="text-secondary">
                {account?.accountPoint.toLocaleString()} point
            </Col>
        </Row>

        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">가입일</Col>
            <Col sm={9} className="text-secondary">{account?.accountJoin}</Col>
        </Row>

        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">최종로그인</Col>
            <Col sm={9} className="text-secondary">{account?.accountLogin}</Col>
        </Row>

        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">최종변경일</Col>
            <Col sm={9} className="text-secondary">{account?.accountChange}</Col>
        </Row>

        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">메세지</Col>
            <Col sm={9} className="text-secondary">{account?.accountMessage}</Col>
        </Row>

        <Row className="mt-2">
            <Form.Label column sm={3}>차단여부</Form.Label>
            <Col sm={9}>
                <Form.Check type="radio" label="차단"
                    name="accountBlock" value="Y"
                    checked={account?.accountBlock === "Y"}
                    onChange={chnageBlock}
                />
                <Form.Check type="radio" label="허용"
                    name="accountBlock" value="N"
                    checked={account?.accountBlock === "N"}
                    onChange={chnageBlock}
                />
            </Col>
        </Row>



        <Row className="mt-5">
            <Col className="text-end">
                <Button className="ms-2 w-100" variant="secondary"
                    as={Link} to="/admin/users2">
                    <FaList />
                    <span>목록으로</span>
                </Button>
            </Col>
        </Row>
    </>)
}