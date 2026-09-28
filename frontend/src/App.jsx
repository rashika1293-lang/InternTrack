import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const emptyForm = {
  company: "",
  role: "",
  location: "",
  appliedDate: "",
  interviewDate: "",
  status: "Applied",
  notes: ""
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [mode, setMode] = useState("login");
  const [auth, setAuth] = useState({ name: "", email: "", password: "" });
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const loadApplications = async () => {
    try {
      const res = await axios.get(`${API}/applications`, { headers });
      setApplications(res.data);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    if (token) loadApplications();
  }, [token]);

  const stats = useMemo(() => ({
    total: applications.length,
    applied: applications.filter(a => a.status === "Applied").length,
    interview: applications.filter(a => a.status === "Interview").length,
    selected: applications.filter(a => a.status === "Selected").length
  }), [applications]);

  const visibleApplications = applications.filter(a => {
    const matchesFilter = filter === "All" || a.status === filter;
    const text = `${a.company} ${a.role} ${a.location}`.toLowerCase();
    return matchesFilter && text.includes(search.toLowerCase());
  });

  async function submitAuth(e) {
    e.preventDefault();
    setMessage("");
    try {
      if (mode === "register") {
        await axios.post(`${API}/auth/register`, auth);
        setMessage("Registration successful. Please login.");
        setMode("login");
        return;
      }

      const res = await axios.post(`${API}/auth/login`, {
        email: auth.email,
        password: auth.password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setApplications([]);
  }

  async function saveApplication(e) {
    e.preventDefault();
    setMessage("");
    try {
      if (editingId) {
        await axios.put(`${API}/applications/${editingId}`, form, { headers });
        setMessage("Application updated.");
      } else {
        await axios.post(`${API}/applications`, form, { headers });
        setMessage("Application added.");
      }
      setForm(emptyForm);
      setEditingId(null);
      loadApplications();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save application");
    }
  }

  function editApplication(app) {
    setEditingId(app._id);
    setForm({
      company: app.company || "",
      role: app.role || "",
      location: app.location || "",
      appliedDate: app.appliedDate ? app.appliedDate.slice(0, 10) : "",
      interviewDate: app.interviewDate ? app.interviewDate.slice(0, 10) : "",
      status: app.status,
      notes: app.notes || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteApplication(id) {
    if (!window.confirm("Delete this application?")) return;
    await axios.delete(`${API}/applications/${id}`, { headers });
    loadApplications();
  }

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="brand">InternTrack</div>
          <p className="subtitle">Manage your internship journey in one place.</p>

          <div className="tabs">
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Login</button>
            <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Register</button>
          </div>

          <form onSubmit={submitAuth}>
            {mode === "register" && (
              <input placeholder="Full name" value={auth.name}
                onChange={e => setAuth({ ...auth, name: e.target.value })} />
            )}
            <input type="email" placeholder="Email" value={auth.email}
              onChange={e => setAuth({ ...auth, email: e.target.value })} required />
            <input type="password" placeholder="Password" value={auth.password}
              onChange={e => setAuth({ ...auth, password: e.target.value })} required />
            <button className="primary" type="submit">{mode === "login" ? "Login" : "Create Account"}</button>
          </form>

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <div>
          <h1>InternTrack</h1>
          <p>Welcome, {user?.name} 👋</p>
        </div>
        <button className="logout" onClick={logout}>Logout</button>
      </header>

      <main>
        <section className="stats">
          <div><span>Total</span><strong>{stats.total}</strong></div>
          <div><span>Applied</span><strong>{stats.applied}</strong></div>
          <div><span>Interviews</span><strong>{stats.interview}</strong></div>
          <div><span>Selected</span><strong>{stats.selected}</strong></div>
        </section>

        <section className="card">
          <h2>{editingId ? "Edit Application" : "Add New Application"}</h2>
          <form className="grid-form" onSubmit={saveApplication}>
            <input placeholder="Company *" value={form.company} required
              onChange={e => setForm({ ...form, company: e.target.value })} />
            <input placeholder="Role *" value={form.role} required
              onChange={e => setForm({ ...form, role: e.target.value })} />
            <input placeholder="Location" value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })} />
            <label>Applied Date<input type="date" value={form.appliedDate}
              onChange={e => setForm({ ...form, appliedDate: e.target.value })} /></label>
            <label>Interview Date<input type="date" value={form.interviewDate}
              onChange={e => setForm({ ...form, interviewDate: e.target.value })} /></label>
            <label>Status<select value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}>
              <option>Applied</option><option>Shortlisted</option><option>Interview</option>
              <option>Selected</option><option>Rejected</option>
            </select></label>
            <textarea placeholder="Notes" value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}></textarea>
            <div className="actions">
              <button className="primary" type="submit">{editingId ? "Update" : "Add Application"}</button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
            </div>
          </form>
          {message && <p className="message">{message}</p>}
        </section>

        <section className="card">
          <div className="toolbar">
            <input placeholder="Search company, role or location..." value={search}
              onChange={e => setSearch(e.target.value)} />
            <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option>All</option><option>Applied</option><option>Shortlisted</option>
              <option>Interview</option><option>Selected</option><option>Rejected</option>
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Company</th><th>Role</th><th>Location</th><th>Status</th><th>Interview</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {visibleApplications.map(app => (
                  <tr key={app._id}>
                    <td>{app.company}</td>
                    <td>{app.role}</td>
                    <td>{app.location || "—"}</td>
                    <td><span className={`status ${app.status.toLowerCase()}`}>{app.status}</span></td>
                    <td>{app.interviewDate ? new Date(app.interviewDate).toLocaleDateString() : "—"}</td>
                    <td>
                      <button className="small" onClick={() => editApplication(app)}>Edit</button>
                      <button className="small danger" onClick={() => deleteApplication(app._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleApplications.length === 0 && <p className="empty">No applications found.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
