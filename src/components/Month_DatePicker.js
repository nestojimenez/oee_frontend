import React, {useState} from "react";
import Weekday_DatePicker from "./Weekday_DatePicker";
import Day_DatePicker from "./Day_DatePicker";

import { useSelector } from "react-redux/es/hooks/useSelector";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const Month_DatePicker = () => {

  const monthSelected = months.indexOf(`${useSelector((state) => state.date.month)}`);
  const yearSelected = (`${useSelector((state) => state.date.year)}`);
  const [daySelectedArray, setDaySelectedArray] = useState([]);

  //console.log(yearSelected)
  
  const getWeeksForMonth = (month, year) => {
    const firstOfMonth = new Date(year, month, 1);
    //console.log(firstOfMonth)
    const firstDayOfWeek = firstOfMonth.getDay();
    //console.log(firstDayOfWeek)
    const weeks = [[]];

    const WEEK_LENGTH = 7;

    let currentWeek = weeks[0];
    let currentDate = firstOfMonth;

    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    while (currentDate.getMonth() === month) {
      if (currentWeek.length === WEEK_LENGTH) {
        currentWeek = [];
        weeks.push(currentWeek);
      }

      currentWeek.push(currentDate);
      currentDate = new Date(year, month, currentDate.getDate() + 1);
    }

    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    //console.log("Moth Weeks", weeks);
    return weeks; //Month Weeks
  };

  const weeks = getWeeksForMonth(monthSelected, yearSelected);

  const weekDaysMarkup = weekdays.map((weekday) => {
    return (
      <Weekday_DatePicker
        key={weekday}
        title={abbreviationFromWeekday(weekday)}
        label={weekday}
      />
    );
  });

  const renderWeek = (fullDate, dayIndex) => {
    
    if (fullDate == null) {
      return <Day_DatePicker key={dayIndex} />;
    }
    //const date = fullDate.getDate();
    //console.log(fullDate.getDate())
    return <Day_DatePicker key={dayIndex} fullDate={fullDate} />; //Rendering each day of the week
  };

  //
  const weekMarkup = weeks.map((week, index) => {
    //Week is every week of the month
    //console.log("Print Week", week);
    return (
      <div role="row" className="Week" key={index}>
        {week.map((day, i) => renderWeek(day, i))}
      </div>
    );
  });

  return (
    <>
      <div className="WeekdayContainer">{weekDaysMarkup}</div>
      <div>{weekMarkup}</div>
    </>
  );
};

function abbreviationFromWeekday(weekday) {
  return weekday.substring(0, 2);
}

export default Month_DatePicker;
