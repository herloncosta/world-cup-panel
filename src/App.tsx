import { Routes, Route } from "react-router-dom"
import { Dashboard } from "./pages/Dashboard"
import { TeamPage } from "./pages/TeamPage"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/team/:teamName" element={<TeamPage />} />
    </Routes>
  )
}
