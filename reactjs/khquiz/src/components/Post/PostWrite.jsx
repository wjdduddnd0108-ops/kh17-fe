import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../utils/reaxios";
import { toast } from "react-toastify";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaAsterisk, FaList, FaPlus, FaSquarePen } from "react-icons/fa6";

export default function PostWrite() {

    const navigate = useNavigate();

    const [post, setPost] = useState({
        postTitle: "",
        postContent: "",
        postPassword: ""
    });

    const [result, setResult] = useState({
        postTitle: "",
        postContent: "",
        postPassword: ""
    });

    const changeStringValue = useCallback(e => {
        const { name, value } = e.target;
        setPost({
            ...post, //나머지는 그대로 유지하세요
            [name]: value
        });
    }, [post]);
    
    const checkPostTitle = useCallback(()=>{
        const regex = /^(?!\s*$).+/;
        const valid = regex.test(post.postTitle);
        setResult({
            ...result,
            postTitle : valid ? "is-valid" : "is-invalid"
        });
    }, [post.postTitle, result]);

    const checkPostContent = useCallback(()=>{
        const regex = /^(?!\s*$).+/;
        const valid = regex.test(post.postContent);
        setResult({
            ...result,
            postContent : valid ? "is-valid" : "is-invalid"
        });
    }, [post.postContent, result]);

    const checkPostPassword = useCallback(()=>{
        const regex = /^[!-~]{8,20}$/;
        const valid = regex.test(post.postPassword);
        setResult({
            ...result,
            postPassword : valid ? "is-valid" : "is-invalid"
        });
    }, [post.postPassword, result]);

    const valid = useMemo(()=>{
        if(result.postTitle !== "is-valid") return false;
        if(result.postContent !== "is-valid") return false;
        if(result.postPassword !== "is-valid") return false;
        return true;
    }, [result]);

    const send = useCallback(async ()=>{
        const {data} = await apiClient.post("/post/", post);

        navigate("/anonymous");
        toast.success("게시글 등록이 완료되었습니다");
    })

    return (<>
        <Jumbotron title="게시판 작성" />

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>제목</span>
                <FaAsterisk className="text-danger"/>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="postTitle"
                    value={post.postTitle} onChange={changeStringValue}
                    className={result.postTitle}
                    onBlur={checkPostTitle}/>
                <div className="invalid-feedback">필수항목입니다</div>
            </Col>
        </Row>
        <Row className="mt-4">
            <Form.Label column sm={12}>
                <span>본문</span>
            </Form.Label>
            <Col sm={12}>
                <Form.Control as="textarea" rows={8} name="postContent"
                    value={post.postContent} onChange={changeStringValue}
                    className={result.postContent}
                    onBlur={checkPostContent}/>
                <div className="invalid-feedback">필수항목입니다</div>
            </Col>
        </Row>
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>비밀번호</span>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="password" name="postPassword"
                    value={post.postPassword} onChange={changeStringValue}
                    className={result.postPassword}
                    onBlur={checkPostPassword}/>
            <div className="valid-feedback">비밀번호 설정이 완료되었습니다</div>
            <div className="invalid-feedback">영문 대/소문자, 숫자, 특수문자를 반드시 포함하여 작성하세요</div>
            </Col>
        </Row>

        <Row className="text-end mt-5">
            <Col className="text-end">
                <Button variant="success" size="lg"
                    as={Link} to="/anonymous">
                    <FaList />
                    <span className="ms-2">
                        목록으로
                    </span>
                </Button>
                <Button variant="warning" size="lg" className="ms-2"
                    disabled={valid === false} onClick={send}>
                    <FaPlus />
                    <span className="ms-2">
                        게시글 작성
                    </span>
                </Button>
            </Col>
        </Row>
    </>)
}