import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import WorkerDashboard from "./pages/WorkerDashboard";
import DoctorDashboard from "./pages/DoctorDashboard"
import AddPatient from "./pages/AddPatient";
import MyPatients from "./pages/MyPatients";
import PatientDetails from "./pages/PatientDetails";
import LandingPage from "./pages/LandingPage";
import PatientDetailsForDoctor from "./pages/PatientDetailsForDoctor";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard/worker" element={<WorkerDashboard />} />
        
        <Route path="/dashboard/worker/add-patient" element={<AddPatient />} />
        
        <Route path="/dashboard/worker/my-patients" element={<MyPatients />} />
        <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
        <Route path="/dashboard/doctor/my-patients" element={<MyPatients />} />
        <Route path="/dashboard/worker/patient/:id" element={<PatientDetails />} />
                <Route path="/dashboard/doctor/patient/:id" element={<PatientDetailsForDoctor />} />
        <Route path="/" element={<LandingPage />} />

      </Routes>
    </BrowserRouter>
  );
}
export default App;
