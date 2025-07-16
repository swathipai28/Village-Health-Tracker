// // components/WorkerLayout.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { PlusCircle, ClipboardList, LogOut, CalendarCheck } from "lucide-react";

// export default function WorkerLayout({ children }) {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     navigate("/login");
//   };

//   return (
//     <div className="flex min-h-screen bg-gradient-to-tr from-blue-50 to-indigo-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-indigo-700 mb-6">
//             👩‍⚕️ ASHA Worker
//           </h2>
//           <nav className="space-y-4">
//             <button
//               onClick={() => navigate("/dashboard/worker/add-patient")}
//               className="flex items-center gap-3 text-gray-700 hover:text-indigo-600"
//             >
//               <PlusCircle size={20} />
//               Add Patient
//             </button>
//             <button
//               onClick={() => navigate("/dashboard/worker/my-patients")}
//               className="flex items-center gap-3 text-gray-700 hover:text-indigo-600"
//             >
//               <ClipboardList size={20} />
//               My Patients
//             </button>
//             <button
//               onClick={() => navigate("/dashboard/worker/followups")}
//               className="flex items-center gap-3 text-gray-700 hover:text-indigo-600"
//             >
//               <CalendarCheck size={20} />
//               Follow-ups
//             </button>
//           </nav>
//         </div>

//         {/* Logout */}
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-3 text-red-600 hover:text-red-800 mt-10"
//         >
//           <LogOut size={20} />
//           Logout
//         </button>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-8 overflow-y-auto">{children}</main>
//     </div>
//   );
// }
// components/WorkerLayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, ClipboardList, LogOut, CalendarCheck } from "lucide-react";

// WorkerLayout.jsx
export default function WorkerLayout({ children, setSelectedTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-blue-50 to-indigo-100">
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-indigo-700 mb-6">👩‍⚕ ASHA Worker</h2>
          <nav className="space-y-4">
             <button
              onClick={() => setSelectedTab("dashboard")}
              className="flex items-center gap-3 text-gray-700 hover:text-indigo-600"
            >
              <CalendarCheck size={20} />
              Home
            </button>
            <button
              onClick={() => setSelectedTab("add")}
              className="flex items-center gap-3 text-gray-700 hover:text-indigo-600"
            >
              <PlusCircle size={20} />
              Add Patient
            </button>
            <button
              onClick={() => setSelectedTab("mypatients")}
              className="flex items-center gap-3 text-gray-700 hover:text-indigo-600"
            >
              <ClipboardList size={20} />
              My Patients
            </button>
           
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-600 hover:text-red-800 mt-10"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}