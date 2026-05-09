import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function FacultyDashboard() {

  const today = new Date().toISOString().split("T")[0];

  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    capacity: ""
  });

  const [selectedEventId, setSelectedEventId] = useState(null);

  const token = sessionStorage.getItem("token");

  // ========================
  // LOAD EVENTS
  // ========================
  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/faculty/my-events",
      {
        headers: { Authorization: "Bearer " + token }
      }
    );
    setEvents(res.data);
  };

  // ========================
  // CREATE / UPDATE EVENT
  // ========================
const createOrUpdateEvent = async () => {

  // ===== VALIDATION =====
  if (!form.title.trim()) {
    alert("Title is required");
    return;
  }

  if (!form.date) {
    alert("Date is required");
    return;
  }

  if (form.date < today) {
    alert("Past dates are not allowed");
    return;
  }

  if (!form.venue.trim()) {
    alert("Venue is required");
    return;
  }

  if (!form.capacity || form.capacity <= 0) {
    alert("Capacity must be greater than 0");
    return;
  }

  // ===== API CALL =====
  if (selectedEventId) {
    await axios.put(
      `http://localhost:5000/api/faculty/update/${selectedEventId}`,
      form,
      { headers: { Authorization: "Bearer " + token } }
    );
    alert("Event updated successfully");
  } else {
    await axios.post(
      "http://localhost:5000/api/faculty/create",
      form,
      { headers: { Authorization: "Bearer " + token } }
    );
    alert("Event sent for admin approval");
  }

  setForm({
    title: "",
    description: "",
    date: "",
    venue: "",
    capacity: ""
  });

  setSelectedEventId(null);
  fetchMyEvents();
  setActiveTab("events");
};



  // ========================
  // VIEW REGISTERED STUDENTS
  // ========================
  const viewStudents = async (id) => {
    const res = await axios.get(
      `http://localhost:5000/api/faculty/students/${id}`,
      { headers: { Authorization: "Bearer " + token } }
    );
    setStudents(res.data);
    setShowModal(true);
  };

  // ========================
  // DOWNLOAD CSV
  // ========================
  const downloadCSV = () => {
    let csv = "Name,Roll No,Department,Year\n";

    students.forEach(s => {
      csv += `${s.name},${s.rollNo},${s.department},${s.year}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "registered_students.csv";
    a.click();
  };

  const statusBadge = (status) => {
    if (status === "approved") return "success";
    if (status === "pending") return "warning";
    return "danger";
  };

 


  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <span className="navbar-brand fw-bold">
          Faculty Dashboard
        </span>

        <ul className="navbar-nav ms-4">
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link text-white ${activeTab === "events" && "fw-bold"}`}
              onClick={() => setActiveTab("events")}
            >
              My Events
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link btn btn-link text-white ${activeTab === "create" && "fw-bold"}`}
              onClick={() => setActiveTab("create")}
            >
              Create Event
            </button>
          </li>
        </ul>

        <button
          className="btn btn-light ms-auto"
          onClick={() => {
            sessionStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </nav>

      <div className="container mt-4">

        {/* ================= CREATE EVENT ================= */}
        {activeTab === "create" && (
          <div className="card shadow p-4">
            <h4>{selectedEventId ? "Edit Event" : "Create New Event"}</h4>

            <div className="row g-3 mt-2">

              <div className="col-md-6">
                <input className="form-control" placeholder="Event Title"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>

              <div className="col-md-6">
             <input
  type="date"
  className="form-control"
  min={today}
  value={form.date}
  onChange={e => setForm({ ...form, date: e.target.value })}
/>


              </div>

              <div className="col-md-6">
                <input className="form-control" placeholder="Venue"
                  value={form.venue}
                  onChange={e => setForm({ ...form, venue: e.target.value })} />
              </div>

              <div className="col-md-6">
                <input type="number" className="form-control" placeholder="Capacity"
                  value={form.capacity}
                  onChange={e => setForm({ ...form, capacity: e.target.value })} />
              </div>

              <div className="col-12">
                <textarea className="form-control" rows="3"
                  placeholder="Description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

            </div>

            <button className="btn btn-success mt-3" onClick={createOrUpdateEvent}>
              {selectedEventId ? "Update Event" : "Create Event"}
            </button>
          </div>
        )}

        {/* ================= MY EVENTS ================= */}
        {activeTab === "events" && (
          <>
            <h4 className="mb-3">My Created Events</h4>

            <div className="row">
              {events.map(event => (
                <div key={event._id} className="col-md-4 mb-4">
                  <div className="card shadow h-100">

                    <div className="card-body">
                      <h5>{event.title}</h5>
                      <p className="small text-muted">{event.description}</p>

                      <p><b>Date:</b> {event.date}</p>
                      <p><b>Venue:</b> {event.venue}</p>
                      <p><b>Capacity:</b> {event.capacity}</p>

                      <span className={`badge bg-${statusBadge(event.status)}`}>
                        {event.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="card-footer bg-white border-0">
                      {event.status === "approved" && (
                        <button
                          className="btn btn-outline-success btn-sm w-100"
                          onClick={() => viewStudents(event._id)}
                        >
                          View Registered Students
                        </button>
                      )}

                      {event.status === "pending" && (
                        <button
                          className="btn btn-outline-primary btn-sm w-100"
                          onClick={() => {
                            setForm(event);
                            setSelectedEventId(event._id);
                            setActiveTab("create");
                          }}
                        >
                          Edit Event
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ================= STUDENT MODAL ================= */}
      {showModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-md">
            <div className="modal-content">

              <div className="modal-header">
                <h5>Registered Students</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>

              <div className="modal-body">
                <table className="table table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>Name</th>
                      {/* <th>Roll No</th>
                      <th>Department</th>
                      <th>Year</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={i}>
                        <td>{s.name}</td>
                        {/* <td>{s.rollNo}</td> */}
                        {/* <td>{s.department}</td> */}
                        {/* <td>{s.year}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-footer">
                <button className="btn btn-success" onClick={downloadCSV}>
                  ⬇ Download CSV
                </button>

                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
