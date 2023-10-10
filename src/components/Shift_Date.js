import React, { useEffect, useState } from "react";
import DatePicker from "./DatePicker";

const Shift_Date = () => {
  const [timestamp, setTimestamp] = useState(0);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const weekDays = [
    "No Day",
    "Monday",
    "Tuesday",
    "Wensday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const getTime = () => {
    let date = new Date();
    let localDate = (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: 'America/Tijuana'});
    const weekDay = weekDays[new Date().getDay()];
    //console.log(date);
    date = JSON.stringify(localDate);

    const yyMMDD = date.slice(1, 10);
    const time = date.slice(10, 22);
    date = weekDay + " " + yyMMDD + " " + time;
    //console.log(time);
    return date;
  };

  const onClick = ()=>{
    console.log('Date Clicked');
    setDatePickerVisible(!datePickerVisible);
  }

  useEffect(() => {
    setTimestamp(getTime);
    setInterval(() => {setTimestamp(getTime)}, 1000);
  }, []);

  return (
    <div className="station-info">
      <p className="station">SHIFT</p>
      <p className="station-name" onClick={onClick}>
        <span style={{ paddingRight: "5px" }}>
          <i className="bi bi-rocket"></i>
        </span>
        {timestamp}
      </p>
      {datePickerVisible && <DatePicker/>}
    </div>
  );
};

export default Shift_Date;
