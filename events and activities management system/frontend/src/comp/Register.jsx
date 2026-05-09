import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const navigate = useNavigate();

  const register = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      alert("Registered successfully");
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg border-0 rounded-4" style={{ width: "380px" }}>
        <div className="card-body p-4 bg-white rounded-4">

          <h3 className="text-center fw-bold mb-3">
            Student Registration
          </h3>

          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              placeholder="Enter name"
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              placeholder="Enter email"
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Register As</label>
            <select
              className="form-select"
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            className="btn btn-success w-100 mt-2"
            onClick={register}
          >
            Register
          </button>

          <p className="text-center mt-3 mb-0">
            Already have an account?{" "}
            <Link to="/" className="text-decoration-none">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
