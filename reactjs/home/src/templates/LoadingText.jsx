//React Bootstrap의 Placeholder를 더 편하게 사용할 수 있도록 만든 컴포넌트

import { el } from "date-fns/locale";
import { Placeholder } from "react-bootstrap";

export default function LoadingText(
    {
        value,
        width = "auto",
        height = "1em",
        line = 1
    }
){
    if(value === undefined){
        return(
            <Placeholder as="span" animation="glow" style={
                {
                    display : "inline-flex",
                    flexDirection : "column",
                    gap : "0.25em",
                    width : width,
                }
            }>
                {/* line에 들어있는 숫자만큼의 크기를 가지는 배열을 만들어서 map을 사용 */}
                {Array.from({ length : line }).map((_, index)=>(
                    <Placeholder key={index} style={
                        {
                            display: "block",
                            width: width,//외부에서 전달된 width를 설정
                            minHeight: height
                        }
                    }/>
                ))}
            </Placeholder>
        )
    }
    else{
        return <span style={
            {
                display: "inline-block",
                height: height
            }
        }>{value}</span>;
    }
}