import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";

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
} from "chart.js";

import { Chart } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

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
const SLOWPEED = 65;

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
  "19",
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

const ScrapGraph = () => {
  //Load from redux product selected CT
  const cycleTime = useSelector((state) => state.product.cycle_time);
  //Load from redux state dateSelected
  const dateSelected = useSelector((state) => state.date);
  const currentStation = useSelector((state) => state.station);

  const [useData, setUseData] = useState([]);
  const [yieldHour, setYieldHour] = useState([]);
  const [parts, setParts] = useState([]);
  const [scrap, setScrap] = useState([]);

  //create a function that will convert day, month and year to a single string with the format YYYYMMDD
  const dateToString = (year, month, day) => {
    month = months.indexOf(month);

    if (day.length === 1) {
      day = "0" + day;
    } else {
      day = day;
    }

    //console.log(month);
    if (Number(month) < 10) {
      month = "0" + month;
    } else {
      month = month;
    }

    //console.log(month);
    const dateString = year + month + day;
    return dateString;
  };

  //create a function that substract date and return the difference on seconds
  const timeDifferenceSeconds = (data) => {
    const date1 = new Date(data.created_at);
    const date2 = new Date(data.LEAD_created_at);
    const difference = date2.getTime() - date1.getTime();
    const seconds = difference / 1000;
    console.log("secfsdfsdffdf", seconds);
    return seconds;
  };

  //take shift array and put a cero at the begingin of the string number with just one digit
  const shift_build = shift.map((item) => {
    if (item.length === 1) {
      return "0" + item;
    } else {
      return item;
    }
  });

  const fetchAllData = async (date, id) => {
    let i = 0;
    let dataArray = [];
    for await (const item of shift_build) {
      console.log(item);
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

    return newDataArray;
  };

  //Sum all parts per hoursdf
  const sumTotalPartPerHour = (dataArray) => {
    return dataArray.reduce((acc, curr) => {
      if (acc[curr.shift_hour]) {
        acc[curr.shift_hour] += 1;
      } else {
        acc[curr.shift_hour] = 1;
      }
      return acc;
    }, {});
  };

  const sumTotalScrapPerHour = (dataArray) => {
    return dataArray.reduce((acc, curr) => {
      if (acc[curr.shift_hour] && curr.passfail === 0) {
        acc[curr.shift_hour] += 1;
      } else if (curr.passfail === 0) {
        acc[curr.shift_hour] = 1;
      }
      return acc;
    }, {});
  };

  const calculateYieldPerHour = (totalPartsPerHour, totalScrapPerHour) => {
    return Object.keys(totalPartsPerHour).map((item) => {
      return {
        shift_hour: item,
        yield: Math.round(
          (100 * (totalPartsPerHour[item] - totalScrapPerHour[item])) /
            totalPartsPerHour[item]
        ),
      };
    });
  };

  //Fill completePerformaData with all the sifht_hours, seconds, parts and theoParts for shift with no parts
  const calculateYieldForNoProductionHours = (
    dataArray,
    totalPartsPerHour,
    totalScrapPerHour
  ) => {
    const newDataArray = [];
    let i = 0;
    for (let sft of shift) {
      console.log(sft);
      if (dataArray.find((item) => item.shift_hour === sft) === undefined) {
        console.log(shift[i]);
        newDataArray.push({
          shift_hour: shift[i],
          yield: 100,
          parts: 0,
          scrap: 0,
        });
      } else {
        console.log(shift[i]);
        newDataArray.push({
          shift_hour: shift[i],
          yield: dataArray.find((item) => item.shift_hour === sft).yield,
          parts: totalPartsPerHour[sft],
          scrap: totalScrapPerHour[sft],
        });
      }
      i++;
    }
    return newDataArray;
  };

  const calculateScrapDataForGraph = async (date, id) => {
    const response = await fetchAllData(date, id);
    console.log("Allsdf Dta", response);
    setUseData(response);

    const totalPartsPerHour = sumTotalPartPerHour(response);
    const totalScrapPerHour = sumTotalScrapPerHour(response);
    let yieldPerHour = calculateYieldPerHour(
      totalPartsPerHour,
      totalScrapPerHour
    );
    console.log(yieldPerHour);
    yieldPerHour = calculateYieldForNoProductionHours(
      yieldPerHour,
      totalPartsPerHour,
      totalScrapPerHour
    );

    setYieldHour(yieldPerHour);
    setParts(totalPartsPerHour);
    setScrap(totalScrapPerHour);

    console.log(totalPartsPerHour);
    console.log(totalScrapPerHour);
    console.log(yieldPerHour);
  };

  //create a react component to put on table data returned from the fetch function
  const AllData = ({ data }) => {
    ////console.log(data);
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
              <td>{item.passfail}</td>
            </tr>
          );
        })}
      </table>
    );
  };

  //////////////////////////Chart Data configurarion///////////
  const chartData = {
    labels: yieldHour.map((item) => item.shift_hour),

    datasets: [
      {
        type: "line",
        label: `Parts per hour ${dateSelected.day} - ${dateSelected.month} - ${dateSelected.year}`,
        data: yieldHour.map((item) => item.parts),
        borderColor: "green",
        backgroundColor: "green",
      },
      {
        type: "line",
        label: `Scrap per hour ${dateSelected.day} - ${dateSelected.month} - ${dateSelected.year}`,
        data: yieldHour.map((item) => item.scrap),
        borderColor: "red",
        backgroundColor: "red",
      },
      {
        type: "bar",
        label: `Yield per hour ${dateSelected.day} - ${dateSelected.month} - ${dateSelected.year}`,
        data: yieldHour.map((item) => item.yield),
        borderColor: "blue",
        backgroundColor: "blue",
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

  useEffect(() => {
    setUseData([]);
    const date = dateToString(
      dateSelected.year,
      dateSelected.month,
      dateSelected.day
    );
    const id = currentStation.id;
    console.log("Date", date);
    calculateScrapDataForGraph(date, id);
  }, [dateSelected, currentStation]);

  return (
    <div style={{width:'80vw', position:'relative', paddingRight:'10%', paddingLeft:'10%'}}>
      {useData.length === 0 ? <h1>Loading...</h1> : null}
      {/*<AllData data={useData} style={{ background: "white" }} />*/}
      {<Chart data={chartData} plugins={[ChartDataLabels]} options={options} />}
    </div>
  );
};

export default ScrapGraph;
