import React from "react";

const OEE_Info = () => {
    const oee_shift = '85%'
  return (
    <div className="station-info">
      <p className="station">SHIFT OEE</p>
      <p className="station-name">
        <span style={{ paddingRight: "5px" }}>
          <i className="bi bi-rocket"></i>
        </span>
        {oee_shift}
      </p>
    </div>
  );
};

export default OEE_Info;
