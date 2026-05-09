import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("student");

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
    fetchEvents();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/profile", {
        headers: { Authorization: "Bearer " + token },
      });
      setAdmin(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/events", {
        headers: { Authorization: "Bearer " + token },
      });
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: "Bearer " + token },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const approve = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/event/approve/${id}`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      );
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const reject = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/event/reject/${id}`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      );
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/user/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  // ================= FILTER EVENTS =================
  const pendingEvents = events.filter((e) => e.status === "pending");
  const approvedEvents = events.filter((e) => e.status === "approved");
  const rejectedEvents = events.filter((e) => e.status === "rejected");

  // ================= FILTER USERS =================
  const filteredUsers = users
    .filter((u) => u.role === userType)
    .filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        {/* ================= SIDEBAR ================= */}
        <div className="col-2 bg-dark text-white p-4 d-flex flex-column">
          <h4 className="fw-bold mb-4">🛡 Admin</h4>
          <ul className="nav nav-pills flex-column gap-2">
            {[
              { tab: "dashboard", label: "📊 Dashboard" },
              { tab: "pending", label: "🟡 Pending Events" },
              { tab: "approved", label: "✅ Approved Events" },
              { tab: "rejected", label: "❌ Rejected Events" },
              { tab: "users", label: "👥 Users" },
              { tab: "profile", label: "👤 Profile" },
            ].map((item) => (
              <li key={item.tab}>
                <button
                  className={`nav-link text-start ${
                    activeTab === item.tab ? "active" : "text-white"
                  }`}
                  onClick={() => {
                    setActiveTab(item.tab);
                    if (item.tab === "users") fetchUsers();
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <button className="btn btn-outline-light mt-auto" onClick={logout}>
            Logout
          </button>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="col-10 bg-light p-4 overflow-auto">
          {/* ================= DASHBOARD ================= */}
          {activeTab === "dashboard" && (
            <>
              <h4 className="fw-bold mb-4">Dashboard Overview</h4>
              <div className="row">
                {[
                  { title: "Pending Events", count: pendingEvents.length, color: "warning" },
                  { title: "Approved Events", count: approvedEvents.length, color: "success" },
                  { title: "Rejected Events", count: rejectedEvents.length, color: "danger" },
                ].map((item) => (
                  <div key={item.title} className="col-md-4 mb-3">
                    <div className="card shadow border-0">
                      <div className="card-body">
                        <h6 className="text-muted">{item.title}</h6>
                        <h2 className={`fw-bold text-${item.color}`}>{item.count}</h2>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ================= PENDING ================= */}
          {activeTab === "pending" && (
            <>
              <h4 className="fw-bold mb-3">Pending Events</h4>
              <div className="row">
                {pendingEvents.map((e) => (
                  <div key={e._id} className="col-md-6 mb-3">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h6>{e.title}</h6>
                        <p className="small text-muted">{e.description}</p>
                        <button className="btn btn-sm btn-success me-2" onClick={() => approve(e._id)}>
                          Approve
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => reject(e._id)}>
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ================= APPROVED ================= */}
          {activeTab === "approved" && (
            <>
              <h4 className="fw-bold mb-3">Approved Events</h4>
              <div className="row">
                {approvedEvents.map((e) => (
                  <div key={e._id} className="col-md-6 mb-3">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h6>{e.title}</h6>
                        <p className="small text-muted">{e.description}</p>
                        <span className="badge bg-success">Approved</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ================= REJECTED ================= */}
          {activeTab === "rejected" && (
            <>
              <h4 className="fw-bold mb-3">Rejected Events</h4>
              <div className="row">
                {rejectedEvents.map((e) => (
                  <div key={e._id} className="col-md-6 mb-3">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h6>{e.title}</h6>
                        <p className="small text-muted">{e.description}</p>
                        <span className="badge bg-danger">Rejected</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ================= USERS ================= */}
          {activeTab === "users" && (
            <>
              <h4 className="fw-bold mb-3">User Management</h4>

              {/* STUDENT / FACULTY BUTTONS */}
              <div className="mb-3">
                <button
                  className={`btn me-2 ${userType === "student" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setUserType("student")}
                >
                  Students
                </button>

                <button
                  className={`btn ${userType === "faculty" ? "btn-info" : "btn-outline-info"}`}
                  onClick={() => setUserType("faculty")}
                >
                  Faculty
                </button>
              </div>

              {/* SEARCH */}
              <input
                className="form-control mb-3"
                placeholder={`Search ${userType}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {/* USERS TABLE */}
              <table className="table table-bordered table-hover shadow-sm">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th width="120">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No {userType} found
                      </td>
                    </tr>
                  )}

                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.role === "student" ? "bg-primary" : "bg-info"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* ================= PROFILE ================= */}
          {activeTab === "profile" && admin && (
            <div className="card shadow mx-auto" style={{ maxWidth: 450 }}>
              <div className="card-body">
                <h4 className="text-center mb-3">Admin Profile</h4>
                <p>
                  <b>Name:</b> {admin.name}
                </p>
                <p>
                  <b>Email:</b> {admin.email}
                </p>
                <p>
                  <b>Role:</b> {admin.role}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
