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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, ClipboardList, LogOut, CalendarCheck, Menu, X } from "lucide-react";

export default function WorkerLayout({ children, setSelectedTab }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-tr from-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-20">
        <h2 className="text-xl font-bold text-indigo-700">👩‍⚕ ASHA Worker</h2>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar with sliding animation */}
      <div className={`fixed inset-0 z-10 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <aside className="w-64 bg-white shadow-md p-6 flex flex-col h-full">
          <div className="md:hidden flex justify-end mb-4">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1">
            <h2 className="hidden md:block text-xl font-bold text-indigo-700 mb-6">👩‍⚕ ASHA Worker</h2>
            
            <nav className="space-y-4">
              <button
                onClick={() => handleTabClick("dashboard")}
                className="flex items-center gap-3 w-full text-left p-3 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <CalendarCheck size={20} />
                <span>Home</span>
              </button>
              
              <button
                onClick={() => handleTabClick("add")}
                className="flex items-center gap-3 w-full text-left p-3 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <PlusCircle size={20} />
                <span>Add Patient</span>
              </button>
              
              <button
                onClick={() => handleTabClick("mypatients")}
                className="flex items-center gap-3 w-full text-left p-3 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <ClipboardList size={20} />
                <span>My Patients</span>
              </button>
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left p-3 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </aside>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 p-4 md:p-8 overflow-y-auto transition-all duration-300 ${mobileMenuOpen ? 'ml-64' : 'ml-0'}`}>
        {children}
      </main>
    </div>
  );
}
