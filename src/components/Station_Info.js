import React, { useContext, useEffect, useState } from "react";

//Set up the use of the Reducer
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { loadStation } from "../redux";
import factoryAtlas from '../images/MachineAnalytics.jpg'

const Station_Info = () => {
  const [stations, setStations] = useState("");
  const [selectedStation, setSelectedStation] = useState({});

  //Load station and loadStation
  const station = useSelector((state) => state.station.st_name);
  //console.log("Current stations", station);
  const dispath = useDispatch();

  //Load hour output redux store
  const outputHour = useSelector((state)=> state.output_hour);
  const values = Object.values(outputHour);
  const shiftQuatity = values.reduce((accu, value)=> {
    return accu + value;
  },0)
  
  //console.log(outputHour)
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const getStationID = (e) => {
    const target = e.target.value;
    //console.log(target);

    const selectedStation = stations.filter((station) => {
      return station.st_name == target; //Get selected station, TO DO: re-reder with the selected station the rest of the page
    });

    stations.filter((station) => {
      return station.st_name == target;
    });
    setSelectedStation(selectedStation[0]);

    //Load station selected to Redux store, thru the dispatch method
    dispath(loadStation(selectedStation[0]));
    //console.log("Current stations", station);
  };

  useEffect(() => {
    (async () => {
      let res = await fetch("/stations", options);
      let data = await res.json();
      //console.log("Transaction: ", selectedStation);
      setStations(data);
      dispath(loadStation(data[0]));
    })();
  }, []);

  return (
    <div className="station-info">
      <img src={factoryAtlas} style={{width: '35%'}}></img>
      <p className="station">STATION</p>
      
      {stations ? (
        <div>
          {/*<p>{`${station}`}</p>*/}
          <select className="station-name" onChange={getStationID}>
            {stations.map((station, index) => {
              return (
                <option
                  key={index}
                  value={station.st_name}
                  className="station-name"
                >
                  {station.st_name}
                </option>
              );
            })}
          </select>
        </div>
      ) : (
        <p>No stations found</p>
      )}

      <p className="station">SHIFT QUANTITY</p>
      <p className="station-name">{shiftQuatity}</p>
    </div>
  );
};

export default Station_Info;
