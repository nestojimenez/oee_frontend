import React from "react";
import { Form } from 'react-bootstrap';
import './css/DatePicker.css'
import Month_DatePicker from "./Month_DatePicker";
import MothPicker_DatePicker from "./MothPicker_DatePicker";

import { useSelector } from "react-redux/es/hooks/useSelector";

const DatePicker = () => {
  //console.log(useSelector((state)=> state.date))
  return (
    <div>
      <div className="row">
        <div className="col-md-4">
          <div className="DatePickerContainer">
            <div className="DatePickerContainer_Title">
              <MothPicker_DatePicker/>
            </div>
            <div className="SomeMonth"></div>
            <Month_DatePicker/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
