import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";

//const CT = 5;
const SLOWPEED = 65;

const startShiftObject = {
  id: 0,
  id_products: 7,
  id_stations: 7,
  created_at: "2023-11-14T08:00:00.000Z",
  updated_at: "2023-11-14T08:00:00.000Z",
  id_dt_reason: null,
  dt_reason: null,
  dummy: null,
  LEAD_created_at: "",
};

//Const that will come as prop o redux
const start_time = "08";
const end_time = "09";
const id = "7";

//create an array call shift that will have string numbers from 7 to 19
const shift = [
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
];
/* "9",
"10",
"11",
"12",
"13",
"14",
"15",
"16",
"17",
"18",*/
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
//take shift array and put a cero at the begingin of the string number with just one digit
const shift_build = shift.map((item) => {
  if (item.length === 1) {
    return "0" + item;
  } else {
    return item;
  }
});
//console.log(shift_build);

const DownTimePareto = () => {

  //Load from redux product selected CT
  const cycleTime = useSelector((state) => state.product.cycle_time);

  //Load from redux state dateSelected
  const dateSelected = useSelector((state) => state.date);
  const currentStation = useSelector((state) => state.station);
  //console.log("Current Date", currentStation);

  //create a state for the data
  const [data, setData] = useState([]);
  const [dtToGraph, setDtToGraph] = useState([]);

  //create a fetch function that use this api /machine_performance/date_range/:start_time/:end_time/:date/:id that use the start_time and end_time date and id and returns the data on an array
  const fetchDownTimeGraph = (start_time, end_time, date, id) => {
    fetch(
      `/machine_performance/date_range/${start_time}/${end_time}/${date}/${id}`
    )
      .then((res) => res.json())
      .then((data) => { 
        //set the data to the state
        console.log("Data from fetch", data);
        if (data.length === 0) {
          //If shift is empty

          const newStr =
            start_time === "10" ? start_time : start_time.replace("0", ""); //take current day and remove the cero at the beggining
          //console.log("New string", newStr);
          const startTime = parseInt(newStr); //parse to int
          //console.log("Start time for start shift ", startTime);
          startShiftObject.created_at = new Date(
            dateSelected.year,
            months.indexOf(dateSelected.month) - 1,
            dateSelected.day,
            startTime - 8
          ).toISOString();

          startShiftObject.LEAD_created_at = new Date(
            dateSelected.year,
            months.indexOf(dateSelected.month) - 1,
            dateSelected.day,
            startTime - 7
          ).toISOString();

          const newData = {
            ...startShiftObject,
            seconds: 3600,
            shift_hour: start_time,
          };

          setData((prevData) => {
            return [...prevData, newData];
          }); //set the data to the state to render
          return;
        } else {
          //Get created_at from first element of query to add an element at the beggining of the our to get time elapsed from the beginig of the shift to the firts element of the query
          //console.log("Start time for query ", start_time);
          const newStr =
            start_time === "10" ? start_time : start_time.replace("0", ""); //take current day and remove the cero at the beggining
          //console.log("New string", newStr);
          const startTime = parseInt(newStr); //parse to int
          //console.log("Start time for start shift ", startTime);
          startShiftObject.created_at = new Date(
            dateSelected.year,
            months.indexOf(dateSelected.month) - 1,
            dateSelected.day,
            startTime - 8
          ).toISOString();
          startShiftObject.LEAD_created_at = data[0].created_at;
          data = insertObject(startShiftObject, data);
          data = modifyLastObject(
            data,
            new Date(
              dateSelected.year,
              months.indexOf(dateSelected.month) - 1,
              dateSelected.day,
              startTime - 7
            ).toISOString()
          );
          const newData = data.map((item) => {
            const seconds = timeDifferenceSeconds(item);
            return { ...item, seconds: seconds, shift_hour: start_time }; //insert seconds and our shift to the object
          });

          setData((prevData) => {
            return [...prevData, ...newData];
          }); //set the data to the state to render
          //console.log("Data ben query", data);
        }
      })
      .catch((err) => console.log(err));
  };

  //create a function that substract date and return the difference on seconds
  const timeDifferenceSeconds = (data) => {
    const date1 = new Date(data.created_at);
    const date2 = new Date(data.LEAD_created_at);
    const difference = date2.getTime() - date1.getTime();
    const seconds = difference / 1000;
    //console.log(seconds);
    return seconds;
  };

  //create function that inserts an object at the begining of the array, input will be new object and array to be modified
  const insertObject = (newObject, array) => {
    const newArray = [newObject, ...array];
    return newArray;
  };

  //create a function what will modified a key element of an object on tha last item of the array, key element is LEAD_created_at
  const modifyLastObject = (array, LEAD_created_at) => {
    const newArray = array.map((item, index) => {
      if (index === array.length - 1) {
        item.LEAD_created_at = LEAD_created_at;
        return item;
      } else {
        return item;
      }
    });
    return newArray;
  };

  //create a react component to put on table data returned from the fetch function
  const DownTimeGraphData = ({ data }) => {
    //console.log(data);
    return (
      <table>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.id_products}</td>
              <td>{item.id_stations}</td>
              <td>{item.created_at}</td>
              <td>{item.LEAD_created_at}</td>
              <td>{item.seconds}</td>
              <td>{item.shift_hour}</td>
              <td>{item.dt_reason}</td>
            </tr>
          );
        })}
      </table>
    );
  };

  //create a function that will convert day, month and year to a single string with the format YYYYMMDD
  const dateToString = (year, month, day) => {
    month = months.indexOf(month);

    if (day.length === 1) {
      day = "0" + day;
    } else {
      day = day;
    }

    if (Number(month) <10) {
      month = "0" + month;
    } else {
      month = month;
    }

    const dateString = year + month + day;
    return dateString;
  };

  //create a function that returns an array with the unique values dt_reason field from the data
  const dtReasons = (data) => {
    const reasons = data.map((item) => item.dt_reason);
    const uniqueReasons = [...new Set(reasons)];
    console.log(uniqueReasons);
    return uniqueReasons;
  };

  //create an array of objects that has the sum of the seconds of each hour of the shift
  const dtHourSeconds = (data) => {
    //create a function that take dt_hour array of objects and replace null value with 'No reason' string
    const replaceNull = (array) => {
      const newArray = array.map((item) => {
        if (item.dt_reason === null || item.dt_reason === undefined) {
          item.dt_reason = "No reason";
          return item;
        } else {
          return item;
        }
      });

      console.log(newArray);
      return newArray;
    };
    data = replaceNull(data);

    console.log(dtReasons(data));
    const dt_reason = dtReasons(data);
    const dt_hour = [];
    for (let i = 0; i < dt_reason.length; i++) {
      const hour = data.filter(
        (item) =>
          item.dt_reason === dt_reason[i] && item.seconds > cycleTime + (SLOWPEED - cycleTime)
      ); //Filtes by hour and by second between CT and - CT-SLOWPEED

      const seconds = hour.reduce((acc, item) => acc + item.seconds, 0);
      dt_hour.push({ hour: dt_reason[i], dt: (Number(seconds)/3600).toString()}); //push hour and seconds to the array, second converted to hours
    }
    console.log(dt_hour);
    
    //create function that order from highest to lowest using hour as reference insise the array of objects
    const orderArray = (array) => {
      const newArray = array.sort((a, b) => {
        if (a.dt > b.dt) {
          return -1;
        }
        if (a.dt < b.dt) {
          return 1;
        }
        return 0;
      });
      return newArray;
    };

    return orderArray((dt_hour));
  };


  //////////////////////////Chart Data configurarion///////////////////////////////
  const chartData = {
    labels: dtHourSeconds(data).map((dat) => {
      console.log(dat.hour);
      return dat.hour;
    }),
    datasets: [
      {
        label: `Down Time Pareto ${dateSelected.day} - ${dateSelected.month} - ${dateSelected.year}`,
        data: dtHourSeconds(data).map((data) => {
          return data.dt;
        }),
        borderColor: "red",
        backgroundColor: "red",
      },
    ],
  };

  useEffect(() => {
    setData([]);
    const date = dateToString(
      dateSelected.year,
      dateSelected.month,
      dateSelected.day
    );
    //console.log(date);
    shift_build.forEach((item, index) => {
      fetchDownTimeGraph(item, shift_build[index + 1], date, currentStation.id);
    });
    //fetchDownTimeGraph(start_time, end_time, date, id);
  }, [dateSelected, currentStation]);

  return (
    <div>
      {data.length === 0 ? <h1>Loading...</h1> : null}
      {/*<DownTimeGraphData data={data} style={{ background: "white" }} />*/}
      <Bar data={chartData} />
    </div>
  );
};

export default DownTimePareto;
