import { NextPage } from "next";
import React, { useEffect, useState } from "react";

interface Props {
    isDone: any;
}

const Timer: NextPage<Props> = ({ isDone }) => {
    // 시간을 담을 변수
    const [count, setCount] = useState(0);

    // useEffect(() => {
    //     // 설정된 시간 간격마다 setInterval 콜백이 실행된다. 
    //     const id = setInterval(() => {
    //         // 타이머 숫자가 하나씩 줄어들도록
    //         setCount((count) => count - 1);
    //     }, 1000);

    //     // 0이 되면 카운트가 멈춤
    //     if (count === 0) {
    //         clearInterval(id);
    //     }
    //     return () => clearInterval(id);
    //     // 카운트 변수가 바뀔때마다 useEffecct 실행
    // }, [count]);



    useEffect(() => {
        // 설정된 시간 간격마다 setInterval 콜백이 실행된다. 
        const id = setInterval(() => {
            // 타이머 숫자가 하나씩 줄어들도록
            setCount((count) => count + 1);
        }, 10);
        // if (isDone) {
        //     clearInterval(id);
        // }
        console.log(isDone)
        if (isDone) {
            clearInterval(id);
        }


        return () => clearInterval(id);
        // 카운트 변수가 바뀔때마다 useEffecct 실행
    }, [count]);

    return (
        <div>
            <div style={{ color: "red" }}>{count / 100}</div>;
            <div style={{ color: "red" }}>{"isDone"}</div>
        </div>
    );
}

export default Timer;