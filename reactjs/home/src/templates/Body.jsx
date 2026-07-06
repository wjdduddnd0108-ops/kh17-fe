import { Route, Routes } from "react-router-dom";
import BookList from "../components/book/BookList";
import Practice1List from "../components/practice1/Practice1List";
import CountryList from "../components/country/CountryList";
import Home from "../components/Home";
import NotFound from "../components/error/NotFound";
import CountryAdd from "../components/country/CountryAdd";
import CountryDetail from "../components/country/CountryDetail";
import Practice1Add from "../components/practice1/Practice1Add";
import Practice1Detail from "../components/practice1/Practice1Detail";

export default function Body(){
    return(<>
        <Routes>
            <Route path="/" element={<Home/>}/>               
                      
            <Route path="/country/list" element={<CountryList/>}/>               
            <Route path="/country/add" element={<CountryAdd/>}/>
            {/* 제일 마지막에 적혀있는 값을 countryNo라는 이름으로 관리하겠다 */}
            <Route path="/country/detail/:countryNo" element={<CountryDetail/>}/>
            

            <Route path="/practice1/list" element={<Practice1List/>}/> 
            <Route path="/practice1/add" element={<Practice1Add/>}/> 
            <Route path="/practice1/detail/:practice1No" element={<Practice1Detail/>}/> 

            <Route path="/book/list" element={<BookList/>}/>   

            {/* fallback route */}
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    </>)
}