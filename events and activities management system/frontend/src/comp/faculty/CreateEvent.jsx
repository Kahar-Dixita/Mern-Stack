import { useState } from "react";
import axios from "axios";

export default function CreateEvent() {

  const today = new Date().toISOString().split("T")[0];

  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
    venue: ""
  });

  const create = async (e) => {
    e.preventDefault(); // ✅ stop refresh

    // ===== Validation =====
    if (!event.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!event.date) {
      alert("Date is required");
      return;
    }

    if (event.date < today) {
      alert("Past dates are not allowed");
      return;
    }

    if (!event.venue.trim()) {
      alert("Venue is required");
      return;
    }

    try {
      await axios.post("/faculty/create-event", event);
      alert("Event submitted for approval");

      setEvent({
        title: "",
        description: "",
        date: "",
        venue: ""
      });

    } catch (err) {
      alert("Error creating event");
    }
  };

  return (
    <>
      <h2>Create Event</h2>

      {/* ✅ FORM ADDED */}
      <form onSubmit={create}>

        <input
          placeholder="Title"
          value={event.title}
          onChange={(e) =>
            setEvent({ ...event, title: e.target.value })
          }
        />

        <input
          placeholder="Description"
          value={event.description}
          onChange={(e) =>
            setEvent({ ...event, description: e.target.value })
          }
        />

        <input
          type="date"
          min={today}
          value={event.date}
          onChange={(e) =>
            setEvent({ ...event, date: e.target.value })
          }
        />

        <input
          placeholder="Venue"
          value={event.venue}
          onChange={(e) =>
            setEvent({ ...event, venue: e.target.value })
          }
        />

        <button type="submit">Create</button>

      </form>
    </>
  );
}
