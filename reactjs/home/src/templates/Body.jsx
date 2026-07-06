import { Route, Routes } from "react-router-dom";
import BookList from "../components/book/BookList";
import Practice1List from "../components/practice1/Practice1List";
import CountryList from "../components/country/CountryList";
import Home from "../components/Home";
import NotFound from "../components/error/NotFound";

export default function Body(){
    return(<>
        <Routes>
            <Route path="/" element={<Home/>}/>               
            <Route path="/book/list" element={<BookList/>}/>               
            <Route path="/country/list" element={<CountryList/>}/>               
            <Route path="/practice1/list" element={<Practice1List/>}/>  
            
            {/* fallback route */}
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    </>)
}