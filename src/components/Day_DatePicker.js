import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { loadDate } from "../redux";

const Day_DatePicker = ({ fullDate }) => {
  const dispatch = useDispatch();

  const day = useSelector((state) => state.date.day);
  const month = useSelector((state) => state.date.month);
  const year = useSelector((state) => state.date.year);

  //const [className, setClassName] = useState('Day');
  const [updateClass, setUpdateClass] = useState(true);

  if (fullDate == null) {
    return <div className="EmptyStateDay"></div>;
  }

  const date_picker = fullDate.getDate();

  //Load day selected to state on Redux state
  const selectDay = (e) => {
    //console.log(e.target.value);

    const date = {
      day: `${e.target.value}`,
      month: month,
      year: year,
    };

    dispatch(loadDate(date));
    setUpdateClass(!updateClass);
  };

  //Style selected day
  let className = "Day";
  if (day === `${date_picker}`) {
    className = "Day-selected";
  } else {
    className = "Day";
  }

  //console.log(className);

  return (
    className && (
      <button className={className} onClick={selectDay} value={date_picker}>
        {date_picker}
      </button>
    )
  );
};

export default Day_DatePicker;
