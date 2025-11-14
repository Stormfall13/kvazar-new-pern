import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import './adminExecutors.css';

const AdminExecutorPage = () => {

  const [executorName, setExecutorName] = useState('');
  const [executorDepartament, setExecutorDepartament] = useState('');
  const [executors, setExecutors] = useState([]);
  const [editExecutor, setEditExecutor] = useState(null);
  const [formData, setFormData] = useState({ 
      executorName: "", 
      executorDepartament: "" 
  });
  const [newExecutor, setNewExecutor] = useState({ 
      executorName: "", 
      executorDepartament: "" 
  });
  const [showAddForm, setShowAddForm] = useState(false);
    
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
      if (!token) {
          navigate("/login");
          return;
      }
      
      if (!user) return;
      
      if (user.role !== "admin") {
          navigate("/");
          return;
      }

      fetchExecutors();
  }, [token, user, navigate]);

  const fetchExecutors = async () => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/executors`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error("Ошибка загрузки исполнителей");
        const data = await res.json();
        setExecutors(data);
    } catch (error) {
        console.error("Ошибка:", error);
    }
  };

  if (!user) {
      return <h2>Загрузка...</h2>;
  }

  const handleEdit = (executor) => {
    setEditExecutor(executor);
    setFormData({ 
        executorName: executor.executorName,
        executorDepartament: executor.executorDepartament 
    });
  };

  const saveEdit = async () => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/executors/${editExecutor.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Ошибка обновления");

        setExecutors(executors.map(executor => 
            executor.id === editExecutor.id ? { ...executor, ...formData } : executor
        ));
        setEditExecutor(null);
        setFormData({ executorName: "", executorDepartament: "" });
    } catch (error) {
        console.error("Ошибка:", error);
    }
  };

  const deleteExecutor = async (id) => {
      if (!window.confirm("Вы уверены, что хотите удалить исполнителя?")) return;

      try {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/api/executors/${id}`, {
              method: "DELETE",
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });

          if (!res.ok) throw new Error("Ошибка удаления");

          setExecutors(executors.filter(executor => executor.id !== id));
      } catch (error) {
          console.error("Ошибка:", error);
      }
  };

  const addExecutor = async () => {
      try {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/api/executors`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(newExecutor),
          });

          if (!res.ok) throw new Error("Ошибка создания исполнителя");

          const createdExecutor = await res.json();
          setExecutors([...executors, createdExecutor]);
          setNewExecutor({ executorName: "", executorDepartament: "" });
          setShowAddForm(false);
      } catch (error) {
          console.error("Ошибка:", error);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const item = {
      executorName,
      executorDepartament
    };

    fetch(`${process.env.REACT_APP_API_URL}/api/executors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    })
      .then((response) => response.json())
      .then((data) => {
          console.log(data);
      })
      .catch((error) => {
          console.error(error);
      });

      //   window.location.reload()
  };


  return (
    <>
      <div className="page-header">
          <h1>Управление исполнителями</h1>
      </div>
      <div className="admin-executors">
          {/* Форма добавления нового исполнителя */}
              <div className="add-executor-form">
                  <h3>Добавить нового исполнителя</h3>
                  <div className="form-group">
                      <input
                          type="text"
                          placeholder="Имя исполнителя"
                          value={newExecutor.executorName}
                          onChange={(e) => setNewExecutor({ ...newExecutor, executorName: e.target.value })}
                      />
                      <input
                          type="text"
                          placeholder="Отдел"
                          value={newExecutor.executorDepartament}
                          onChange={(e) => setNewExecutor({ ...newExecutor, executorDepartament: e.target.value })}
                      />
                  </div>
                  <button onClick={addExecutor} className="btn-success">
                      Добавить
                  </button>
              </div>

          {/* Список исполнителей */}
          <div className="executors-list">
              {executors.map((executor) => (
                  <div className="executor-card" key={executor.id}>
                      <div className="executor-info">
                          <p><strong>ID:</strong> {executor.id}</p>

                          <p><strong>Имя:</strong> 
                              {editExecutor?.id === executor.id ? (
                                  <input 
                                      type="text"
                                      value={formData.executorName}
                                      onChange={(e) => setFormData({ ...formData, executorName: e.target.value })}
                                  />
                              ) : (
                                  executor.executorName
                              )}
                          </p>
                          <p><strong>Отдел:</strong> 
                              {editExecutor?.id === executor.id ? (
                                  <input 
                                      type="text"
                                      value={formData.executorDepartament}
                                      onChange={(e) => setFormData({ ...formData, executorDepartament: e.target.value })}
                                  />
                              ) : (
                                  executor.executorDepartament
                              )}
                          </p>
                      </div>

                      <div className="executor-actions">
                          {editExecutor?.id === executor.id ? (
                              <>
                                  <button onClick={saveEdit} className="btn-success">Сохранить</button>
                                  <button onClick={() => setEditExecutor(null)} className="btn-secondary">Отмена</button>
                              </>
                          ) : (
                              <>
                                  <button onClick={() => handleEdit(executor)} className="btn-primary">
                                      Редактировать
                                  </button>
                                  <button onClick={() => deleteExecutor(executor.id)} className="btn-danger">
                                      Удалить
                                  </button>
                              </>
                          )}
                      </div>
                  </div>
              ))}
          </div>

          {executors.length === 0 && !showAddForm && (
              <div className="no-data">
                  <p>Исполнители не найдены</p>
              </div>
          )}
      </div>
    </>
    );
};

export default AdminExecutorPage;
