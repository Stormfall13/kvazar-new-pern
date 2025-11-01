import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const UserPage = lazy(() => import("./pages/UserPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const AdmimAllUsersPage = lazy(() => import("./pages/AdminAllUsersPage"));
const QaPage = lazy(() => import("./pages/QaPage"));
const QaForm = lazy(() => import("./pages/QaForm"));

const DopWorkTable = lazy(() => import("./pages/DopWorkTable"));

const AppRouter = () => {

    return (
        <Router>
            <Header />
            <Suspense fallback={<div>Загрузка...</div>}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Home />} />

                    
                    {/* 🔐 Защищенные маршруты (только для user и admin) */}
                    <Route path="/" element={ <ProtectedRoute allowedRoles={["user", "admin"]}> <Home /> </ProtectedRoute> } />
                    <Route path="/user" element={ <ProtectedRoute allowedRoles={["user", "admin"]}> <UserPage /> </ProtectedRoute> } />
                    <Route path="/all-users" element={<ProtectedRoute allowedRoles={["admin"]}><AdmimAllUsersPage /></ProtectedRoute>} />
                    <Route path="/admin" element={ <ProtectedRoute allowedRoles={["admin"]}> <AdminPage /> </ProtectedRoute> } />
                    <Route path="/gallery" element={ <ProtectedRoute allowedRoles={["admin"]}> <GalleryPage /> </ProtectedRoute> } />

                    {/* Если страница не найдена — редирект на `/` */}
                    <Route path="*" element={<Navigate to="/" />} />


                    {/* МАРШРУТЫ ДЛЯ ТЕСТЕРОВ */}
                    <Route path="/qa-page" element={<ProtectedRoute allowedRoles={["admin", "user"]}> <QaPage /> </ProtectedRoute> } />
                    <Route path="/dop-work" element={<ProtectedRoute allowedRoles={["admin", "user"]}> <DopWorkTable /> </ProtectedRoute> } />
                    <Route path="/qa-form" element={<ProtectedRoute allowedRoles={["admin", "user"]}> <QaForm /> </ProtectedRoute> } />
                
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRouter;
