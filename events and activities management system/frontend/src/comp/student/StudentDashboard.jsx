import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function StudentDashboard() {

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("events");

  // Filters
  const [search, setSearch] = useState("");
  const [venueFilter, setVenueFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const token = sessionStorage.getItem("token");

  // ========================
  // INITIAL LOAD
  // ========================
  useEffect(() => {
    fetchProfile();
    fetchEvents();
  }, []);

  // ========================
  // AUTO APPLY FILTERS
  // ========================
  useEffect(() => {
    applyFilters();
  }, [search, venueFilter, dateFilter]);

  // ========================
  // FETCH PROFILE
  // ========================
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/student/profile",
        { headers: { Authorization: "Bearer " + token } }
      );
      setStudent(res.data);
    } catch {
      alert("Failed to load profile");
    }
  };

  // ========================
  // FETCH EVENTS
  // ========================
  const fetchEvents = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/student/events",
      { headers: { Authorization: "Bearer " + token } }
    );

    setEvents(res.data);
    setFilteredEvents(res.data);
  };

  // ========================
  // FETCH MY EVENTS
  // ========================
  const fetchMyEvents = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/student/my-events",
      { headers: { Authorization: "Bearer " + token } }
    );
    setMyEvents(res.data);
  };

  // ========================
  // SEARCH / FILTER API
  // ========================
  const applyFilters = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/student/search-events",
        {
          headers: { Authorization: "Bearer " + token },
          params: {
            search,
            venue: venueFilter,
            date: dateFilter
          }
        }
      );

      setFilteredEvents(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // ========================
  // RESET FILTERS
  // ========================
  const resetFilters = () => {
    setSearch("");
    setVenueFilter("");
    setDateFilter("");
    fetchEvents();
  };

  // Extract venues dynamically
  const venues = [...new Set(events.map(e => e.venue))];

  // ========================
  // REGISTER EVENT
  // ========================
  const registerEvent = async (eventId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/student/register/${eventId}`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      );
      alert(res.data.message);
    } catch {
      alert("Already registered");
    }
  };

  // ========================
  // LOGOUT
  // ========================
  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <span className="navbar-brand fw-bold">🎓 Student Portal</span>

        <div className="collapse navbar-collapse">

          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-white ${
                  activeTab === "events" && "fw-bold"
                }`}
                onClick={() => setActiveTab("events")}
              >
                Events
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => {
                  setActiveTab("myEvents");
                  fetchMyEvents();
                }}
              >
                My Registrations
              </button>
            </li>
          </ul>

          {student && (
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-white"
                  data-bs-toggle="dropdown"
                >
                  {student.name}
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setActiveTab("profile")}
                    >
                      Profile
                    </button>
                  </li>

                  <li><hr /></li>

                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          )}

        </div>
      </nav>

      {/* CONTENT */}
      <div className="container mt-4">

        {/* EVENTS */}
        {activeTab === "events" && (
          <>
            <h4 className="mb-3">Available Events</h4>

            {/* FILTER SECTION */}
            <div className="card p-3 mb-4 shadow-sm">
              <div className="row g-3">

                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={venueFilter}
                    onChange={(e) => setVenueFilter(e.target.value)}
                  >
                    <option value="">All Venues</option>
                    {venues.map((v, i) => (
                      <option key={i} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <input
                    type="date"
                    className="form-control"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>

                <div className="col-md-2">
                  <button
                    className="btn btn-secondary w-100"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                </div>

              </div>
            </div>

            {/* EVENTS LIST */}
            <div className="row">
              {filteredEvents.map(event => (
                <div key={event._id} className="col-md-4 mb-4">
                  <div className="card shadow h-100">
                    <div className="card-body">
                      <h5>{event.title}</h5>
                      <p>{event.description}</p>
                      <p><b>Date:</b> {event.date?.split("T")[0]}</p>
                      <p><b>Venue:</b> {event.venue}</p>
                    </div>

                    <div className="card-footer bg-white border-0">
                      <button
                        className="btn btn-success w-100"
                        onClick={() => registerEvent(event._id)}
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* MY EVENTS */}
        {activeTab === "myEvents" && (
          <>
            <h4 className="mb-3">My Registered Events</h4>

            {myEvents.length === 0 && (
              <p className="text-muted">
                You have not registered for any events.
              </p>
            )}

            <div className="row">
              {myEvents.map(item => (
                <div key={item._id} className="col-md-4 mb-4">
                  <div className="card border-success shadow h-100">
                    <div className="card-body">
                      <h5>{item.eventId.title}</h5>
                      <p>{item.eventId.description}</p>
                      <p><b>Date:</b> {item.eventId.date?.split("T")[0]}</p>
                      <p><b>Venue:</b> {item.eventId.venue}</p>

                      <span className="badge bg-success">
                        Registered
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && student && (
          <div className="card shadow mx-auto" style={{ maxWidth: 500 }}>
            <div className="card-body">
              <h4 className="text-center mb-3">Student Profile</h4>

              <p><b>Name:</b> {student.name}</p>
              <p><b>Email:</b> {student.email}</p>
              <p><b>Role:</b> {student.role}</p>

              <div className="text-center mt-3">
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveTab("events")}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
