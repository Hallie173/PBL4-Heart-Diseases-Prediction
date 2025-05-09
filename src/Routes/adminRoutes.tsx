import { Route } from "react-router-dom";
import Manage from "../components/Manage/Manage";
import User from "../components/Account/User";
import Roles from "../components/Account/Roles";
import GroupRoles from "../components/Account/GroupRoles";
import HearthRecord from "../components/Manage/HealthRecord/HearthRecord";
import Statistic from "../components/Manage/Statistic/Statistic";
import Graph from "../components/Manage/Statistic/Graph";
import History from "../components/history";
import EcgHistory from "../components/HistoryHealthRecord.js/EcgHistory";
import Hospital from "../components/Manage/Hospital/Hospital";

const adminRoutes = (Layouts: () => React.JSX.Element) => {
  /* Admin Routes */
  return (
    <Route path="/manage" element={<Layouts />}>
      <Route index element={<Manage />} />
      <Route path="" element={<Manage />}>
        <Route path="user" element={<User />} />
        <Route path="roles" element={<Roles />} />
        <Route path="group-roles" element={<GroupRoles />} />
        <Route path="heart-record" element={<HearthRecord />} />
        <Route path="heart-record/:id" element={<History />} />
        <Route path="statistic" element={<Statistic />} />
        <Route path="statistic/:id" element={<Graph />} />
        <Route path="ecg-history" element={<EcgHistory />} />
        <Route path="hospital" element={<Hospital />} />
      </Route>
    </Route>
  );
};

export default adminRoutes;
