import React, { useEffect, useState, useRef } from "react";
import Hour_Frame from "./Hour_Frame";
import { useSelector } from "react-redux";

const months = [
  "Empty",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Shift_Frame = () => {
 
  //useSelector for Shift Selected
  const shift_selected = useSelector((state) => state.shift.shift_selected);
  let currentShift = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

  if(shift_selected === 'First Shift' || shift_selected === 'Third Shift'){
    currentShift = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  }else if(shift_selected === 'Second Shift' || shift_selected === 'Fourth Shift'){
    currentShift = [19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6];
  }

  //const currentShift = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  //const reverse = currentShift.reverse();
  //7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19

  const [update, setUpdate] = useState(true);
  const useRefFirstHourProduct = useRef([]);

  //Load from redux state dateSelected
  const dateSelected = useSelector((state) => state.date);

  //Load stations selected
  const stationId = useSelector((state) => state.station.id);

  //Set options fot API
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  //Date for the query of machine perfomarmace table "20230922"
  const day =
    dateSelected.day < 10 ? `0${dateSelected.day}` : `${dateSelected.day}`;
  const month =
    months.indexOf(dateSelected.month) < 10
      ? `0${months.indexOf(dateSelected.month)}`
      : `${months.indexOf(dateSelected.month)}`;

  useEffect(() => {
    let intervalId = setInterval(() => {
      setUpdate(!update);
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [update]);

  let startHour, endHour;
  useEffect(() => {
    useRefFirstHourProduct.current = [];

    currentShift.map((hour, index) => {
      (async () => {
        console.log(hour);
        if (hour < 10) {
          startHour = `0${hour}`;
          endHour = `0${hour + 1}`.slice(-2, 3);
        } else {
          startHour = `${hour}`;
          endHour = `${hour + 1}`;
        }
        //console.log(startHour);
        //console.log(endHour);
        let res = await fetch(
          `/machine_performance/date_range/${startHour}/${endHour}/${dateSelected.year}${month}${day}/${stationId}`,
          //`/machine_performance/date_range/7/8/20231017/2`,
          options
        );

        let data = await res.json();
        //console.log(hour);
        useRefFirstHourProduct.current.push([data[0], hour]);

        console.log(useRefFirstHourProduct.current);
      })();
    });
  }, [update]);

  return (
    <div className="shift-frame">
      {currentShift.map((hour, index) => {
        return (
          <Hour_Frame
            key={index}
            hour={hour}
            update={update}
            firstProductByHour={useRefFirstHourProduct.current}
          ></Hour_Frame>
        );
      })}
    </div>
  );
};

export default Shift_Frame;
