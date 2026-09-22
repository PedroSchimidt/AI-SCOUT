import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { checkBackendHealth } from "./api/health";
import { useGameStore } from "./store/gameStore";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { SquadPage } from "./pages/SquadPage";
import { ScoutingPage } from "./pages/ScoutingPage";
import { TacticsPage } from "./pages/TacticsPage";
import { MatchPage } from "./pages/MatchPage";
import { AssistantPage } from "./pages/AssistantPage";

function RequireCareer({ children }: { children: React.ReactNode }) {
  const career = useGameStore((s) => s.career);
  if (!career) return <Navigate to="/welcome" replace />;
  return children;
}

export default function App() {
  const setBackendOnline = useGameStore((s) => s.setBackendOnline);

  useEffect(() => {
    checkBackendHealth().then(setBackendOnline);
    const id = window.setInterval(() => {
      checkBackendHealth().then(setBackendOnline);
    }, 30_000);
    return () => clearInterval(id);
  }, [setBackendOnline]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<LandingPage />} />
        <Route
          element={
            <RequireCareer>
              <AppShell />
            </RequireCareer>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="squad" element={<SquadPage />} />
          <Route path="scouting" element={<ScoutingPage />} />
          <Route path="tactics" element={<TacticsPage />} />
          <Route path="match" element={<MatchPage />} />
          <Route path="assistant" element={<AssistantPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
