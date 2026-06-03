import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { DriversPage } from "./pages/DriversPage";
import { DriverDetailPage } from "./pages/DriverDetailPage";
import { TeamsPage } from "./pages/TeamsPage";
import { RaceDetailPage } from "./pages/RaceDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/drivers/:driverNumber" element={<DriverDetailPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/race/:meetingKey" element={<RaceDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
