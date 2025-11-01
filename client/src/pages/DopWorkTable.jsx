import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import columns from '../utils/columnDopTable'

import './table.css';

const DopWorkTable = () => {

  const [reglist, setRegList] = useState([])
  console.log(reglist);
  
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!user) return; // Ждём, пока загрузится пользователь

    // ✅ список ролей, которым разрешён доступ
    const allowedRoles = ["user", "admin"];
    if (!allowedRoles.includes(user.role)) {
      navigate("/"); // Нет прав — перенаправляем на главную
      return;
    }

    const getReglamentAll = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/dop`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Ошибка загрузки пользователей");
        const data = await res.json();
        setRegList(data);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    }

    getReglamentAll();
  }, [token, user, navigate])

  /*########### Фильтр по колонкам #############*/

  // Добавляем состояния для фильтров по столбцам
  const [columnFilters, setColumnFilters] = useState(() => {
    const saved = localStorage.getItem('dopColumnFilters');
    return saved ? JSON.parse(saved) : {};
  });

  // Сохраняем фильтры в localStorage
  useEffect(() => {
    localStorage.setItem('dopColumnFilters', JSON.stringify(columnFilters));
  }, [columnFilters]);

  // Функция фильтрации по столбцам
  const applyColumnFilters = (data) => {
    return data.filter(item => {
      return Object.entries(columnFilters).every(([column, filterValue]) => {
        if (!filterValue) return true;
        const value = item[column];
        if (!value) return false;
        return value.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  };

  // Обработчики для фильтров столбцов
  const handleColumnFilter = (column, value) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const clearColumnFilter = (column) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[column];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setColumnFilters({});
    setSearchTerm('');
    setHighlightedId(null);
  };

  /*########### Фильтр по колонкам END #############*/

  /*############## Фильтры и поиск #################*/

  // Добавляем состояния
  const [sortField, setSortField] = useState(localStorage.getItem('dopSortField') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(localStorage.getItem('dopSortOrder') || 'desc');
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem('dopSearchTerm') || '');
  const [highlightedId, setHighlightedId] = useState(null);

  // Сохраняем в localStorage
  useEffect(() => {
    localStorage.setItem('dopSortField', sortField);
    localStorage.setItem('dopSortOrder', sortOrder);
    localStorage.setItem('dopSearchTerm', searchTerm);
  }, [sortField, sortOrder, searchTerm]);

  // Функция сортировки
  const sortedData = [...reglist].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Для всех полей с датами используем Date объект
    if (sortField === 'date' || sortField === 'createdAt' || sortField === 'reportPeriods') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }
    
    // Для числовых полей преобразуем в числа
    if (['point', 'recommen', 'errors', 'critic', 'pointsRemove', 'iteration', 'dispute'].includes(sortField)) {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Функция поиска - ТЕПЕРЬ applyColumnFilters доступна
  const filteredData = applyColumnFilters(sortedData).filter(item => 
    searchTerm ? Object.values(item).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ) : true
  );

  // Обработчики
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Находим первый подходящий результат для подсветки в уже отфильтрованных данных
    const dataToSearch = applyColumnFilters(sortedData);
    const foundItem = dataToSearch.find(item => 
      Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
    setHighlightedId(foundItem?.id || null);
  };

  const resetSort = () => {
    setSortField('createdAt');
    setSortOrder('desc');
  };

  const resetSearch = () => {
    setSearchTerm('');
    setHighlightedId(null);
  };

  useEffect(() => {
    if (highlightedId) {
      setTimeout(() => {
        const element = document.querySelector(`.table-row.highlighted`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [highlightedId, filteredData]);

  /*############## Фильтры и поиск END ###############*/

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU')
  };

  // Обрезка длинного текста
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Проверка валидности URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="table__container">
      <Link to="/qa-form">Форма</Link>
      <h1>Таблица дополнительных работ</h1>

    <div className="controls">
      <div className="search-section">
        <input
          type="text"
          placeholder="Глобальный поиск по всем полям..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button onClick={resetSearch} className="reset-btn">
            ✕
          </button>
        )}
      </div>
      
      <div className="sort-section">
        <select 
          value={sortField} 
          onChange={(e) => handleSort(e.target.value)}
          className="sort-select"
        >
          {columns.map(col => (
            <option key={col.key} value={col.key}>{col.label}</option>
          ))}
        </select>
        
        <button 
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="sort-order-btn"
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
        
        <button onClick={resetSort} className="reset-btn">
          Сбросить сортировку
        </button>
        
        {(searchTerm || Object.keys(columnFilters).length > 0) && (
          <button onClick={clearAllFilters} className="reset-btn reset-all-btn">
            Сбросить все фильтры
          </button>
        )}
      </div>
    </div>
      
      {/* Заголовки колонок с фильтрами */}
      <div className="table-header-row">
        {columns.map(column => (
          <div 
            key={column.key} 
            // className="header-cell"
            className={`header-cell ${columnFilters[column.key] ? 'active-filter' : ''}`}
            style={{ width: column.width }}
          >
            <div className="header-content">
              <span>{column.label}</span>
              <div className="filter-wrapper">
                <input
                  type="text"
                  placeholder="Фильтр..."
                  value={columnFilters[column.key] || ''}
                  onChange={(e) => handleColumnFilter(column.key, e.target.value)}
                  className="column-filter-input"
                  list={`datalist-${column.key}`}
                />
                {columnFilters[column.key] && (
                  <button 
                    onClick={() => clearColumnFilter(column.key)}
                    className="clear-filter-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            
            {/* Datalist для подсказок */}
            <datalist id={`datalist-${column.key}`}>
              {[...new Set(reglist.map(item => item[column.key]))]
                .filter(value => value)
                .map((value, index) => (
                  <option key={index} value={value} />
                ))}
            </datalist>
          </div>
        ))}
      </div>

      {/* Данные */}
      <div className="table-body">
        {filteredData.map((item) => ( 
          <div 
            key={item.id} 
            className={`table-row ${highlightedId === item.id ? 'highlighted' : ''}`}
          >
            {columns.map(column => (
              <div 
                key={column.key} 
                className="data-cell"
                style={{ width: column.width }}
                title={item[column.key]}
              >
                {column.key === 'date' ? (
                  formatDate(item[column.key])
                ) : column.key === 'reglament' && isValidUrl(item[column.key]) ? (
                  <a href={item[column.key]} target="_blank" rel="noopener noreferrer" className="link">
                    {truncateText(item[column.key], 30)}
                  </a>
                ) : column.key === 'linkReport' && isValidUrl(item[column.key]) ? (
                  <a href={item[column.key]} target="_blank" rel="noopener noreferrer" className="link">
                    {truncateText(item[column.key], 25)}
                  </a>
                ) : column.key === 'counting' || column.key === 'commentError' ? (
                  truncateText(item[column.key], 30)
                ) : (
                  item[column.key] || '0'
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="empty-state">
          {searchTerm ? 'Ничего не найдено' : 'Нет данных для отображения'}
        </div>
      )}
    </div>
  )
}

export default DopWorkTable;
