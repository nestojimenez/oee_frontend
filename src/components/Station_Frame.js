import React from "react";
import Testing_Frame from "./Testing_Frame";
import Station_Info from "./Station_Info";
import OEE_Info from "./OEE_Info";
import Shift_Date from "./Shift_Date";
import DatePicker from "./DatePicker";

const Station_Frame = () => {
  return (
    <div className="station-frame">
      <Station_Info/>
      <OEE_Info />
      <Shift_Date />
    </div>
  );
};

export default Station_Frame;
