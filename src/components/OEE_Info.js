import React from "react";
import { useSelector } from "react-redux";
import LineChart from "./LineChart";
import MultiChart from "./MultiChart";

const OEE_Info = () => {
  const oee_shift = "85%";

  //selector for the dt_hour
  const dt_hour = useSelector((state) => state.dt);

  //Sort array by hour
  dt_hour.sort((a, b) => {
    if (a.hour === b.hour) {
      return 0;
    } else {
      return a.hour < b.hour ? -1 : 1;
    }
  });

  console.log(dt_hour);

  return (
    <div className="station-info">
      <MultiChart />
    </div>
  );
};

/*

<p className="station">SHIFT OEE</p>
<p className="station-name">
        <span style={{ paddingRight: "5px" }}>
          <i className="bi bi-rocket"></i>
        </span>
        {oee_shift}
      </p>
<ul style={{ fontSize: "15px" }}>
        {`Availability by hour:`}
        {dt_hour.map((dt) => {
          return (
            <>
              
              <li key={dt.hour} style={{ fontSize: "10px" }}>
                {`${dt.hour} Hrs. ${(
                  100 -
                  100 * (dt.dt / 3600).toFixed(2)
                ).toFixed(2)}%`}
              </li>
            </>
          );
        })}
      </ul>
*/

export default OEE_Info;
