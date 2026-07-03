import { useCallback, useEffect, useState } from "react";
import Jumbotron from "./Jumbotron";
import { FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axios from "axios";

function Exam07_1() {
    //서버에서 조회했다고 가정하고 state를 구현
    const [countryList, setCountryList] = useState([]);

    //effect
    //- 시작하자마자 서버에서 비동기통신으로 국가 목록을 달라고 1회 요청
    //- useEffect(함수, []);
    //- 연관항목을 비워두면 최초 1회만 실행되는 구문이 됨
    useEffect(()=>{
        //axios 요청 전송
        axios({
            url:"http://localhost:8080/api/country/list",
            method:"get"
        })
        .then(response=>{
            console.log("서버의 대답(응답)", response);
            setCountryList(response.data);
        });
    },[]);


    //callback
    const deleteCountry = useCallback(target=>{
        Swal.fire({
            title:"정말 삭제하시겠습니까?",
            text: "삭제 후에는 복구할 수 없습니다",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        })
        .then(result=>{
            if(result.isConfirmed){
                setCountryList(
                    countryList.filter(country=>country.countryNo !== target.countryNo)
                );
                toast.success("삭제가 완료되었습니다");
            }
        })
        
    }, [countryList]);

    return (<>
        <Jumbotron title="객체 배열 state와 화면제어"/>

        <div className="row mt-4">
            <div className="col">
                <table className="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>국가명</th>
                        <th>대륙명</th>
                        <th>수도명</th>
                        <th className="text-end">인구</th>
                        <th className="text-end">관리</th>
                    </tr>
                    </thead>
                    <tbody>
                        {countryList.map(country=>(
                            <tr key={country.countryNo}>
                                <td>{country.countryName}</td>
                                <td>{country.countryRegion}</td>
                                <td>{country.countryCapital}</td>
                                <td className="text-end">{country.countryPopulation.toLocaleString()}</td>
                                <td className="text-end">
                                    <FaTrash className="text-danger"
                                        onClick={e=>deleteCountry(country)}/>
                                </td>
                            </tr>
                        ))}


                    </tbody>   
                </table>
            </div>
        </div>


    </>);
}

export default Exam07_1