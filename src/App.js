import "./App.css";
import Shift_Hours_Frame from "./components/Shift_Hours_Frame";
import Station_Frame from "./components/Station_Frame";
//import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import ShiftProvider from "./context/ShiftContext.js";

//Setup Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import EnterDowntTime from "./components/EnterDowntTime";
import DownTimeGraph from "./components/DownTime_Graph/DownTimeGraph.js";
import DownTimePareto from "./components/DownTime_Graph/DownTimePareto.js";
import PerformanceGraph from "./components/Performance_Graph/PerformanceGraph.js";
import ScrapGraph from "./components/Scrap_Graph/ScrapGraph.js";

function App() {
  function subtractHours(date, hours) {
    date.setHours(date.getHours() - hours);

    return date;
  }

  const addMachinePerformance = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      id_products: "7", //5 o 2
      id_stations: "7", //2
      created_at: subtractHours(new Date(), 8),
      updated_at: subtractHours(new Date(), 8),
      passfail: "0"
    });

    //toISOString().toLocaleString("en-US", {timeZone: 'America/Tijuana', hour12:false}),
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);

    fetch("/machine_performance", requestOptions)
      .then((response) => response.text())
      //.then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  setInterval(() => {
    //addMachinePerformance();
  }, 10000);
  //addMachinePerformance();
  return (
    <Provider store={store}>
      <div className="App">
        <ShiftProvider>
          <Station_Frame />
          <Shift_Hours_Frame />
          <EnterDowntTime />
        </ShiftProvider>
      </div>
      {<DownTimeGraph />}
      {<DownTimePareto/>}
      {<PerformanceGraph/>}
      {<ScrapGraph/>}
    </Provider>
  );
}

export default App;
