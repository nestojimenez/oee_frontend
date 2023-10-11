import React, { Suspense, useEffect, useState, useRef } from "react";
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

const Hour_Frame = ({ hour, update }) => {
  const cycleTime = 11.0;
  const [render, setReder] = useState(true);
  
  //const [hourData, setHourData] = useState([]);
  const [colorData, setColorData] = useState([]);
  //const [secondsProduce, setSecondsProduce] = useState([]);

  const useRefHourData = useRef([]);
  const useRefColorData = useRef([]);
  const useRefSecondProduce = useRef([]);
  const useRefTimeFrameId = useRef([]);

  //Variable to store IDs of all TimeFrames
  //const [timeFrameId, setTimeFrameId] = useState([]);
  //Variable to store all dt reasons
  const [dtReason, setDtReason] = useState([]);

  const dispatch = useDispatch();

  //Load from redux state dateSelected
  const dateSelected = useSelector((state) => state.date);
  

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
  

  //Set options fot API
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let startHour, endHour;

  useEffect(() => {
    useRefHourData.current = [];
    useRefColorData.current = [];
    useRefSecondProduce.current = [];
    useRefTimeFrameId.current = [];
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

      let data = await res.json();

      //console.log(data.length);
      if (data.length !== 0) {
        let sumSeconds = 0;
        let arraySum = [];
        //Define shift series start time

        const start =
          new Date(data[0].created_at).getMinutes() * 60 +
          new Date(data[0].created_at).getSeconds();

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
            timeSeconds = timeSeconds + start;
          }
          //Sumatoria de los segundos transcurridos para posicionar las partes producidas
          sumSeconds = sumSeconds + timeSeconds; //- 0.06; //Invstigar si este factor de resta funciona para alineas las partes producidas con el tiempo entre piezas
          arraySum.push(Math.trunc(sumSeconds).toString());

          //Push into hourData the time eleapsed for each part
          useRefHourData.current = [...useRefHourData.current, timeSeconds];

          //Push frameId into useref variable
          useRefTimeFrameId.current = [...useRefTimeFrameId.current, dat.id];

          if (dat.dt_reason) {
            setDtReason((arr) => [...arr, dat.dt_reason]);
          } else {
            setDtReason((arr) => [...arr, ""]);
          }

          //Push color for each time elapsed
          if (Number(timeSeconds) < Number(cycleTime)) {
            useRefColorData.current = [...useRefColorData.current, "green"];
          } else if (
            Number(cycleTime) < Number(timeSeconds) &&
            Number(timeSeconds) < 50
          ) {
            useRefColorData.current = [...useRefColorData.current, "yellow"];
          } else {
            //Review if tiem frame has a DT reason loaded
            if (dat.dt_reason) {
              useRefColorData.current = [...useRefColorData.current, "#A52A2A"];
            } else {
              useRefColorData.current = [...useRefColorData.current, "red"];
            }
          }
        });
        //Update state variable to render part produce

        useRefSecondProduce.current = arraySum;

        //Calculate the total amount of time where product input have been made and calculate vs current time in order to apply red waiting for the new product enter
        //The idea here is to fill with red the fields that has no data
        let sum = 0;
        useRefHourData.current.map((num) => {
          sum += num;
        });

        const today = new Date();
        const currentHour = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        const totalSeconds = minutes * 60 + seconds;

        //Add red to incomplete hour that already pass/////
        if (sum < 3550 && hour !== currentHour) {
          useRefHourData.current = [...useRefHourData.current, 3600 - sum - 5];
          useRefColorData.current = [...useRefColorData.current, "red"];
        }
        ///////////////////////////////////////////////////////////////
        //Add red to a current hour where no product has been enter
        if (sum < 3550 && sum < totalSeconds - 50 && hour === currentHour) {
          useRefHourData.current = [
            ...useRefHourData.current,
            totalSeconds - sum,
          ];

          useRefColorData.current = [...useRefColorData.current, "red"];
        }
      } else {
        const today = new Date();
        const currentHour = today.getHours();
        const currentMinutes = today.getMinutes();
        const currentSeconds = today.getSeconds();
        const totalSeconds = currentMinutes * 60 + currentSeconds;

        if (hour < currentHour) {
          //setHourData((arr) => [...arr, 3600]);
          useRefHourData.current = [...useRefHourData.current, 3600];
          useRefColorData.current = [...useRefColorData.current, "red"];
        } else if (hour === currentHour) {
          useRefHourData.current = [...useRefHourData.current, totalSeconds];
          useRefColorData.current = [...useRefColorData.current, "red"];
        }
      }

      if (hour === 7) {
        console.log("Data from seven", data);
      }

      setReder(!render);

      /////////////////////////////////////////////////////////
    })();
  }, [stationId, update, dateSelected, activate]);

  return (
    <div className="container">
      {/*useRefHourData.current.length*/}
      <div className="rectangle">
        {useRefHourData.current.length !== 0 ? (
          useRefHourData.current.map((hour, index) => {
            return (
              <TimeFrame
                key={index}
                durationSecs={hour}
                bgColor={useRefColorData.current[index]}
                timeFrameId={useRefTimeFrameId.current[index]}
                dtReason={dtReason[index]}
              />
            );
          })
        ) : (
          <>No Entro al if, se fue al else directo</>
        )}
      </div>

      <div className="parts-rectangle">
        {useRefHourData.current.length !== 0 &&
        useRefTimeFrameId.current.length !== 0 ? ( //Review if time frame id exist, if not this red bar is part of another red bar with id
          useRefHourData.current.map((time, index) => {
            return (
              <ProducePart
                key={index}
                producePartTime={useRefSecondProduce.current[index]}
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
