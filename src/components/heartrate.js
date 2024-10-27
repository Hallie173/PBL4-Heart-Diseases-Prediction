import React from "react";
import ECG from "./ECG/ECG";

function Heartrate() {
  return (
    <div className="homepage">
      <div className="heartrate">
        <ECG className="ecg-graph"></ECG>
      </div>
    </div>
  );
}

export default Heartrate;
