import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiClient } from "../../utils/reaxios";
import { Button, Col, Row } from "react-bootstrap";
import { FaList, FaSquarePen, FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";


export default function PostDetail() {

    const { postNo } = useParams();
    const [post, setPost] = useState(null);

    const navigate = useNavigate();

    if (/^[0-9]+$/.test(postNo) === false) {
        toast.error("없는 게시글입니다.");
        navigate("/anonymous");
    }

    const loadData = useCallback(async () => {
        const { data } = await apiClient.get(`/post/${postNo}`);
        setPost(data);
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    // 게시판 삭제
    const deletePost = useCallback(async () => {
        //확인
        Swal.fire({
            title: "게시판 비밀번호를 입력해주세요",
            input: "password",
            inputPlaceholder: "비밀번호 입력",

            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소",

            confirmButtonColor: "#d63031",
            cancelButtonColor: "#b2bec3",

            showLoaderOnConfirm: true,

            preConfirm: async (password) => {
                if (!password) {
                    Swal.showValidationMessage("비밀번호를 입력해주세요.");
                    return false;
                }

                try {
                    const { data } = await apiClient.post(`/post/${postNo}/check`, {
                        postPassword: password
                    });

                    // 성공하면 password를 result.value로 전달
                    return password;
                }
                catch (error) {
                    Swal.showValidationMessage(
                        "비밀번호가 일치하지 않습니다."
                    );

                    return false;
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then(async(result) => {
            if (result.isConfirmed) {
                console.log("비밀번호 확인 성공");

                const { data} = await apiClient.delete(`/post/${postNo}`);

                navigate("/anonymous");
                toast.success("게시글 삭제 완료");
            }
        });
    }, []);

    const updatePost = useCallback(async () => {
        //확인
        Swal.fire({
            title: "게시판 비밀번호를 입력해주세요",
            input: "password",
            inputPlaceholder: "비밀번호 입력",

            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소",

            confirmButtonColor: "#d63031",
            cancelButtonColor: "#b2bec3",

            showLoaderOnConfirm: true,

            preConfirm: async (password) => {
                if (!password) {
                    Swal.showValidationMessage("비밀번호를 입력해주세요.");
                    return false;
                }

                try {
                    const { data } = await apiClient.post(`/post/${postNo}/check`, {
                        postPassword: password
                    });

                    // 성공하면 password를 result.value로 전달
                    return password;
                }
                catch (error) {
                    Swal.showValidationMessage(
                        "비밀번호가 일치하지 않습니다."
                    );

                    return false;
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then(async(result) => {
            if (result.isConfirmed) {
                console.log("비밀번호 확인 성공");

                navigate(`/anonymous/${postNo}/edit`);
            }
        });
    }, []);


    return (<>
        <Jumbotron title={post?.postTitle} />
        <hr />
        <Row className="mt-5">
            <Col>
                <h4>
                    <div style={{ minHeight: "300px" }}>
                        {post?.postContent}
                    </div>
                </h4>
            </Col>
        </Row>
        <hr />
        <Row className="text-end">
            <Col className="text-end">
                <Button variant="success" size="lg"
                    as={Link} to="/anonymous">
                    <FaList />
                    <span className="ms-2">
                        목록으로
                    </span>
                </Button>
                <Button variant="danger" size="lg" className="ms-2">
                    <FaTrash />
                    <span className="ms-2" onClick={deletePost}>
                        게시판 삭제
                    </span>
                </Button>
                <Button variant="warning" size="lg" className="ms-2">
                    <FaSquarePen />
                    <span className="ms-2" onClick={updatePost}>
                        게시판 수정
                    </span>
                </Button>
            </Col>
        </Row>
    </>)
}