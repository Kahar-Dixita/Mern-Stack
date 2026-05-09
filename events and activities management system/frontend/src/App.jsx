import { useState } from 'react'
import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import './bootstrap-5.1.0-dist/css/bootstrap.min.css'
import './bootstrap-5.1.0-dist/js/bootstrap.bundle.js'
import { Routes, Route } from "react-router-dom";
import Register from './comp/Register.jsx';
import Login from './comp/Login.jsx';
import StudentDashboard from "./comp/student/StudentDashboard";
import FacultyDashboard from "./comp/faculty/FacultyDashboard";
import AdminDashboard from "./comp/admin/AdminDashboard";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* <Route path="/student" element={<StudentEvents />} /> */}
        {/* <Route path="/faculty" element={<CreateEvent />} />
        <Route path="/admin" element={<ApproveEvents />} /> */}
      </Routes>
    </>
  )
}

export default App
