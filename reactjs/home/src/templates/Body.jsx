import { Route, Routes } from "react-router-dom";
import BookList from "@components/book/BookList";

import Home from "@components/Home";

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
import MyPage from "@components/account/MyPage";
import AccountPassword from "@components/account/AccountPassword";
import AccountChange from "@components/account/AccountChange";
import AccountCart from "@components/account/AccountCart";

import TestMain from "@components/session/TestMain";
import Private from "@guard/Private";

import AdminUsers from "@components/admin/AdminUsers";
import AdminUsersScroll from "@components/admin/AdminUsersScroll";
import AdminDetail from "@components/admin/AdminDetail";
import AdminSaleAdd from "@components/admin/sale/AdminSaleAdd";

import Admin from "../guard/Admin";
import AccountBlock from "@components/error/AccountBlock";
import NotFound from "@components/error/NotFound";
import AccountNeedUpdate from "@components/account/AccountNeedUpdate";

import SaleList from "@components/sale/SaleList";
import SaleDetail from "@components/sale/SaleDetail";
import AdminSaleEdit from "@components/admin/sale/AdminSaleEdit";

import KakaopayBuySuccessVersion1 from "@components/pay/v1/KakaopayBuySuccessVersion1";
import KakaopayBuyVersion1 from "@components/pay/v1/KakaopayBuyVersion1";
import KakaopayBuyCancelVersion1 from "@components/pay/v1/KakaopayBuyCancelVersion1";
import KakaopayBuyFailVersion1 from "@components/pay/v1/KakaopayBuyFailVersion1";

import KakaopayBuyVersion2 from "@components/pay/v2/KakaopayBuyVersion2";
import KakaopayBuySuccessVersion2 from "@components/pay/v2/KakaopayBuySuccessVersion2";
import KakaopayBuyCancelVersion2 from "@components/pay/v2/KakaopayBuyCancelVersion2";
import KakaopayBuyFailVersion2 from "@components/pay/v2/KakaopayBuyFailVersion2";
import KakaopayBuyDetailVersion2 from "@components/pay/v2/KakaopayBuyDetailVersion2";

import WebSocketV1BasicClient from "@components/websocket/WebSocketV1BasicClient";

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
            <Route path="/account/mypage" element={<Private><MyPage/></Private>}/>
            <Route path="/account/password" element={<Private><AccountPassword/></Private>}/>
            <Route path="/account/change" element={<Private><AccountChange/></Private>}/>
            <Route path="/account/needUpdate" element={<Private><AccountNeedUpdate/></Private>}/>
            <Route path="/account/needUpdat" element={<Private><AccountNeedUpdate/></Private>}/>
            
            <Route path="/account/cart" element={<Private><AccountCart/></Private>}/>
            

            {/* 관리자 기능 */}
            <Route path="/admin/users" element={<Admin><AdminUsers/></Admin>}/>
            <Route path="/admin/users2" element={<Admin><AdminUsersScroll/></Admin>}/>
            <Route path="/admin/detail/:accountId" element={<Admin><AdminDetail/></Admin>}/>
            <Route path="/admin/saleEdit/:saleNo" element={<Admin><AdminSaleEdit/></Admin>}/>

            <Route path="/admin/saleAdd" element={<Admin><AdminSaleAdd/></Admin>}/>


            <Route path="/sale/list" element={<SaleList/>}/>
            <Route path="/sale/detail/:saleNo" element={<SaleDetail/>}/>




            {/* 세션테스트 */}
            <Route path="/session/test" element={<TestMain/>}/>

            {/* 결제 관련 */}
            <Route path="/pay/v1/buy" element={<KakaopayBuyVersion1/>}/>
            <Route path="/pay/v1/buy/success" element={<KakaopayBuySuccessVersion1/>}/>
            <Route path="/pay/v1/buy/cancel" element={<KakaopayBuyCancelVersion1/>}/>
            <Route path="/pay/v1/buy/fail" element={<KakaopayBuyFailVersion1/>}/>

            <Route path="/pay/v2/buy" element={<Private><KakaopayBuyVersion2/></Private>}/>
            <Route path="/pay/v2/buy/success/:purchaseNo" element={<Private><KakaopayBuySuccessVersion2/></Private>}/>
            <Route path="/pay/v2/buy/cancel" element={<Private><KakaopayBuyCancelVersion2/></Private>}/>
            <Route path="/pay/v2/buy/fail" element={<Private><KakaopayBuyFailVersion2/></Private>}/>
            <Route path="/pay/v2/buy/detail/:purchaseNo" element={<Private><KakaopayBuyDetailVersion2/></Private>}/>

            {/* 웹소켓 */}
            <Route path="/websocket/v1" element={<WebSocketV1BasicClient/>}/>

            {/* error */}
            <Route path="/account/block" element={<AccountBlock/>}/>

            {/* fallback route */}
            <Route path="*" element={<NotFound/>}/>




        </Routes>
    </>)
}