import { Button } from "react-bootstrap";
import { countState } from "@src/utils/storage";
import { useAtom } from "jotai";

export default function TestLeft(){
    const [count, setCount] = useAtom(countState);//storage에 만든 jotai state

    return(<>
        <Button variant="primary" className="me-2"
            onClick={e=>setCount(count+1)}>+1</Button>
    </>)
}