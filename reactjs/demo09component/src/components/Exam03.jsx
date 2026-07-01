import { useCallback, useMemo, useState } from "react"
import Jumbotron from "./Jumbotron"

function Exam03() {
    //state
    const [country, setCountry] = useState({
        countryRegion : "",
        countryName : "",
        countryCapital : "",
        countryPopulation : 0,

    });

    //callback
    const changeStringValue = useCallback(e=>{
        const {name, value} = e.target;
         setCountry({
            ...country, 
            [name] : value
        });
    }, [country]);
    const changeNumericValue = useCallback(e=>{
        const {name, value} = e.target;
        const regex = /[^0-9]+/g;
        const replacement = value.replace(regex, "");
         setCountry({
            ...country, 
            [name] : parseInt(replacement || 0)
        });
    }, [country]);

    //memo
    const regionValid = useMemo(()=> {
        const regex = /^(아시아|아프리카|[남북]아메리카|유럽|오세아니아)$/;
        return regex.test(country.countryRegion);
    }, [country]);

    const nameValid = useMemo(()=> {
        const regex = /^[가-힣]{1,10}$/;
        return regex.test(country.countryName);
    }, [country]);

    const capitalValid = useMemo(()=> {
        const regex = /^[가-힣]{1,10}$/;
        return regex.test(country.countryName);
    }, [country]);


    //view
    return (
        <>
            <Jumbotron title="국가등록" />

            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    대륙명
                </label>
                <div className="col-sm-9">
                    <select name="countryRegion" className={`form-select ${regionValid ? "is-valid" : ""}`} 
                    value={country.countryRegion}
                    onChange={changeStringValue}
                    >
                        <option value="">선택하세요</option>
                        <option>아시아</option>
                        <option>아프리카</option>
                        <option>북아메리카</option>
                        <option>남아메리카</option>
                        <option>유럽</option>
                        <option>오세아니아</option>
                    </select>
                    <div className="invalid-feedback">필수항목입니다</div>
                </div>
            </div>

            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    국가명
                </label>
                <div className="col-sm-9">
                    <input type="text" name="countryName" className={`form-control ${nameValid ? "is-valid" : ""}`} 
                    value={country.countryName}
                    onChange={changeStringValue}
                    />
                    <div className="valid-feedback">올바른 형식입니다</div>
                    <div className="invalid-feedback">한글로만 작성 가능합니다</div>
                </div>
            </div>

            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    수도명
                </label>
                <div className="col-sm-9">
                    <input type="text" name="countryCapital" className="form-control" 
                    value={country.countryCapital}
                    onChange={changeStringValue}
                    />
                    <div className="invalid-feedback">한글로만 작성 가능합니다</div>
                </div>
            </div>

            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    인구수
                </label>
                <div className="col-sm-9">
                    <input type="text" inputmode="numeric" name="countryPopulation" className="form-control" 
                     value={country.countryPopulation}
                    onChange={changeNumericValue}
                    />
                    <div className="invalid-feedback">0 이상의 숫자를 입력해주세요</div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col text-end">
                    <button type="submit" className="btn btn-primary">신규 국가 등록하기</button>
                </div>
            </div>


        </>
    );
}

export default Exam03