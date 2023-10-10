import React, { Suspense, useEffect, useState } from "react";
import TimeFrame from "./TimeFrame";
import ProducePart from "./ProducePart";

//Set up the use of the Reducer
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { outputHour } from "../redux";

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

const Hour_Frame = ({ hour, update, index }) => {
  const cycleTime = 11.0;
  const [hourData, setHourData] = useState([]);
  const [colorData, setColorData] = useState([]);
  const [secondsProduce, setSecondsProduce] = useState([]);

  //Variable to store IDs of all TimeFrames
  const [timeFrameId, setTimeFrameId] = useState([]);
  //Variable to store all dt reasons
  const [dtReason, setDtReason] = useState([]);

  const dispatch = useDispatch();

  //Load from redux state dateSelected
  const dateSelected = useSelector((state) => state.date);
  //console.log(dateSelected);
  //console.log(dateSelected);

  /////Load from redux state output_hour
  const output_hour = useSelector((state) => state.output_hour);
  //Load stations selected
  const stationId = useSelector((state) => state.station.id);

  //useSelector of activate variable that changes everytime a DT reason is enter
  const activate = useSelector((state) => state.load_downtime.activate);

  //Date for the query of machine perfomarmace table "20230922"
  const day =
    dateSelected.day < 10 ? `0${dateSelected.day}` : `${dateSelected.day}`;
  const month =
    months.indexOf(dateSelected.month) < 10
      ? `0${months.indexOf(dateSelected.month)}`
      : `${months.indexOf(dateSelected.month)}`;
  //console.log(`${dateSelected.year}${month}${day}`)

  //Set options fot API
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let startHour, endHour;

  useEffect(() => {
    setColorData([]);
    setHourData('');
    setTimeFrameId([]);
    setSecondsProduce([]);
    setColorData([]);
    setDtReason([]);

    (async () => {

      if (hour < 10) {
        startHour = `0${hour}`;
        endHour = `0${hour + 1}`.slice(-2, 3);
      } else {
        startHour = `${hour}`;
        endHour = `${hour + 1}`;
      }

      let res = await fetch(
        `/machine_performance/date_range/${startHour}/${endHour}/${dateSelected.year}${month}${day}/${stationId}`,
        options
      );
      //console.log(`/machine_performance/date_range/${startHour}/${endHour}/${dateSelected.year}${month}${day}/${stationId}`);
      let data = await res.json();

      if (data.length !== 0) {
        let sumSeconds = 0;
        let arraySum = [];
        //Define shift series start time
        //console.log(new Date(data[0].created_at).getMinutes());
        //console.log(new Date(data[0].created_at).getSeconds());
        //console.log(data[0].created_at);
        const start =
          new Date(data[0].created_at).getMinutes() * 60 +
          new Date(data[0].created_at).getSeconds();
        //console.log("Shift start Time", start);

        //Update qty per hour (output_hour)////////////////////////////////////////
        //console.log(output_hour);
        let newOutputHour = output_hour;
        newOutputHour[hour] = parseInt(data.length);

        dispatch(outputHour(newOutputHour));
        //console.log(output_hour);

        ///////////////////////////////////////////////////////////////////////////

        //Pop up last item on array since there is no LEAD_create_at field is empty
        data.pop();
        //console.log(data);
        ////////////////////////////////////////////////////
        ///Calculate all parts time elapsed between them

        data.map((dat, index) => {
          let timeSeconds = 0;
          
          timeSeconds =
            (new Date(dat.LEAD_created_at) - new Date(dat.created_at)) / 1000;
          //Add start time to first part made, this part need to be revie
          if (index === 0 && start > cycleTime) {
            //console.log(start);
            timeSeconds = timeSeconds + start;
          }
          //Sumatoria de los segundos transcurridos para posicionar las partes producidas
          sumSeconds = sumSeconds + timeSeconds; //- 0.06; //Invstigar si este factor de resta funciona para alineas las partes producidas con el tiempo entre piezas
          arraySum.push(Math.trunc(sumSeconds).toString());

          setHourData((arr) => [...arr, timeSeconds]); //Push into hourData the time eleapsed for each part
          setTimeFrameId((arr) => [...arr, dat.id]); //Push frameId into usestate variable

          if (dat.dt_reason) {
            setDtReason((arr) => [...arr, dat.dt_reason]);
          } else {
            setDtReason((arr) => [...arr, ""]);
          }

          //Push color for each time elapsed
          if (Number(timeSeconds) < Number(cycleTime)) {
            setColorData((arr) => [...arr, "green"]);
          } else if (
            Number(cycleTime) < Number(timeSeconds) &&
            Number(timeSeconds) < 50
          ) {
            setColorData((arr) => [...arr, "yellow"]);
          } else {
            //Review if tiem frame has a DT reason loaded
            if (dat.dt_reason) {
              setColorData((arr) => [...arr, "#A52A2A"]);
            } else {
              setColorData((arr) => [...arr, "red"]);
            }
          }
        });
        //Update state variable to render part produce
        setSecondsProduce(arraySum);

        //console.log("Array with secondproduce", hourData.length);
        //Calculate the total amount of time where product input have been made and calculate vs current time in order to apply red waiting for the new product enter
        //The idea here is to fill with red the fields that has no data
        let sum = 0;
        let suma = [];
        hourData.forEach((num) => {
          sum += num;
          suma.push(sum);
        });
        if (hour === 11) {
          console.log(suma);
          console.log("My hour data", hourData, sum);
          hourData.forEach((dat, index) => {
            if (dat > 5) {
              console.log(dat, index);
            }
          });
        }

        const today = new Date();
        const currentHour = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        const totalSeconds = minutes * 60 + seconds;

        //console.log(sum);
        //console.log(totalSeconds);

        //Add red to incomplete hour that already pass/////
        if (sum < 3550 && hour !== currentHour) {
          setHourData((arr) => [...arr, 3600 - sum]);
          setColorData((arr) => [...arr, "red"]);
        }
        ///////////////////////////////////////////////////////////////
        //Add red to a current hour where no product has been enter
        if (sum < 3550 && sum < totalSeconds - 50 && hour === currentHour) {
          //console.log(totalSeconds - sum);
          setHourData((arr) => [...arr, totalSeconds - sum]);
          setColorData((arr) => [...arr, "red"]);
        }
      } else {
        const today = new Date();
        const currentHour = today.getHours();
        const currentMinutes = today.getMinutes();
        const currentSeconds = today.getSeconds();
        const totalSeconds = currentMinutes * 60 + currentSeconds;
        if (hour < currentHour) {
          setHourData((arr) => [...arr, 3600]);
          setColorData((arr) => [...arr, "red"]);
        } else if (hour === currentHour) {
          setHourData((arr) => [...arr, totalSeconds]);
          setColorData((arr) => [...arr, "red"]);
        }
      }

      /////////////////////////////////////////////////////////
    })();
  }, [stationId, update, dateSelected, activate]);

  return (
    <div className="container">
      <div className="rectangle">
        {hourData.length !== 0 ? (
          hourData.map((hour, index) => {
            return (
              <TimeFrame
                key={index}
                durationSecs={hour}
                bgColor={colorData[index]}
                timeFrameId={timeFrameId[index]}
                dtReason={dtReason[index]}
              />
            );
          })
        ) : (
          <></>
        )}
      </div>
      <div className="parts-rectangle">
        {hourData.length !== 0 && timeFrameId.length !== 0 ? ( //Review if time frame id exist, if not this red bar is part of another red bar with id
          hourData.map((time, index) => {
            return (
              <ProducePart
                key={index}
                producePartTime={secondsProduce[index]}
              />
            );
          })
        ) : (
          <>No data</>
        )}
      </div>
    </div>
  );
};

export default Hour_Frame;
