import React, { useEffect, useState } from "react";
import Hour_Frame from "./Hour_Frame";

const Shift_Frame = () => {
  const currentShift = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  //7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19

  const [update, setUpdate] = useState(true);

  useEffect(()=>{
    let intervalId = setInterval(()=>{
      setUpdate(!update)
    }, 10000)

    return(()=>{
      clearInterval(intervalId);
    })
  }, [update])
  


  return <div className="shift-frame">
    {currentShift.map((hour, index) => {
      return (<Hour_Frame key={index} hour={hour} update={update}></Hour_Frame>);
    })}
    </div>;
};

export default Shift_Frame;
