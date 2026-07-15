import { Route, Routes } from "react-router-dom";
import BookList from "@components/book/BookList";

import Home from "@components/Home";
import NotFound from "@components/error/NotFound";

import CountryList from "@components/country/CountryList";
import CountryAdd from "@components/country/CountryAdd";
import CountryDetail from "@components/country/CountryDetail";
import CountryEdit from "@components/country/CountryEdit";
import CountrySearch from "@components/country/CountrySearch";
import CountryComplexSearch from "@components/country/CountryComplexSearch";

import Practice1Add from "@components/practice1/Practice1Add";
import Practice1Detail from "@components/practice1/Practice1Detail";
import Practice1List from "@components/practice1/Practice1List";
import Practice1Edit from "@components/practice1/Practice1Edit";

import BookAdd from "@components/book/BookAdd";
import BookDetail from "@components/book/BookDetail";
import BookEdit from "@components/book/BookEdit";
import BookSpa from "@components/book/BookSpa";

import AccountJoin from "@components/account/AccountJoin";
import AccountJoinFail from "@components/account/AccountJoinFail";
import AccountJoinSuccess from "@components/account/AccountJoinSuccess";
import AccountLogin from "@components/account/AccountLogin";

import TestMain from "@components/session/TestMain";


export default function Body(){
    return(<>
        <Routes>
            <Route path="/" element={<Home/>}/>               
                      
            <Route path="/country/list" element={<CountryList/>}/>               
            <Route path="/country/add" element={<CountryAdd/>}/>
            {/* 제일 마지막에 적혀있는 값을 countryNo라는 이름으로 관리하겠다 */}
            <Route path="/country/detail/:countryNo" element={<CountryDetail/>}/>
            <Route path="/country/edit/:countryNo" element={<CountryEdit/>}/>
            <Route path="/country/search" element={<CountrySearch/>}/>
            <Route path="/country/Complex" element={<CountryComplexSearch/>}/>
            

            <Route path="/practice1/list" element={<Practice1List/>}/> 
            <Route path="/practice1/add" element={<Practice1Add/>}/> 
            <Route path="/practice1/detail/:practice1No" element={<Practice1Detail/>}/> 
            <Route path="/practice1/edit/:practice1No" element={<Practice1Edit/>}/> 

            <Route path="/book/list" element={<BookList/>}/>   
            <Route path="/book/add" element={<BookAdd/>}/>  
            <Route path="/book/detail/:bookId" element={<BookDetail/>}/>  
            <Route path="/book/edit/:bookId" element={<BookEdit/>}/>  
            <Route path="/book/spa" element={<BookSpa/>}/>  

            {/* 회원 관련 */}
            <Route path="/account/join" element={<AccountJoin/>}/>
            <Route path="/account/joinSuccess" element={<AccountJoinSuccess/>}/>
            <Route path="/account/joinfail" element={<AccountJoinFail/>}/>
            <Route path="/account/login" element={<AccountLogin/>}/>


            {/* 세션테스트 */}
            <Route path="/session/test" element={<TestMain/>}/>


            {/* fallback route */}
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    </>)
}