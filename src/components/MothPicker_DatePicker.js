import React from "react";

import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { loadDate } from "../redux";

const MothPicker_DatePicker = () => {

//Load station and loadStation
const day = useSelector((state) => state.date.day);
const month = useSelector((state) => state.date.month);
const year = useSelector((state) => state.date.year);
//console.log("Current day", day, month, year);
const dispath = useDispatch();

const selectMonth = (e) => {
    console.log(e.target.value)
  
    const date = {day:day, month:e.target.value, year:year}
    //console.log(date.month)
    dispath(loadDate(date))
}

const selectYear = (e) => {
  //console.log(e.target.value)
  const date = {day:day, month:month, year:e.target.value}
  //console.log(date.month)
  dispath(loadDate(date))
}

  return (
    <div>
      <select className='months-picker' name="moths" id="months" onChange={selectMonth} value={month}>
        <option className="select-option" value="January">January</option>
        <option className="select-option" value="February">February</option>
        <option className="select-option" value="March">March</option>
        <option className="select-option" value="April">April</option>
        <option className="select-option" value="May">May</option>
        <option className="select-option" value="June">June</option>
        <option className="select-option" value="July">July</option>
        <option className="select-option" value="August">August</option>
        <option className="select-option" value="September">September</option>
        <option className="select-option" value="October">October</option>
        <option className="select-option" value="November">November</option>
        <option className="select-option" value="December">December</option>
      </select>
      <select className='year-picker' name="year" id="year" onChange={selectYear} value={year}>
        <option className="select-option" value="2022">2022</option>
        <option className="select-option" value="2023">2023</option>
        <option className="select-option" value="2024">2024</option>
      </select>
    </div>
  );
};

export default MothPicker_DatePicker;
