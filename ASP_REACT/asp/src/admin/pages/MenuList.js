import React, { useState, useEffect } from "react";
import "./MenuList.css";

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    position: "mainmenu",
    sortOrder: 1,
    parentId: null,
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchMenus = async () => {
    try {
      const response = await fetch("https://localhost:7007/api/Menu", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch menus");
      const data = await response.json();
      setMenus(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingMenu
        ? `https://localhost:7007/api/Menu/${editingMenu.id}`
        : "https://localhost:7007/api/Menu";
      const method = editingMenu ? "PUT" : "POST";

      const requestBody = {
        id: editingMenu ? editingMenu.id : 0,
        name: formData.name,
        link: formData.link || "#",
        position: formData.position || "mainmenu",
        sortOrder: formData.sortOrder || 1,
        parentId: formData.parentId,
        children: editingMenu ? editingMenu.children || [] : [],
      };

      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to save menu");

      await fetchMenus();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa menu này?")) return;

    try {
      const response = await fetch(`https://localhost:7007/api/Menu/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Failed to delete menu");

      await fetchMenus();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setFormData({
      name: menu.name,
      link: menu.link,
      position: menu.position,
      sortOrder: menu.sortOrder,
      parentId: menu.parentId,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      link: "",
      position: "mainmenu",
      sortOrder: 1,
      parentId: null,
    });
    setEditingMenu(null);
    setShowForm(false);
  };

  const renderMenuItems = (items, level = 0) => {
    return items
      .filter((item) => !item.parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => (
        <div
          key={item.id}
          className="menu-item"
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="menu-item-content">
            <div className="menu-info">
              <span className="menu-name">{item.name}</span>
              <span className="menu-link">{item.link}</span>
            </div>
            <div className="menu-actions">
              <button onClick={() => handleEdit(item)} className="btn-edit">
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="btn-delete"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
          {menus.filter((child) => child.parentId === item.id).length > 0 && (
            <div className="submenu">
              {renderMenuItems(
                menus.filter((child) => child.parentId === item.id),
                level + 1
              )}
            </div>
          )}
        </div>
      ));
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="menu-list">
      <div className="menu-header">
        <h2>Quản lý Menu</h2>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Đóng" : "Thêm Menu"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="menu-form">
          <div className="form-group">
            <label>Tên menu:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="Nhập tên menu"
            />
          </div>
          <div className="form-group">
            <label>Link:</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder="Nhập link menu (ví dụ: /gioi-thieu)"
            />
          </div>
          <div className="form-group">
            <label>Menu cha:</label>
            <select
              value={formData.parentId === null ? "" : formData.parentId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  parentId:
                    e.target.value === "" ? null : Number(e.target.value),
                })
              }
            >
              <option value="">Không có</option>
              {menus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.id === 0 ? "Gốc" : menu.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              {editingMenu ? "Cập nhật" : "Thêm mới"}
            </button>
            <button type="button" className="btn-cancel" onClick={resetForm}>
              Hủy
            </button>
          </div>
        </form>
      )}

      <div className="menu-tree">{renderMenuItems(menus)}</div>
    </div>
  );
};

export default MenuList;
