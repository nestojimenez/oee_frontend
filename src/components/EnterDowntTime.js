import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { load_downTime } from "../redux";

const EnterDowntTime = () => {
  const dispatch = useDispatch();

  //UseSelector for load_donwtime redux
  const load_donwtime = useSelector((state) => state.load_downtime.activate);
  const x = useSelector((state) => state.load_downtime.x);
  const y = useSelector((state) => state.load_downtime.y);
  const dtFrame_id = useSelector((state) => state.load_downtime.dtFrame_id);

  //Useselector for station, to know what stations is been use on the app
  const station_id = useSelector((state) => state.station.id);
  console.log(station_id);

  const [dtReasons, setDtReasons] = useState(["No data found"]); //useState for downtime reasons
  const [reasonSelected, setReasonSelected] = useState("No reason");
  const [reasonId, setReasonId] = useState(2500);

  console.log(load_donwtime, x, y, dtFrame_id);

  let style = load_donwtime
    ? {
        display: "inline",
        top: y,
        left: x,
      }
    : {
        display: "none",
      };

  const cancel = () => {
    const activate = !load_donwtime;
    dispatch(load_downTime({ activate: activate, x: x, y: y }));
  };

  function subtractHours(date, hours) {
    date.setHours(date.getHours() - hours);

    return date;
  }

  const addMachinePerformance = () => {
    console.log(station_id);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      id_products: "5",
      id_stations: station_id.toString(),
      created_at: subtractHours(new Date(), 8),  //7 para horario de verano y 8 para horario de invierno
      updated_at: subtractHours(new Date(), 8),
      id_dt_reason: reasonId,
      dt_reason: reasonSelected,
      dummy: 1,
    });

    //toISOString().toLocaleString("en-US", {timeZone: 'America/Tijuana', hour12:false}),
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("/machine_performance_with_dt_reason", requestOptions)
      .then((response) => response.text())
      //.then((result) => console.log(result))
      .catch((error) => console.log("error", error));

      fetch("/machine_performance_with_dt_reason", requestOptions)
      .then((response) => response.text())
      //.then((result) => console.log(result))
      .catch((error) => console.log("error", error));
      
  };

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  /////////////////////////////////////////////////////////////////
  const updateDownTime = () => {
    if (dtFrame_id) {
      console.log(dtFrame_id);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        id: dtFrame_id,
        id_dt_reason: reasonId,
        dt_reason: reasonSelected,
      });

      //toISOString().toLocaleString("en-US", {timeZone: 'America/Tijuana', hour12:false}),
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("/downtime_reasons/update", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      

      dispatch(load_downTime({ activate: !load_donwtime, x: x, y: y }));
    } else if (!dtFrame_id) {
      console.log("Aqui estoy");
      addMachinePerformance();

      dispatch(load_downTime({ activate: !load_donwtime, x: x, y: y }));
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////
  const onChange = (e) => {
    //Make a function that takes a string and trim it on the first space found and return all what is after the space
    const trimString = (str) => {
      let newStr = "";
      for (let i = 0; i < str.length; i++) {
        if (str[i] === " ") {
          newStr = str.slice(i + 1);
          break;
        }
      }
      return newStr;
    }

    //console.log(trimString(e.target.value));
    //console.log(e.target.value);
    //console.log(e.target.value.split(",")[1].trimStart());
    setReasonId(e.target.value.split(" ")[0]);
    //console.log(e.target.value.split(" ")[0]);
    //setReasonSelected(e.target.value.split(",")[1].trimStart());
    setReasonSelected(trimString(e.target.value));
  };

  useEffect(() => {
    (async () => {
      let res = await fetch(`/downtime_reasons/${station_id}`, options);
      let data = await res.json();
      console.log("Transaction: ", data);
      setDtReasons(data);
    })();
  }, [station_id]);

  return (
    <div>
      <div className="downtime-frame" style={style}>
        Enter DownTime {dtFrame_id}
        <select className="button-24" onChange={onChange}>
          {dtReasons.map((dat, index) => {
            return (
              <option key={index}>
                {dat.id} {dat.dt_reasons}
              </option>
            );
          })}
        </select>
        <button className="button-24" onClick={updateDownTime}>
          Enter Down Time
        </button>
        <button className="button-24" onClick={cancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EnterDowntTime;
