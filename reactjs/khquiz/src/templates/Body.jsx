import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import PostList from "../components/Post/PostList";



export default function Body(){
    return(<>
    <Routes>
        <Route path="/" element={<Home/>}/>

        {/* 익명게시판 */}
        <Route path="/anonymous" element={<PostList/>}/>

    </Routes>


    </>)
}