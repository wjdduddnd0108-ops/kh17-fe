import { useEffect, useState } from "react";
import Jumbotron from "./Jumbotron";
import axios from "axios";

function Exam08() {
    const [practice1List, setPractice1List] = useState([]);

    //effect
    useEffect(() => {
        axios({
            url: "http://localhost:8080/api/practice1/list",
            method: "get"
        })
            .then(response => {
                setPractice1List(response.data);
            })
    });

    return (<>
        <Jumbotron title="강좌 목록" />

        <div className="row mt-4">
            {practice1List.map(practice1=>(
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


        <div className="row mt-4">
            <div className="col">
                <div className="text-nowrap table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>강좌이름</th>
                                <th>카테고리</th>
                                <th>수강시간</th>
                                <th>수강가격</th>
                                <th>수업형태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {practice1List.map(practice1 => (
                                <tr key={practice1.practice1No}>
                                    <td>{practice1.practice1Name}</td>
                                    <td>{practice1.practice1Category}</td>
                                    <td>{practice1.practice1Time}</td>
                                    <td>{practice1.practice1Price}</td>
                                    <td>{practice1.practice1CourseType}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </>);
}

export default Exam08