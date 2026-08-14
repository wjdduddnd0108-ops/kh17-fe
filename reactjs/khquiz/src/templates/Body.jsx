import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import PostList from "../components/Post/PostList";
import PostDetail from "../components/Post/PostDetail";
import PostWrite from "../components/Post/PostWrite";
import PostEdit from "../components/Post/PostEdit";



export default function Body(){
    return(<>
    <Routes>
        <Route path="/" element={<Home/>}/>

        {/* 익명게시판 */}
        <Route path="/anonymous" element={<PostList/>}/>
        <Route path="/anonymous/:postNo" element={<PostDetail/>}/>
        <Route path="/anonymous/add" element={<PostWrite/>}/>
        <Route path="/anonymous/:postNo/edit" element={<PostEdit/>}/>

    </Routes>


    </>)
}