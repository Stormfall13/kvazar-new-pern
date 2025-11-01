import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const AdminPage = () => {
    const navigate = useNavigate();
    
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);
    

    return (
        <div className="admin-container">
            <Link to="/gallery">
                Перейти в галерею
            </Link>
            <Link to='/all-users'>
                Страница пользователей
            </Link>
            <h1>Админ-панель</h1>

        </div>
    );
};

export default AdminPage;
