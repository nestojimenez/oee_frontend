import React, { useEffect, useState } from "react";
import Hour_Frame from "./Hour_Frame";
import Shift_Frame from "./Shift_Frame";
import Shift_Hours from "./Shift_Hours";
import Output_Hour_Frame from "./Output_Hour_Frame";
import Quater_Hour_Line from "./Quater_Hour_Line";
import { toPadding } from "chart.js/helpers";

const Shift_Hours_Frame = () => {

  return (
    <div className="shift-hours-frame">
      <Shift_Hours />
      <Shift_Frame/>
      <Output_Hour_Frame/>
      <Quater_Hour_Line marginLeft={"24.5%"} text={":15"} />
      <Quater_Hour_Line marginLeft={"49%"} text={":30"} />
      <Quater_Hour_Line marginLeft={"73.5%"} text={":45"} />
    </div>
  );
};

export default Shift_Hours_Frame;
