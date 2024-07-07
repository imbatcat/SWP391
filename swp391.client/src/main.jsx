import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from "./Context/AuthProvider";
import Login from './Pages/Login/Login';
/*import App from './App';*/
import Home from './Pages/Home/Home';
import SignUp from './Pages/SignUp/SignUp';
import AboutUs from './Pages/About Us/AboutUs';
import Appointment from './Pages/Appointment/Appointment';
import OTPInput from './Pages/OTP Input/OTPInput';
import PasswordResetForm from './Pages/SetNewPass/PasswordResetForm';
import PetList from './Pages/MyPetList/PetList';
import CageList from './Pages/Staff/CageList';
import ConfirmEmail from './Pages/ConfirmEmail';
import { ToastContainer } from 'react-toastify';
import UserProfile from './Pages/Profile/UserProfile';
import { UserProvider } from './Context/UserContext';
import AppointmentManage from './Pages/AdminPages/AppointmentManage';
import UsersAccount from './Pages/AdminPages/UsersAccount';
import UserHistoricalAppointments from './Pages/Profile/UserHistoricalAppointments';
import CheckAuth from './Helpers/CheckAuth';
import AdminPet from './Pages/AdminPages/petManage';
import VetAccount from './Pages/AdminPages/VetAccount';
import AdminAccount from './Pages/AdminPages/adminAccount';
import WorkSchedule from './Pages/Veternary/WorkSchedule';
import AppointmentList from './Pages/Veternary/AppointmentList';
import UserPets from './Pages/Profile/UserPets';
import UserAppointments from './Pages/Profile/UserAppointments';
import MedicalRecord from './Pages/Veternary/MedicalRecord';
import AppointmentCheckin from './Pages/Staff/AppointmentCheckin';
import MedicalRecordList from './Pages/Veternary/MedicalRecordList';
import ServiceBills from './Pages/Staff/ServiceBills';
import StaffAccount from './Pages/AdminPages/StaffAccount';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/login',
        element: <Login />,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/signUp',
        element: <SignUp />,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/aboutUs',
        element: <AboutUs />,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/appointment',
        element: <Appointment />,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/otp',
        element: <OTPInput />,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/reset-password',
        element: <PasswordResetForm />,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/petList',
        element: <PetList />,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/account-confirm',
        element: <ConfirmEmail />,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/user/profile',
        element: (
            <CheckAuth>
                <UserProfile />
            </CheckAuth>
        ),
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/user/pets',
        element: (
            <CheckAuth>
                <UserPets />
            </CheckAuth>
        ),
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/user/appointments',
        element: (
            <CheckAuth>
                <UserAppointments />
            </CheckAuth>
        ),
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/user/old-appointments',
        element: (
            <CheckAuth>
                <UserHistoricalAppointments />
            </CheckAuth>
        ),
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/admin/vets',
        element: <VetAccount />,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/admin/staff',
        element: <StaffAccount />,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/admin/appointments',
        element: <AppointmentManage />,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/admin/customers',
        element: <UsersAccount />,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/admin/pets',
        element: <AdminPet />,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/admin/admins',
        element: <AdminAccount />,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/vet/WorkSchedule',
        element: (
            <CheckAuth>
                <WorkSchedule></WorkSchedule>
            </CheckAuth>
        ),
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/vet/AppointmentList',
        element: (
            <CheckAuth>
                <AppointmentList></AppointmentList>
            </CheckAuth>
        ),
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/vet/MedicalRecordList',
        element: (
            <CheckAuth>
                <MedicalRecordList />
            </CheckAuth>
        ),
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/vet/MedicalRecord',
        element: (
            <CheckAuth>
                <MedicalRecord />
            </CheckAuth>
        ),
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/staff/cage-list',
        element: (
            <CheckAuth>
                <CageList></CageList>
            </CheckAuth>
        ),
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/staff/appointment-checkin',
        element: (
            <CheckAuth>
                <AppointmentCheckin></AppointmentCheckin>
            </CheckAuth>
        ),
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: '/staff/service-bill-list',
        element: (
            <CheckAuth>
                <ServiceBills></ServiceBills>
            </CheckAuth>
        ),
        errorElement: <div>404 Not Found</div>,
    },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="279261034420-76gqakprrgtiq9pc879d8e4ukhk9cour.apps.googleusercontent.com">
        <AuthProvider>
            <UserProvider>
                {/*<React.StrictMode>*/}
                <RouterProvider router={router}>
                </RouterProvider>
                <ToastContainer
                    position="top-center"
                    autoClose={1000}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    draggable
                    theme="light"
                    transition: Flip
                />
                {/*</React.StrictMode>*/}
            </UserProvider>
        </AuthProvider>
    </GoogleOAuthProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
