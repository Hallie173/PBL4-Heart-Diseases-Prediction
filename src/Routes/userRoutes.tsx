import { Route } from "react-router-dom";
import Heartrate from "../components/heartrate";
import Guide from "../components/Guide/Guide";
import Appointment from "../components/Appointment";
import LookUp from "../components/LookUp/LookUp";
import History from "../components/HistoryHealthRecord/history";
import EcgHistory from "../components/HistoryHealthRecord/EcgHistory";
import Account from "../components/Account/Account";
import MeasurePrepare from "../components/NewMeasure/MeasurePrepare";
import { userState } from "../redux/types/user.type";
import Chat from "../components/Chat/Chat";

const userRoutes = (Layouts: () => React.JSX.Element, user: userState) => {
  /* User Routes */
  return (
    <Route path="/" element={<Layouts />}>
      <Route index element={<Heartrate />} />
      <Route path="guide" element={<Guide />} />
      <Route
        path="appointment"
        element={<Appointment patient={user.account} />}
      />
      <Route path="look-up" element={<LookUp />} />
      <Route path="history" element={<History />} />
      <Route path="ecg-history" element={<EcgHistory />} />
      <Route path="account/*" element={<Account />} />
      <Route path="measure-prepare" element={<MeasurePrepare />} />
      <Route path="chat" element={<Chat />} />
    </Route>
  );
};

export default userRoutes;
