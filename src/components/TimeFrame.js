import React, { useEffect, useState } from "react";
import EnterDowntTime from "./EnterDowntTime";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { load_downTime } from "../redux";

const TimeFrame = ({ durationSecs, bgColor, timeFrameId, dtReason}) => {
  
  //UseSelector for load_donwtime redux
  const load_donwtime = useSelector((state) => state.load_downtime.activate);
  //console.log(load_donwtime);

  //Load dispatch for load_downTime
  const dispatch = useDispatch();

  const secondHour = 3600;
  //console.log('Duration in sec: ', durationSecs);
  const durationPercentage = Number(durationSecs) * 0.027810;
  //const durationPercentage = (100*(Number(durationSecs) / Number(secondHour)))-.003; //Probar este factor cuando no tengas piezas repetidas debido a cuando subes datos con el front end

  //Set options fot API
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const loadDowntTime = (e, bgColor) => {
    if (bgColor === "red" || bgColor === '#A52A2A') {
      //console.log("Load Downt Time", timeFrameId);
      (async () => {
        let res = await fetch(`/machine_performance/id/${timeFrameId}`, options);

        let data = await res.json();
        //console.log("Transaction: ", data);
      })();
      const activate = !load_donwtime;
      dispatch(load_downTime({ activate: activate, x: e.pageX, y: e.pageY, dtFrame_id:timeFrameId}));
    } else {
      //console.log("No Load");
    }
  };

  let style = {};

  if (bgColor === "red" || bgColor === '#A52A2A') {
    style = {
      width: `${durationPercentage}%`,
      backgroundColor: bgColor,
      cursor: "pointer",
    };
  } else {
    style = { width: `${durationPercentage}%`, backgroundColor: bgColor };
  }

  
  return (
    <div
      className="time-frame"
      style={style}
      onClick={(e) => loadDowntTime(e, bgColor)}
    >
      <p className="down-time-reason">
        <span className="tooltiptext">Createx a component to show information about DT</span>
        {dtReason} {timeFrameId}</p>
    </div>
  );
};

export default TimeFrame;
