import React, { useState, useEffect } from "react";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://localhost:7007/api/User", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp");
        return;
      }

      const url = editingUser
        ? `https://localhost:7007/api/User/${editingUser.userId}`
        : "https://localhost:7007/api/User";
      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) throw new Error("Failed to save user");

      await fetchUsers();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      const response = await fetch(
        `https://localhost:7007/api/User/${userId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to delete user");

      await fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      userName: user.userName,
      email: user.email,
      password: "",
      confirmPassword: "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setEditingUser(null);
    setShowForm(false);
    setError(null);
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="user-list">
      <div className="user-header">
        <h2>Quản lý Người dùng</h2>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Đóng" : "Thêm Người dùng"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label>Tên người dùng:</label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              required
              placeholder="Nhập tên người dùng"
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              placeholder="Nhập email"
            />
          </div>
          <div className="form-group">
            <label>
              {editingUser
                ? "Mật khẩu mới (để trống nếu không đổi):"
                : "Mật khẩu:"}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required={!editingUser}
              placeholder="Nhập mật khẩu"
            />
          </div>
          <div className="form-group">
            <label>Xác nhận mật khẩu:</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required={!editingUser || formData.password !== ""}
              placeholder="Nhập lại mật khẩu"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">
              {editingUser ? "Cập nhật" : "Thêm mới"}
            </button>
            <button type="button" className="btn-cancel" onClick={resetForm}>
              Hủy
            </button>
          </div>
        </form>
      )}

      <div className="user-grid">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên người dùng</th>
              <th>Email</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEdit(user)}
                      className="btn-edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(user.userId)}
                      className="btn-delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
