import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Jumbotron from "./Jumbotron";
import { FaChevronDown } from "react-icons/fa6";
import { ClockLoader } from "react-spinners";

function Exam11() {
    //state
    const [practice1List, setPractice1List] = useState([]);
    const [last, setLast] = useState(false);
    const [size, setSize] = useState(10);
    const [loading, setLoading] = useState(false);

    //effect
    useEffect(() => {
        loadMoreList();
    }, []);

    //callback
    const loadMoreList = useCallback(() => {
        const dataSize = practice1List.length;
        const lastPractice1No = dataSize === 0 ? 0 : practice1List[dataSize - 1].practice1No;

        setLoading(true);

        axios({
            url: "http://localhost:8080/api/practice1/listForReact",
            method: "get",
            params: {
                lastPractice1No: lastPractice1No,
                size: size
            }
        })
            .then(response => {
                setPractice1List([...practice1List, ...response.data.list]);
                setLast(response.data.last);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [practice1List, size]);

    return (<>
        <Jumbotron title="더보기 방식의 강좌 목록" />

        <div className="row mt-4">
            <div className="col">
                <select value={size} onChange={e => setSize(parseInt(e.target.value))}>
                    <option value="5">5개씩 보기</option>
                    <option value="10">10개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                </select>
            </div>
        </div>

        <div className="row mt-4">
            {practice1List.map(practice1 => (
                <div className="col-md-6 col-lg-4" key={practice1.practice1No}>
                    <div className="card mb-3">
                        <h3 className="card-header text-truncate">{practice1.practice1Name}</h3>
                        <div className="card-body">
                            <h5 className="card-title">{practice1.practice1Name}</h5>
                        </div>
                        <div className="card-body">
                            <p className="card-text">강좌 설명</p>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">카테고리: {practice1.practice1Category}</li>
                            <li className="list-group-item">수강시간: {practice1.practice1Time}</li>
                            <li className="list-group-item">수강료: {practice1.practice1Price}원</li>
                            <li className="list-group-item">수업형태: {practice1.practice1CourseType}</li>
                        </ul>
                        <div className="card-body">
                            <a href="#" className="card-link">상세정보 보기</a>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* 더보기 버튼 */}
        {last === false && (
            <div className="row mt-2">
                <div className="col">
                    <button type="button" className="btn btn-success btn-lg w-100"
                        onClick={loadMoreList}>
                        <FaChevronDown />
                        <span className="mx-2">더보기</span>
                        <FaChevronDown />
                    </button>
                </div>
            </div>
        )}

        {loading === true && (
            <div className="position-fixed top-0 start-0 
                        w-100 h-100 bg-dark bg-opacity-25
                        d-flex justify-content-center align-items-center">
                <div className="d-flex flex-column text-center">
                    <ClockLoader size={75} loading={loading} />
                    <p className="mt-2">불러오는중</p>
                </div>
            </div>
        )}
    </>)

}

export default Exam11