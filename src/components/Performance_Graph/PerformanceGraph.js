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

const PerformanceGraph = () => {
  //Load from redux product selected CT
  const cycleTime = useSelector((state) => state.product.cycle_time);
  console.log("cyclsdfdddsdf Time", cycleTime);
  //Load from redux state dateSelected
  const dateSelected = useSelector((state) => state.date);
  const currentStation = useSelector((state) => state.station);

  const [useData, setUseData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [update, setUpdate] = useState(false);

  //Take average of % Performance for the entire shift
  const averagePerformance = (dataArray) => {
    const sum = dataArray.reduce((acc, curr) => {
      return acc + curr.performance;
    }, 0);
    return sum / dataArray.length;
  }

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

  //create a function that substract date and return the difference on seconds
  const timeDifferenceSeconds = (data) => {
    const date1 = new Date(data.created_at);
    const date2 = new Date(data.LEAD_created_at);
    const difference = date2.getTime() - date1.getTime();
    const seconds = difference / 1000;
    console.log(seconds);
    return seconds;
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
      console.log(data);
      data = data.map((item) => {
        return {
          ...item,
          shift_hour: shift[i],
          seconds: timeDifferenceSeconds(item),
        };
      });

      dataArray = [...dataArray, ...data];
      i++;
    }
    console.log(dataArray);
    let newDataArray = dataArray.filter(
      (item) => item.LEAD_created_at !== null
    );

    setUseData(newDataArray);

    return newDataArray;
  };

  ////////Build data for performance graph/////////////////////
  const buildDataForPerformance = async (date, id) => {
    const performanceDataArray = await fetchDataPerformanceByHour(date, id);
    console.log(performanceDataArray);

    //function that sum seconds for each different shift_hour and return an array with the sum of seconds for each shift
    const sumShiftHours = (dataArray) => {
      return dataArray.reduce((acc, curr) => {
        if (acc[curr.shift_hour] && curr.seconds < SLOWPEED) {
          if (curr.shift_hour === "16") console.log(curr.seconds);

          acc[curr.shift_hour] += curr.seconds;
        } else if (curr.seconds < SLOWPEED) {
          if (curr.shift_hour === "8") console.log(curr.seconds);
          acc[curr.shift_hour] = curr.seconds;
        }
        return acc;
      }, {});
    };

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

    const theoreticalParts = (sumSeconds) => {
      const theoParts = {};
      for (let prop in sumSeconds) {
        console.log(prop, sumSeconds[prop]);
        theoParts[prop] = Math.floor(sumSeconds[prop] / cycleTime);
      }
      console.log(theoParts);
      return theoParts;
    };

    //Create a function that take 3 objects and create a new array of objects where each object includes properties from all objects
    const mergeObjects = (obj1, obj2, obj3) => {
      const newArray = [];
      for (let prop in obj1) {
        newArray.push({
          shift_hour: prop,
          seconds: obj1[prop],
          parts: obj2[prop],
          theoParts: obj3[prop],
        });
      }
      return newArray;
    };

    //Fill completePerformaData with all the sifht_hours, seconds, parts and theoParts for shift with no parts
    const fillCompletePerformaData = (dataArray) => {
      let i = 0;
      for (let sft of shift) {
        console.log(sft);
        if (dataArray.find((item) => item.shift_hour === sft) === undefined) {
          console.log(shift[i]);
          dataArray.push({
            shift_hour: shift[i],
            seconds: 0,
            parts: 0,
            theoParts: 0,
            performance: 100,
          });
        } else {
          dataArray.find((item) => item.shift_hour === sft).performance =
            Math.floor(
              (dataArray.find((item) => item.shift_hour === sft).parts /
                dataArray.find((item) => item.shift_hour === sft).theoParts) *
                100
            );
        }
        i++;
      }
      //sort completePerformaData by shift_hour
      const completePerformaData = dataArray.sort((a, b) => {
        return a.shift_hour - b.shift_hour;
      });
      return completePerformaData;
    };

    const sumSeconds = sumShiftHours(performanceDataArray);
    const sumPart = sumPartPerHour(performanceDataArray);
    const theoParts = theoreticalParts(sumSeconds);
    console.log(sumPart);
    console.log(sumSeconds);
    console.log(theoParts);

    let completePerformaData = mergeObjects(sumSeconds, sumPart, theoParts);
    console.log(completePerformaData);
    completePerformaData = fillCompletePerformaData(completePerformaData);
    console.log(completePerformaData);
    setPerformanceData(completePerformaData);

    const avgPerformance = averagePerformance(completePerformaData);  
    console.log(avgPerformance);
  };

  //////////////////////////Chart Data configurarion///////////
  const chartData = {
    labels: performanceData.map((item) => item.shift_hour),

    datasets: [
      {
        type: "line",
        label: `Theoretical Expected Parts by Shift ${dateSelected.day} - ${dateSelected.month} - ${dateSelected.year}`,
        data: performanceData.map((item) => item.theoParts),
        borderColor: "blue",
        backgroundColor: "blue",
      },
      {
        type: "line",
        label: `Parts by Shift ${dateSelected.day} - ${dateSelected.month} - ${dateSelected.year}`,
        data: performanceData.map((item) => item.parts),
        borderColor: "green",
        backgroundColor: "green",
      },
      {
        type: "bar",
        label: `Performance by Shift ${dateSelected.day} - ${dateSelected.month} - ${dateSelected.year}`,
        data: performanceData.map((item) => item.performance),
        borderColor: "red",
        backgroundColor: "red",
      },
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

  //create a react component to put on table data returned from the fetch function
  const PerformanceData = ({ data }) => {
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
              <td>{item.dummy}</td>
              <td>{item.seconds}</td>
              <td>{item.shift_hour}</td>
              <td>{item.dt_reason}</td>
            </tr>
          );
        })}
      </table>
    );
  };

  const overChart = (e) => {
    console.log(e);
    setUpdate(!update);
  }

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

    buildDataForPerformance(date, id);
  }, [dateSelected, currentStation, update]);

  return (
    <div style={{width:'80vw', position:'relative', paddingRight:'10%', paddingLeft:'10%'}}>
      {useData.length === 0 ? <h1>Loading...</h1> : null}
      {/*<PerformanceData data={useData} style={{ background: "white" }} />*/}
      {<Chart data={chartData} plugins={[ChartDataLabels]} options={options} onMouseOver={overChart}/>}
    </div>
  );
};

export default PerformanceGraph;
