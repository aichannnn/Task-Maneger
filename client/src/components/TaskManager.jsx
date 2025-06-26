import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const API = "http://localhost:5000/api/tasks";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: '', assignedTo: '' });
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '' });
  const [expanded, setExpanded] = useState(null);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);
      setUserName(decoded.username);
    } catch (err) {
      console.error("Token Decode Error:", err);
      logout();
    }
  }, []);


  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(API, {
        params: filters,
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.reverse());
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleCreate = async () => {
    const { title, description, assignedTo } = form;

    if (!title) return alert("Please enter Title");
    if (!description) return alert("Please enter Description");
    if (!assignedTo) return alert("Please enter Assignee");

    const token = localStorage.getItem("token");

    try {
      await axios.post(API, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({ title: '', description: '', assignedTo: '' });
      fetchTasks();
    } catch (err) {
      console.error("Create Task Error:", err);
      alert("Something went wrong");
    }
  };

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API}/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "To Do": return "bg-info text-dark";
      case "In Progress": return "bg-warning text-dark";
      case "Done": return "bg-success text-light";
      default: return "bg-secondary text-white";
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, []);

  return (
    <div className="main-wrapper">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <a className="navbar-brand fw-bold fs-4" href="/">Task Manager</a>
        <div className="ms-auto d-flex align-items-center gap-3">
          <span className="text-white">Hi, {userName}</span>
          <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="row mt-4 mb-2 px-3">
        <div className="col-md-10 mx-auto">
          <div className="d-flex flex-wrap flex-md-nowrap gap-3 align-items-center">
            <input
              className="form-control flex-grow-1"
              style={{ minWidth: "200px" }}
              placeholder="Filter by Assignee"
              onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
            />
            <select
              className="form-select"
              style={{ minWidth: "200px" }}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row m-4">
        <div className="col-md-6 px-4">
          <h4 className="mb-3">Create New Task</h4>
          <div className="card shadow-sm p-4">
            <input
              className="form-control mb-3"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              className="form-control mb-3"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <input
              className="form-control mb-3"
              placeholder="Assigned To"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              required
            />
            <button className="btn btn-primary w-100" onClick={handleCreate}>Create Task</button>
          </div>
        </div>

        <div className="col-md-6 px-4">
          <h4 className="mb-3">Task List</h4>
          {tasks.length === 0 ? (
            <p className="text-muted">No tasks available</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="card mb-3 shadow-sm">
                <div
                  className="card-header d-flex justify-content-between align-items-center"
                  onClick={() => setExpanded(expanded === task._id ? null : task._id)}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                >
                  <div>
                    <strong>{task.title}</strong>
                    <span className={`badge ms-2 ${getBadgeColor(task.status)}`}>{task.status}</span>
                  </div>
                  <small>▼</small>
                </div>
                {expanded === task._id && (
                  <div className="card-body" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                    <p><b>Description:</b> {task.description}</p>
                    <p><b>Assigned To:</b> {task.assignedTo}</p>
                    <div className="d-flex align-items-center">
                      <select
                        className="form-select me-3"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      >
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>Done</option>
                      </select>
                      <button className="btn btn-danger" onClick={() => handleDelete(task._id)}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        body {
          overflow-x: hidden;
        }
        .main-wrapper {
          overflow-x: hidden;
          width: 100%;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default TaskManager;
