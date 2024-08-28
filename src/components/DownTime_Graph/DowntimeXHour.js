import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  scales,
} from "chart.js";

import { Chart } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { color } from "chart.js/helpers";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
  //ChartDataLabels,
);

//const CT = 4;
const SLOWPEED = 30;

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

const DowntimeXHour = () => {
  //Load from redux product selected CT
  const cycleTime = useSelector((state) => state.product.cycle_time);
  console.log("cyclsdfdddsdf Time", cycleTime);
  //Load from redux state dateSelected
  const dateSelected = useSelector((state) => state.date);
  const currentStation = useSelector((state) => state.station);

  const [useData, setUseData] = useState([]);
  const [update, setUpdate] = useState(false);

  //create a function that will convert day, month and year to a single string with the format YYYYMMDD
  const dateToString = (year, month, day) => {
    month = months.indexOf(month);

    if (day.length === 1) {
      day = "0" + day;
    } else {
      day = day;
    }

    if (Number(month) < 10) {
      month = "0" + month;
    } else {
      month = month;
    }

    const dateString = year + month + day;
    return dateString;
  };

  //take shift array and put a cero at the begingin of the string number with just one digit
  const shift_build = shift.map((item) => {
    if (item.length === 1) {
      return "0" + item;
    } else {
      return item;
    }
  });

  //build data for downtime
  ////////Build data for performance graph/////////////////////
  const buildDataForDownTime = async (date, id) => {
    const performanceDataArray = await fetchDataPerformanceByHour(date, id);
    console.log(performanceDataArray);

    //function that sum seconds for each different shift_hour and return an array with the sum of seconds of actual run for each shift
    const sumShiftHours = (dataArray) => {
      return dataArray.reduce((acc, curr) => {
        if (acc[curr.shift_hour] && curr.seconds > SLOWPEED) {
          if (curr.shift_hour === "16") console.log(curr.seconds);

          acc[curr.shift_hour] += curr.seconds;
        } else if (curr.seconds < SLOWPEED) {
          if (curr.shift_hour === "8") console.log(curr.seconds);
          acc[curr.shift_hour] = curr.seconds;
        }
        return acc;
      }, {});
    };

    //An array of seconds per shift that machine has actually run
    console.log(sumShiftHours(performanceDataArray));

    //Make a function that counts all the same shift_hour elements on an array and place it into an array of objects
    const sumPartPerHour = (dataArray) => {
      return dataArray.reduce((acc, curr) => {
        if (acc[curr.shift_hour]) {
          acc[curr.shift_hour] += 1;
        } else {
          acc[curr.shift_hour] = 1;
        }
        return acc;
      }, {});
    };

    console.log(sumPartPerHour(performanceDataArray));
  };

  //create a function that substract date and return the difference on seconds
  const timeDifferenceSeconds = (data, index) => {
    const date1 = new Date(data.created_at);
    const date2 = new Date(data.LEAD_created_at);

    
    const difference = date2.getTime() - date1.getTime();
    const seconds = difference / 1000;
    console.log(seconds);
    return seconds;
  };

  //function that sum seconds for each different shift_hour and return an array with the sum of seconds for each shift
  const sumAllProductionTime = (dataArray) => {
    return dataArray.reduce((acc, curr) => {
      if (acc[curr.shift_hour] && curr.seconds < SLOWPEED) {
        if (curr.shift_hour === "7") console.log(curr.seconds);

        acc[curr.shift_hour] += curr.seconds;
      } else if (curr.seconds < SLOWPEED) {
        if (curr.shift_hour === "7") console.log(curr.seconds);
        acc[curr.shift_hour] = curr.seconds;
      }
      return acc;
    }, {});
  };

  /////////Get Data Performance using API and construct data to be graphed////////////
  const fetchDataPerformanceByHour = async (date, id) => {
    let i = 0;
    let dataArray = [];
    for await (const item of shift_build) {
      const response = await fetch(
        `/machine_performance/date_range/${item}/${
          shift_build[i + 1]
        }/${date}/${id}`
      );
      let data = await response.json();

      //Filter data where LEAD_created_at is not null
      data = data.filter((item) => item.LEAD_created_at !== null);
      //console.log("DATA Response", data);

      //Los datos son obtenidos, ahora se debe de hacer un map para agregar el shift_hour y los segundos de diferencia entre LEAD_created_at y created_at, considerendo que
      //la el momento en que la primera pieza fue creada, todo antes de eso es tiempo muerto
      data = data.map((item, index) => {
        return {
          ...item,
          shift_hour: shift[i],
          seconds: timeDifferenceSeconds(item, index),
        };
      });

      dataArray = [...dataArray, ...data];
      i++;
    }
    //console.log("DATA Response", dataArray);
    let newDataArray = dataArray.filter(
      (item) => item.LEAD_created_at !== null
    );

    //take newDataArray and sum all the seconds for each shift_hour
    newDataArray = sumAllProductionTime(newDataArray);
    

    //convert the object into an array of objects
    newDataArray = Object.keys(newDataArray).map((key) => {
      return {
        shift_hour: key,
        seconds: Math.trunc((3600 - newDataArray[key])/60), //3600 is the total seconds of an hour and production time is substracted from it to calculate DT, then divided by 60 to get minutes
      };
    });

    console.log("DATA Response", newDataArray);

    setUseData(newDataArray);

    return newDataArray;
  };

  useEffect(() => {
    ////s//etData([]);
    const date = dateToString(
      dateSelected.year,
      dateSelected.month,
      dateSelected.day
    );

    const id = currentStation.id;
    setUseData([]);

    //console.log(date);

    buildDataForDownTime(date, id);
  }, [dateSelected, currentStation, update]);

  const overChart = (e) => {
    console.log(e);
    setUpdate(!update);
  }


  //////////////////////////Chart Data configurarion///////////
  const chartData = {
    labels: useData.map((item) => item.shift_hour),

    datasets: [
      {
        type: "bar",
        label: `Down Time per Hour ${dateSelected.day} - ${dateSelected.month} - ${dateSelected.year}`,
        data: useData.map((item) => item.seconds),
        borderColor: "blue",
        backgroundColor: "blue",
      },
      /*{
        type: "line",
        label: `Parts by Shift ${dateSelected.day} - ${dateSelected.month} - ${dateSelected.year}`,
        data: useData.map((item) => item.parts),
        borderColor: "green",
        backgroundColor: "green",
      },
      {
        type: "bar",
        label: `Performance by Shift ${dateSelected.day} - ${dateSelected.month} - ${dateSelected.year}`,
        data: useData.map((item) => item.performance),
        borderColor: "red",
        backgroundColor: "red",
      },*/
    ],
  };

  const options = {
    // ...your other options...
    plugins: {
      datalabels: {
        align: "end",
        anchor: "end",
        formatter: (value, context) => {
          return value;
        },
        color: function (ctx) {
          // use the same color as the border
          return ctx.dataset.borderColor;
        },
        labels: {
          title: {
            font: {
              weight: "bold",
              size: 18,
            },
          },
          //value: {
          //color: 'green',

          //}
        },
      },
      legend: {
        labels: {
          font: {
            size: 18,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 18,
            weight: "bold",
            //family:'vazir'
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 18,
            weight: "bold",
            //family:'vazir'
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "80vw",
        position: "relative",
        paddingRight: "10%",
        paddingLeft: "10%",
      }}
    >
      {useData.length === 0 ? <h1>Loading...</h1> : null}
      {/*<PerformanceData data={useData} style={{ background: "white" }} />*/}
      {
        <Chart
          data={chartData}
          plugins={[ChartDataLabels]}
          options={options}
          onMouseOver={overChart}
        />
      }
    </div>
  );
};

export default DowntimeXHour;
