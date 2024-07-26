import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Pages/Login/Login';
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
import AppointmentQRCode from './Pages/Appointment/AppointmentQRCode';

import StaffAccount from './Pages/AdminPages/StaffAccount';
import HospitalizationManagement from './Pages/Veternary/HospitalizationManagement';

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
      <CheckAuth allowedRoles={['Customer', 'Vet', 'Staff', 'Admin']}>
        <UserProfile />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/user/pets',
    element: (
      <CheckAuth allowedRoles={['Customer', 'Vet', 'Staff', 'Admin']}>
        <UserPets />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/user/appointments',
    element: (
      <CheckAuth allowedRoles={['Customer', 'Vet', 'Staff', 'Admin']}>
        <UserAppointments />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/user/old-appointments',
    element: (
      <CheckAuth allowedRoles={['Customer', 'Vet', 'Staff', 'Admin']}>
        <UserHistoricalAppointments />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/admin/vets',
    element: (
      <CheckAuth allowedRoles={['Admin']}>
        <VetAccount />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/admin/staff',
    element: (
      <CheckAuth allowedRoles={['Admin']}>
        <StaffAccount />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/admin/appointments',
    element: (
      <CheckAuth allowedRoles={['Admin']}>
        <AppointmentManage />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/admin/customers',
    element: (
      <CheckAuth allowedRoles={['Admin']}>
        <UsersAccount />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/admin/pets',
    element: (
      <CheckAuth allowedRoles={['Admin']}>
        <AdminPet />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/admin/admins',
    element: (
      <CheckAuth allowedRoles={['Admin']}>
        <AdminAccount />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/vet/WorkSchedule',
    element: (
      <CheckAuth allowedRoles={['Vet']}>
        <WorkSchedule />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/vet/AppointmentList',
    element: (
      <CheckAuth allowedRoles={['Vet']}>
        <AppointmentList />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/vet/MedicalRecordList',
    element: (
      <CheckAuth allowedRoles={['Vet']}>
        <MedicalRecordList />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/vet/MedicalRecord',
    element: (
      <CheckAuth allowedRoles={['Vet']}>
        <MedicalRecord />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/vet/HospitalizationManagement',
    element: (
      <CheckAuth allowedRoles={['Vet']}>
        <HospitalizationManagement />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/staff/cage-list',
    element: (
      <CheckAuth allowedRoles={['Staff']}>
        <CageList />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/staff/appointment-checkin',
    element: (
      <CheckAuth allowedRoles={['Staff']}>
        <AppointmentCheckin />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/staff/service-bill-list',
    element: (
      <CheckAuth allowedRoles={['Staff']}>
        <ServiceBills />
      </CheckAuth>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/appointment/qrcode',
    element: <AppointmentQRCode />,
    errorElement: <div>404 Not Found</div>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={`${import.meta.env.VITE_GOOGLE_CLIENT_ID}`}>
    <UserProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
      />
    </UserProvider>
  </GoogleOAuthProvider>
);
