import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import './adminExecutors.css';

const DatePeriodsPage = () => {
    
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [datePeriods, setDatePeriods] = useState([]);
  const [editPeriods, setEditPeriods] = useState(null);
  const [formData, setFormData] = useState({ 
      startDate: "", 
      endDate: "" 
  });
  const [newPeriods, setNewPeriods] = useState({ 
      startDate: "", 
      endDate: "" 
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

      fetchPeriods();
  }, [token, user, navigate]);

  const fetchPeriods = async () => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/date-periods`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error("Ошибка загрузки даты периодов");
        const data = await res.json();
        setDatePeriods(data);
    } catch (error) {
        console.error("Ошибка:", error);
    }
  };

  if (!user) {
      return <h2>Загрузка...</h2>;
  }

  const handleEdit = (period) => {
    setEditPeriods(period);
    setFormData({ 
        startDate: period.startDate,
        endDate: period.endDate, 
    });
  };

  const saveEdit = async () => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/date-periods/${editPeriods.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Ошибка обновления");

        setDatePeriods(datePeriods.map(period => 
            period.id === editPeriods.id ? { ...period, ...formData } : period
        ));
        setEditPeriods(null);
        setFormData({ startDate: "", endDate: "" });
    } catch (error) {
        console.error("Ошибка:", error);
    }
  };

  const deletePeriods = async (id) => {
      if (!window.confirm("Вы уверены, что хотите удалить дату?")) return;

      try {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/api/date-periods/${id}`, {
              method: "DELETE",
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });

          if (!res.ok) throw new Error("Ошибка удаления");

          setDatePeriods(datePeriods.filter(period => period.id !== id));
      } catch (error) {
          console.error("Ошибка:", error);
      }
  };

  const addPeriods = async () => {
      try {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/api/date-periods`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(newPeriods),
          });

          if (!res.ok) throw new Error("Ошибка создания периода");

          const createdPeriod = await res.json();
          setDatePeriods([...datePeriods, createdPeriod]);
          setNewPeriods({ startDate: "", endDate: "" });
          setShowAddForm(false);
      } catch (error) {
          console.error("Ошибка:", error);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const item = {
      startDate,
      endDate
    };

    fetch(`${process.env.REACT_APP_API_URL}/api/date-periods`, {
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
          <h1>Управление периодами дат</h1>
      </div>
      <div className="admin-executors">
          {/* Форма добавления нового периода */}
          <div className="add-executor-form">
              <h3>Добавить новый период</h3>
              <div className="form-group">
                  <input
                      type="text"
                      placeholder="Стартовая дата (формат: DD.MM.YYYY)"
                      value={newPeriods.startDate}
                      onChange={(e) => setNewPeriods({ ...newPeriods, startDate: e.target.value })}
                  />
                  <input
                      type="text"
                      placeholder="Конечная дата (формат: DD.MM.YYYY)"
                      value={newPeriods.endDate}
                      onChange={(e) => setNewPeriods({ ...newPeriods, endDate: e.target.value })}
                  />
              </div>
              <button onClick={addPeriods} className="btn-success">
                  Добавить период
              </button>
          </div>

          {/* Список периодов */}
          <div className="executors-list">
              {datePeriods.map((period) => (
                  <div className="executor-card" key={period.id}>
                      <div className="executor-info">
                          <p><strong>ID:</strong> {period.id}</p>

                          <p><strong>Начало периода:</strong> 
                              {editPeriods?.id === period.id ? (
                                  <input 
                                      type="text"
                                      value={formData.startDate}
                                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                  />
                              ) : (
                                  period.startDate
                              )}
                          </p>
                          <p><strong>Конец периода:</strong> 
                              {editPeriods?.id === period.id ? (
                                  <input 
                                      type="text"
                                      value={formData.endDate}
                                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                  />
                              ) : (
                                  period.endDate
                              )}
                          </p>
                      </div>

                      <div className="executor-actions">
                          {editPeriods?.id === period.id ? (
                              <>
                                  <button onClick={saveEdit} className="btn-success">Сохранить</button>
                                  <button onClick={() => setEditPeriods(null)} className="btn-secondary">Отмена</button>
                              </>
                          ) : (
                              <>
                                  <button onClick={() => handleEdit(period)} className="btn-primary">
                                      Редактировать
                                  </button>
                                  <button onClick={() => deletePeriods(period.id)} className="btn-danger">
                                      Удалить
                                  </button>
                              </>
                          )}
                      </div>
                  </div>
              ))}
          </div>

          {datePeriods.length === 0 && (
              <div className="no-data">
                  <p>Периоды не найдены</p>
              </div>
          )}
      </div>
    </>
  );
};

export default DatePeriodsPage;

