import { useCallback, useEffect, useState } from "react";
import Jumbotron from "./Jumbotron";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa6";

function Exam10() {
    //state
    const [countryList, setCountryList] = useState([]);
    const [last, setLast] = useState(false);
    const [size, setSize] = useState(10);

    //effect
    useEffect(() => {
       loadMoreList();
    }, []);

    //callback
    const loadMoreList = useCallback(()=>{
        const dataSize = countryList.length;
        const lastCountryNo = dataSize === 0 ? 0 : countryList[dataSize-1].countryNo;

        axios({
            url:"http://localhost:8080/api/country/listForReact",
            method: "get",
            params: {
                lastCountryNo : lastCountryNo,
                size : size
            }
        })
        .then(response=>{
            //덮어쓰기가 아니라 추가(이어쓰기)가 필요
            //setCountryList(response.data.list);//덮어쓰기
            setCountryList([...countryList, ...response.data.list]);//이어쓰기
            setLast(response.data.last);
        });
    }, [countryList, size]);


    return (<>
        <Jumbotron title="더보기 방식의 목록" />

        <div className="row mt-4">
            <div className="col">
                <select value={size} onChange={e=>setSize(parseInt(e.target.value))}>
                    <option value="5">5개씩 보기</option>
                    <option value="10">10개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                </select>
            </div>
        </div>

        <div className="row mt-4">
            <div className="col">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>국가명</th>
                            <th>대륙명</th>
                            <th>수도명</th>
                            <th className="text-end">인구</th>
                        </tr>
                    </thead>
                    <tbody>
                        {countryList.map(country => (
                            <tr key={country.countryNo}>
                                <td>{country.countryName}</td>
                                <td>{country.countryRegion}</td>
                                <td>{country.countryCapital}</td>
                                <td className="text-end">{country.countryPopulation}</td> 
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* 더보기 버튼 */}
        { last === false &&(
            <div className="row mt-2">
                <div className="col">
                    <button type="button" className="btn btn-success btn-lg w-100"
                        onClick={loadMoreList}>
                        <FaChevronDown/>
                        <span className="mx-2">더보기</span>
                        <FaChevronDown/>
                    </button>
                </div>
            </div>
        ) } 
    </>)
}

export default Exam10
