import React, { Suspense, useEffect, useState, useRef } from "react";
import TimeFrame from "./TimeFrame";
import ProducePart from "./ProducePart";

//Set up the use of the Reducer
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { clearDT, loadDT, outputHour, loadPerformance, clearPerformance  } from "../redux";



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

const Hour_Frame = ({ hour, update, firstProductByHour }) => {

  const cycleTime = useSelector((state) => state.product.cycle_time);
  console.log(cycleTime);
  //const cycleTime = 4.0;
  const [render, setReder] = useState(true);

  const useRefHourData = useRef([]);
  const useRefColorData = useRef([]);
  const useRefSecondProduce = useRef([]);
  const useRefTimeFrameId = useRef([]);
  const useRefIsDummy = useRef([]);
  const useRefPassFail = useRef([]);

  //Variable to store IDs of all TimeFrames
  //const [timeFrameId, setTimeFrameId] = useState([]);
  //Variable to store all dt reasons
  const useRefDtReason = useRef([]);

  const dispatch = useDispatch();

  //Load from redux state dateSelected
  const dateSelected = useSelector((state) => state.date);
  //console.log(dateSelected);
  /////Load from redux state output_hour
  const output_hour = useSelector((state) => state.output_hour);
  //Load stations selected
  const stationId = useSelector((state) => state.station.id);

  //useSelector of activate variable that changes everytime a DT reason is enter
  const activate = useSelector((state) => state.load_downtime.activate);

  //useSelector for dt by hour
  const dt_hour = useSelector((state) => state.dt);

  //useSelector for performance by hour
  const performance_hour = useSelector((state) => state.performance);

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

  for (let i in firstProductByHour) {
    if (firstProductByHour[i][0] === undefined) {
      firstProductByHour[i][0] = "";
    }
  }
  //Sort array by hour
  firstProductByHour.sort((a, b) => {
    if (a[1] === b[1]) {
      return 0;
    } else {
      return a[1] < b[1] ? -1 : 1;
    }
  });
  //console.log("FirstProductByHour", firstProductByHour);
  let startHour, endHour;

  useEffect(() => {
    useRefHourData.current = [];
    useRefColorData.current = [];
    useRefSecondProduce.current = [];
    useRefTimeFrameId.current = [];
    useRefDtReason.current = [];
    useRefIsDummy.current = [];
    useRefPassFail.current = [];
    dispatch(
      outputHour({
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0,
        16: 0,
        17: 0,
        18: 0,
      })
    );
    dispatch(clearDT());
    dispatch(clearPerformance());

    const currentDate = new Date();
    
    const isCurrentDate =
      dateSelected.day !== currentDate.getDate().toString() ||
      months[currentDate.getMonth() + 1] !== dateSelected.month
        ? false
        : true;
    console.log(isCurrentDate);

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

      //console.log(data);
      if (data.length !== 0) {
        let sumSeconds = 0;
        let arraySum = [];
        let isDummy = [];
        //Define shift series start time

        const start =
          new Date(data[0].created_at).getMinutes() * 60 +
          new Date(data[0].created_at).getSeconds();

        //Update qty per hour (output_hour)////////////////////////////////////////
        //console.log(output_hour);
        let newOutputHour = output_hour;
        newOutputHour[hour] = parseInt(data.length);
        //console.log(data.length);
        //console.log(newOutputHour);
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

          if (dat.dummy === null) {
            isDummy.push(0);
          } else {
            isDummy.push(dat.dummy);
          }

          //console.log(isDummy);

          //Push into hourData the time eleapsed for each part
          useRefHourData.current = [...useRefHourData.current, timeSeconds];

          //Push frameId into useref variable
          useRefTimeFrameId.current = [...useRefTimeFrameId.current, dat.id];

          //Push pass/fail into useref variable
          useRefPassFail.current = [...useRefPassFail.current, dat.passfail];

          if (dat.dt_reason) {
            useRefDtReason.current = [...useRefDtReason.current, dat.dt_reason];
          } else {
            useRefDtReason.current = [...useRefDtReason.current, ""];
          }

          //console.log("timeSeconds", timeSeconds);
          //Push color for each time elapsed
         
          if (Number(timeSeconds) < Number(cycleTime+1)) {
            useRefColorData.current = [...useRefColorData.current, "green"];
          } else if (
            Number(cycleTime) < Number(timeSeconds) &&
            Number(timeSeconds) < 60
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
        useRefIsDummy.current = isDummy;

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

        //Add red to incomplete hour that already pass or to current hour/////
        if (sum < 3550 /*&& hour !== currentHour*/ && useRefHourData.current) {
          if(hour === currentHour){
            console.log(hour); //Do nothing
            console.log(totalSeconds - sum);
            useRefHourData.current = [...useRefHourData.current, totalSeconds - sum];
          }else{ ///Add red to incomplete hour.
            console.log(hour);
            useRefHourData.current = [...useRefHourData.current, 3600 - sum - 5];
          }

          

          ///Look for the next available part, to se if it has DT reason loaded and asing it to this red bar that already pass
          const foundDtReason = firstProductByHour.filter(
            //Look for items that are not empty
            (element) => element[0] !== ""
          );

          const dt_reason = foundDtReason.find((element, index) => {
            return element[1] > hour;
          });

          if (dt_reason !== undefined) {
            //console.log(dt_reason);
            useRefDtReason.current = [
              ...useRefDtReason.current,
              dt_reason[0].dt_reason,
            ];

            if (dt_reason[0].dt_reason !== null) {
              useRefColorData.current = [...useRefColorData.current, "#A52A2A"];
            } else {
              useRefColorData.current = [...useRefColorData.current, "red"];
            }
          } else {
            useRefColorData.current = [...useRefColorData.current, "red"];
          }
        }

        ///////////////////////////////////////////////////////////////
        //Add red to a current hour where no product has been enter
        console.log(isCurrentDate)
        if (sum < 3550 && sum < totalSeconds - 50 && hour === currentHour && !isCurrentDate) {
          console.log(hour);
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
        
        if (hour < currentHour || !isCurrentDate) {
          console.log(hour);
          //setHourData((arr) => [...arr, 3600]);
          useRefHourData.current = [...useRefHourData.current, 3600];

          ///Look for the next available part, to se if it has DT reason loaded and asing it to this red bar that already pass
          const foundDtReason = firstProductByHour.filter(
            //Look for items that are not empty
            (element) => element[0] !== ""
          );

          //console.log(foundDtReason);

          const dt_reason = foundDtReason.find((element, index) => {
            return element[1] > hour;
          });

          if (dt_reason !== undefined && dt_reason.length !== 0) {
            //console.log(dt_reason);
            useRefDtReason.current = [
              ...useRefDtReason.current,
              dt_reason[0].dt_reason,
            ];
            if (dt_reason[0].dt_reason === null) {
              useRefColorData.current = [...useRefColorData.current, "red"];
            } else {
              useRefColorData.current = ["#A52A2A"];
            }
          } else {
            useRefColorData.current = [...useRefColorData.current, "red"];
          }

          //console.log("next hour product", nextHourFirstProduct);
        } else if (hour === currentHour) {
          console.log(hour);
          useRefHourData.current = [...useRefHourData.current, totalSeconds];
          useRefColorData.current = [...useRefColorData.current, "red"];
          useRefDtReason.current = [
            ...useRefDtReason.current,
            "TODO DT for last red, can be to enter a last part or to enter a DT reason at the end of the shift",
          ];

          ///Look for the next available part, to se if it has DT reason loaded and asing it to this red bar that already pass
          //const nextHourFirstProduct = firstProductByHour.find((element)=> Number(hour) === Number(element[1]));
          //console.log('next hour product', nextHourFirstProduct)
        }
      }

      //Calculate DT per hour
      let dtHour = 0;
      useRefHourData.current.map((num, index) => {
        if (
          useRefColorData.current[index] === "red" ||
          useRefColorData.current[index] === "#A52A2A"
        ) {
          dtHour += num;
        }
      });
      dispatch(loadDT(dtHour, hour));
      //console.log(dt_hour);
      /////////////////////////////////////////////////
      //Caculate Performance by Hour
      let performanceHour = 0;
      if (useRefSecondProduce.current.length !== 0) {
        //console.log(3600 - dtHour);
        performanceHour = (cycleTime * parseInt(data.length)) / (3600 - dtHour);
        //console.log(dtHour);
        //console.log(performanceHour, hour);
        dispatch(loadPerformance(performanceHour, hour));
      }else{
        dispatch(loadPerformance(1, hour));
      }
      
      //Activate redering///////////////////////////////
      setReder(!render);
      //console.log(useRefColorData);

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
                dtReason={useRefDtReason.current[index]}
              />
            );
          })
        ) : (
          <></>
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
                currentHour={hour}
                isDummy={useRefIsDummy.current[index]}
                passFail = {useRefPassFail.current[index]}
              />
            );
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Hour_Frame;
