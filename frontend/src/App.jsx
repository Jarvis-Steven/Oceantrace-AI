import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MapView from "./pages/MapView";
import Evidence from "./pages/Evidence";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="map" element={<MapView />} />
          <Route path="evidence" element={<Evidence />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;