import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const AdminPage = () => {
    const navigate = useNavigate();
    
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        if (!user) return;

        const allowedRoles = ["admin"];
        if (!allowedRoles.includes(user.role)) {
            navigate("/");
            return;
        }

    }, [token, user, navigate]);

    return (
        <div className="admin-container">
            <Link to='/all-users'>
                Страница пользователей
            </Link>
            <Link to="/executors">Страница исполнителей</Link>
            <Link to="/date-periods">Страница даты отчета</Link>
            <h1>Админ-панель</h1>

        </div>
    );
};

export default AdminPage;
