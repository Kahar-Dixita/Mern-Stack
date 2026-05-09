import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      sessionStorage.setItem("token", res.data.token);

      if (res.data.role === "student") window.location.href = "/student";
      if (res.data.role === "faculty") window.location.href = "/faculty";
      if (res.data.role === "admin") window.location.href = "/admin";

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
  
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">

          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">

              <h3 className="text-center mb-4 fw-bold">
                College Event Management
              </h3>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary w-100 mt-2"
                onClick={login}
              >
                Login
              </button>

              <p className="text-center mt-3 mb-0">
                Don’t have an account?{" "}
                <Link to="/register" className="text-decoration-none">
                  Register
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
