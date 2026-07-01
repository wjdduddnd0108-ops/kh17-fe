//import


//function
//- 외부에 설정된 속성을 받아오려면 props라는 것을 매개변수로 선언
// - props 안에서 내가 원하는 이름의 데이터를 꺼내서 사용 (없는 경우를 고려해야 할 수도 있음)
//- 구조 분해 할당을 사용하면 조금 더 직관적인 코드 구현이 가능
// function Jumbotron(props){
function Jumbotron({title="테스트 제목", content=""}) {

    return (
    <div className="row">
        <div className="col">
            <div className="p-4 bg-dark text-light rounded">
                <h1>{title}</h1>
                <p>{content}</p>
            </div>
        </div>
    </div>
    );
}

//export
export default Jumbotron;