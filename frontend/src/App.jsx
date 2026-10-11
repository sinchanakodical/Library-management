import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import AdminMembers from './pages/admin/AdminMembers';
import UserDashboard from './pages/user/UserDashboard';
import BrowseBooks from './pages/user/BrowseBooks';
import MyBorrowings from './pages/user/MyBorrowings';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Navigate to="/signin" />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />

                {/* Admin routes */}
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/books" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminBooks />
                    </ProtectedRoute>
                } />
                <Route path="/admin/members" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminMembers />
                    </ProtectedRoute>
                } />

                {/* User routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute allowedRoles={['user']}>
                        <UserDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/books" element={
                    <ProtectedRoute allowedRoles={['user']}>
                        <BrowseBooks />
                    </ProtectedRoute>
                } />
                <Route path="/my-borrowings" element={
                    <ProtectedRoute allowedRoles={['user']}>
                        <MyBorrowings />
                    </ProtectedRoute>
                } />

                {/* Shared routes */}
                <Route path="/change-password" element={
                    <ProtectedRoute allowedRoles={['admin', 'user']}>
                        <ChangePassword />
                    </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/signin" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;