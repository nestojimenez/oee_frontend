import React from "react";

const ProducePart = ({ producePartTime, currentHour, isDummy, passFail }) => {
  console.log("Produce part time: ", passFail);
  const secondHour = 3600;
  const durationPercentage = Number(producePartTime) * 0.0276;
  //const durationPercentage = 100*(Number(producePartTime) / Number(secondHour));
  //console.log(isDummy);

  let backgroundColor = "red";

  if (passFail === 0) {
    backgroundColor = "red";
  } else {
    backgroundColor = 'rgb(0, 255, 64)';
  }

  const left = `${Number(durationPercentage)}%`;

  const style = {backgroundColor: backgroundColor, left: left, cursor: "pointer"}

  return producePartTime && isDummy === 0 ? (
    <div
      className="circle"
      style={style}
      //style={{ left: `${Number(durationPercentage)}%`, cursor: "pointer" }}
    ></div>
  ) : (
    <></>
  );
};

export default ProducePart;
