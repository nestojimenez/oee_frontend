import React from "react";

import { useState, useRef } from "react";

import { CSVLink, CSVDownload } from "react-csv";
import { useSelector } from "react-redux";

const ToCSV = () => {
  const [csvData, setCsvData] = useState([]); //Data to send to CSV File
  const performanceData = useRef([]); //Data from API object = {shiftHour: ShiftHour, shift: Shift, total: Total, good: Good, scrap: Scrap, date: Date}

  const [update, setUpdate] = useState([]); //Update state

  const date = useSelector((state) => state.date); //Date selected
  const shift = useSelector((state) => state.shift); //Shift selected
  const station = useSelector((state) => state.station); //Station selected
  //console.log("date: ", date, "shift: ", shift, "station: ", station);

  //Months of the year
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

  const dayString = date.day < 10 ? `0${date.day}` : date.day; //convert day to day string of two characters
  const monthString =
    months.indexOf(date.month) < 10
      ? `0${months.indexOf(date.month)}`
      : months.indexOf(date.month); //convert month to month string of two characters

  const dateString = `${date.year}${monthString}${dayString}`; //Date string in format YYYYMMDD to be used in API
  //console.log("dateString: ", dateString);

  //Aks for data from API hour by hour of the selected shift and date
  const allShiftPerformaceData = async (shift_selected) => {
    let currentShift = []; //To define the hours of the shift selected
    //Set update to empty array
    performanceData.current = [];

    if (shift_selected === "First Shift" || shift_selected === "Third Shift") {
      currentShift = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]; //Day shift hours
    } else {
      currentShift = [19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6]; //Night shift hours
    }

    currentShift.map((hour, index) => {
      const hourShift = `${hour}:00 - ${hour + 1}:00`;
      const shift = shift_selected;
      let totalQty = 0;
      let goodQty = 0;
      let scrapQty = 0;
      const dateToCSV = date;
      //console.log(hourShift);

      fetch(
        `/machine_performance/date_range/${hour < 10 ? `0${hour}` : hour}/${
          hour + 1 < 10 ? `0${hour + 1}` : hour + 1
        }/${dateString}/${station.id}`
      )
        .then((response) => response.json())
        .then((data) => {
          totalQty = data.length;
          goodQty = data.filter((item) => item.passfail === 1).length;
          scrapQty = data.filter((item) => item.passfail === 0).length;
          //console.log("totalQty: ", totalQty);
          //console.log("goodQty: ", goodQty);
          //console.log("scrapQty: ", scrapQty);

          performanceData.current[index] = {
            shiftHour: hourShift,
            shift: shift,
            total: totalQty,
            good: goodQty,
            scrap: scrapQty,
            date: `${date.year}/${monthString}/${dayString}`,
          };

          if (index === 11) {
            setCsvData(performanceData.current);
          }
          //console.log("performanceData: ", performanceData.current);
        });
    });
  };

  const toCsv = async () => {
    await allShiftPerformaceData(shift.shift_selected);
    console.log("performanceData: ", performanceData.current);
  };

  return (
    <div>
     
      <CSVLink
        data={csvData}
        filename={`${dateString}_St${station.id}_${shift.shift_selected}.csv`}  //Filename of the CSV file
        asyncOnClick={true}
        onClick={toCsv}
      >
        Export CSV
      </CSVLink>
    </div>
  );
};

export default ToCSV;
