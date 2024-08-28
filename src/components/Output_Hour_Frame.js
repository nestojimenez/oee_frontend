import React, { useEffect } from "react";

//Set up the use of the Reducer
import { useSelector } from "react-redux/es/hooks/useSelector";

const Output_Hour_Frame = () => {
  //const output = [150, 155, 110, 210, 180, 190, 210, 210, 225, 250, 250, 250 ]

  const cycleTime = useSelector((state) => state.product.cycle_time);
  //console.log(cycleTime);

  const target = 3600 / cycleTime;

  const output_hour = useSelector((state) => state.output_hour);
  const shift_selected = useSelector((state) => state.shift.shift_selected);
  //console.log(shift_selected);
  //console.log(output_hour);

  let outputArray = [];

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Here we are going to check the shift selected and then we are going to push the hours to the outputArray
//according to the shift selected ////////////////////////////////////////////////////////////////////////
  if (shift_selected === "First Shift" || shift_selected === "Third Shift") {
    //console.log("First Shift");
    for (let i = 7; i < 19; i++) {
      outputArray.push(output_hour[i]);
    }
  } else {
    for (let i = 19; i < 24; i++) {
      outputArray.push(output_hour[i]);
    }
    for (let i = 0; i < 7; i++) {
      outputArray.push(output_hour[i]);
    }
  }

  //console.log(outputArray);
////////////////////////////////////////////////////////////////////////////////////////////////////////////


  return (
    <div className="output-hours-frame">
      {output_hour &&
        outputArray.map((hour, index) => {
          return (
            <div key={index} className="output-target" index={index}>
              <p>{`${hour}/${target}`}</p>
            </div>
          );
        })}
    </div>
  );
};

export default Output_Hour_Frame;
