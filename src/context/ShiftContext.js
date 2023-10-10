import React, { createContext, useContext, useEffect, useState } from "react";

export const useShiftContext = ()=>{
    return useContext(ShiftContext);
}

export const ShiftContext = createContext();

const ShiftProvider = ({ children }) => {
  const [stations, setStations] = useState("");

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    (async () => {
      let res = await fetch("/stations", options);
      let data = await res.json();
      //console.log("Transaction: ", data);
      setStations(data);
    })();
  }, []);

  return (
    <ShiftContext.Provider stations={stations}>
      {children}
    </ShiftContext.Provider>
  );
};

export default ShiftProvider;
