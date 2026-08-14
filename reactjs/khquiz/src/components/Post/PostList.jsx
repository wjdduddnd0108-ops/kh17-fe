import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@utils/reaxios";
import { Row, Col, Form, Table, Button } from "react-bootstrap"
import { Link } from "react-router-dom";


import dayjs from "dayjs";
import "dayjs/locale/ko";
import { FaPlus } from "react-icons/fa6";
dayjs.locale("ko");//한국어로 설정

export default function PostList() {

    //state
    const [postList, setPostList] = useState([]);

    //callback
    // const loadList = useCallback(async () => {
    //     const { data } = await apiClient.post(`/post/list`, {});
    //     setPostList(data);
    //     console.log(data);
    // }, [])

    const loadList = useCallback(async () => {
        try {
            const { data } = await apiClient.post("/post/list", {});

            console.log("게시글 목록:", data);

            setPostList(data);
        }
        catch (error) {
            console.log("목록 조회 실패");
            console.log("status:", error?.response?.status);
            console.log("data:", error?.response?.data);
            console.log("url:", error?.config?.baseURL + error?.config?.url);
        }
    }, []);
    //effect
    useEffect(() => {
        loadList();
    }, [])


    return (<>
        <Jumbotron title="익명 게시판 목록" />

        <Row className="text-end">
            <Col className="text-end">
                <Button variant="success"
                    as={Link} to="/anonymous/add">
                    <FaPlus />
                    <span className="ms-2">
                        게시판 작성
                    </span>
                </Button>

            </Col>
        </Row>
        <Row className="mt-2">
            <Col>
                <Table responsive striped hover className="text-nowrap">
                    <thead>
                        <tr>
                            <th>게시판번호</th>
                            <th>제목</th>
                            <th className="text-end">작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postList.map(post => (
                            <tr key={post.postNo}>
                                <td>{post.postNo}</td>
                                <td>
                                    <Link to={`/anonymous/${post.postNo}`}>
                                        {post.postTitle}
                                    </Link>
                                </td>
                                <td className="text-end">
                                    {dayjs(post.postCtime).format("YYYY년 M월 D일 H시 m분")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>
    </>)
}