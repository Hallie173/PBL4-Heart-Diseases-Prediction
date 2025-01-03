import React, { useEffect, useState, useRef } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref, get, onValue, off, set } from "firebase/database";
import { app } from "../../setup/firebase";
import { getDataHealth, createHealthRecord } from "../../services/userService";

const ECG = ({ onDataUpdate }) => {
  const [ECGdata, setECGData] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [ecgType, setEcgType] = useState({});
  const isAPICalledRef = useRef(false); // Khởi tạo useRef tại đây

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
      if (!user) {
        signInWithPopup(getAuth(app), new GoogleAuthProvider()).catch((error) =>
          console.error("Google Sign-In error:", error)
        );
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (ECGdata.length > 1500) {
      setViewData(ECGdata.slice(ECGdata.length - 1500, ECGdata.length - 1));
    } else {
      setViewData(ECGdata);
    }
  }, [ECGdata]);

  const handleStartButton = () => {
    setIsRunning(true);

    const db = getDatabase(app);
    const stateRef = ref(db, "Data/FxhaovnQlHP8wJvCjvJPXb3U2ch2/run");
    const ecgDataRef = ref(db, "Data/FxhaovnQlHP8wJvCjvJPXb3U2ch2/ecg_data11");

    // Đặt state=1 lên Firebase
    set(stateRef, 1).catch((error) =>
      console.error("Error setting state:", error)
    );

    // Theo dõi liên tục stateRef trên Firebase
    onValue(stateRef, async (snapshot) => {
      const currentState = snapshot.val();

      // Chỉ gọi API nếu currentState === 0 và API chưa được gọi
      if (currentState === 0 && !isAPICalledRef.current) {
        isAPICalledRef.current = true; // Đánh dấu API đã được gọi

        try {
          const ecgDataSnapshot = await get(ecgDataRef);
          if (ecgDataSnapshot.exists()) {
            const data = ecgDataSnapshot.val();

            const rs = await getDataHealth({ ecg: data });
            setEcgType(rs);

            await createHealthRecord({ ecgData: data, ecgType: rs });

            const arr = data.split(",");
            setECGData(arr);
          } else {
            console.log("No ECG data available");
          }
        } catch (error) {
          console.error("Error fetching ECG data or calling APIs:", error);
        } finally {
          setIsRunning(false);
        }
      }
    });
  };

  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate(ecgType);
    }
  }, [ecgType, onDataUpdate]);

  let formatECG = viewData.map((value, index) => ({
    index: index + ECGdata.length,
    ECGValue: value,
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={formatECG}>
          <Line
            type="monotone"
            dataKey="ECGValue"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="index" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
      <button
        onClick={handleStartButton}
        disabled={isRunning}
        className="btn btn-success mx-5 mt-2 prepare-for-measure"
      >
        {isRunning ? "Running..." : "Start"}
      </button>
    </div>
  );
};

export default ECG;
