import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import AIInsights from "./pages/AIInsights";
import DailyActions from "./pages/DailyActions";
import UploadRecords from "./pages/UploadRecords";
import Timeline from "./pages/Timeline";
import Alerts from "./pages/Alerts";
import Family from "./pages/Family";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" toastOptions={{ className: 'font-sans' }} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="insights" element={<AIInsights />} />
          <Route path="actions" element={<DailyActions />} />
          <Route path="upload" element={<UploadRecords />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="family" element={<Family />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
