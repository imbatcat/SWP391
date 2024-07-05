import { useState, useEffect, useCallback } from 'react';
import {
    MDBBadge, MDBBtn, MDBTable, MDBTableBody, MDBTableHead
}
    from 'mdb-react-ui-kit';
import SideNavForStaff from '../../Component/SideNavForStaff/SideNavForStaff';
import YearWeekSelector from '../../Component/YearWeekSelector/YearWeekSelector';
import { useUser } from '../../Context/UserContext';
import FormatDateForDisplay from '../../Helpers/FormatDateForDisplay';
import FormatStartDateForDisplay from '../../Helpers/FormatDateForDisplay';
import getStartDateOfWeek from '../../Helpers/getStartDateOfWeek';
import FormatDateForAPI from '../../Helpers/formatDateForAPI';
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import "react-datepicker/dist/react-datepicker.css";
import refreshPage from '../../Helpers/RefreshPage';

export default function AppointmentCheckin() {
    const [appointmentList, setAppointmentList] = useState([]);
    const [filteredAppointmentList, setFilteredAppointmentList] = useState([]);
    const [searchInput, setSearchInput] = useState();
    const [startDate, setStartDate] = useState(new Date());
    const [convertedDate, setConvertedDate] = useState(() => {
        const currentDate = new Date();
        const obj = {
            'year': currentDate.getFullYear(),
            'month': currentDate.getMonth() + 1,
            'day': currentDate.getDate(),
        };
        return obj;
    });


    useEffect(() => {
        const date = `${convertedDate.year}-${convertedDate.month}-${convertedDate.day}`;

        async function fetchData() {
            const response = await fetch(`https://localhost:7206/api/appointment-management/dates/${date}/time-slots/0/appointments/staff?isGetAllTimeSlot=true`, {
                
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }

        toast.promise(
            fetchData().then(data => {
                setAppointmentList(data);
                setFilteredAppointmentList(data);
            }),
            {
                pending: 'Loading appointments...',
                success: 'Appointments loaded successfully!',
                error: 'Failed to load appointments.'
            }
        );
    }, [convertedDate.day]);

    const handleDateChange = (date) => {
        setStartDate(date);
        const parsedDate = new Date(date);
        const year = parsedDate.getFullYear();
        const month = parsedDate.getMonth();
        const day = parsedDate.getDate();

        let tempDate = convertedDate;
        tempDate.year = year;
        tempDate.month = month + 1;
        tempDate.day = day;

        console.log(tempDate);
        setConvertedDate(tempDate);
    };
    const handleSearchInputChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchInput(value);
        if (value === '') {
            setFilteredAppointmentList(appointmentList);
        } else {
            setFilteredAppointmentList(appointmentList.filter(app =>
                app.appointmentId.toLowerCase().includes(value) ||
                app.customerName.toLowerCase().includes(value)
            ));
        }
    };

    async function checkinAppointment(app) {
        console.log(app);
        async function fetchData() {
            const response = await fetch(`https://localhost:7206/api/Appointment/Checkin/${app.appointmentId}`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            refreshPage();
            return response.json();
        }

        toast.promise(
            fetchData().then(
                setAppointmentList([])
            ),
            {
                pending: 'Checking in...',
                success: 'Checked in!',
                error: 'Theres something wrong'
            }
        );
    }
    return (
        <>
            <SideNavForStaff searchInput={searchInput} handleSearchInputChange={handleSearchInputChange} />
            <DatePicker
                selected={startDate}
                onChange={(date) => handleDateChange(date)}
            />
            <MDBTable align='middle'>
                <MDBTableHead>
                    <tr style={{ textAlign: 'center' }}>
                        <th scope='col' width='20%'>Appointment ID</th>
                        <th scope='col'>Owner name</th>
                        <th scope='col'>Pet name</th>
                        <th scope='col'>Veterinarian</th>
                        <th scope='col'>Status</th>
                        <th scope='col'></th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody style={{ textAlign: 'center' }}>
                    {filteredAppointmentList.map((app) => (
                        <tr key={app.id}>
                            <td>
                                <p className='fw-normal mb-1'>{app.appointmentId}</p>
                            </td>
                            <td>
                                <div>
                                    <img
                                        src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                                        alt=''
                                        style={{ width: '45px', height: '45px' }}
                                        className='rounded-circle'
                                    />
                                    <div className='ms-3'>
                                        <p className='fw-bold mb-1'>{app.customerName}</p>
                                        <p className='text-muted mb-0'>{app.phoneNumber}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p className='fw-bold mb-1'>{app.petName}</p>
                            </td>
                            <td>
                                <p className='fw-normal mb-1'>{app.vetName}</p>
                            </td>
                            <td>
                                <p className='fw-normal mb-1'>{app.status}</p>
                            </td>
                            <td>
                                <MDBBtn onClick={() => checkinAppointment(app)}>Checkin</MDBBtn>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>

            </MDBTable>
        </>
    );
};