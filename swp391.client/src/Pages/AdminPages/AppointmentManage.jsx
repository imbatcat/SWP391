import { useState, useEffect } from 'react';
import { 
  MDBBadge, MDBBtn, MDBTable, MDBTableBody, MDBTableHead
} 
  from 'mdb-react-ui-kit';
import SideNav from '../../Component/SideNav/SideNav';


function AppointmentManage() {
    const [appointments, setAppointment] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredAppointments, setFilteredApppointments] = useState([]);

    useEffect(() => {
        async function fetchData() {
          try {
            const appResponse = await fetch('https://localhost:7206/api/Appointment', {
              method: 'GET',
              credentials: 'include',
            });
            if (!appResponse.ok) {
              throw new Error("Error fetching appointment data");
            }
            const appointmentData = await appResponse.json();
    
            const accountResponse = await fetch('https://localhost:7206/api/Accounts', {
              method: 'GET',
              credentials: 'include',
            });
            if (!accountResponse.ok) {
              throw new Error("Error fetching account data");
            }
            const accountData = await accountResponse.json();
    
            // Merge appointment data with account data
            const mergedData = appointmentData.map(app => {
              const owner = accountData.find(account => account.accountId === app.accountId) || {};
              console.log(appointmentData);
            //   console.log("Matching owner for appointment:", app, "is:", owner);
              return { 
                ...app, 
                ownerName: owner.fullName || 'Unknown', ownerNumber: owner.phoneNumber };
            });
    
            setAppointment(mergedData);
            setFilteredApppointments(mergedData);
          } catch (error) {
            console.error(error.message);
          }
        }
    
        fetchData();
      }, []);

      const getBadgeColor = (app) => {
        if (app.isCancel) {
            return 'danger'; // red
        }
        if (app.isCheckUp) {
            return 'success'; // green
        }
        if (app.isCheckIn) {
            return 'warning'; // yellow
        }
        return 'secondary'; // default color
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchInput(value);
        if (value === '') {
            setFilteredApppointments(appointments);
        } else {
            setFilteredApppointments(filteredAppointments.filter(app =>
                app.ownerName.toLowerCase().includes(value) ||
                app.ownerNumber.toLowerCase().includes(value) 
            ));
        }
    };


    return (
        <div>
            <SideNav searchInput={searchInput} handleSearchInputChange={handleSearchInputChange} />
            <MDBTable align='middle'>
                <MDBTableHead>
                    <tr style={{textAlign:'center'}}>
                        <th scope='col' width='20%'>Customer Name & Phone Number</th>
                        <th scope='col'>Pet Name</th>
                        <th scope='col'>Date & Timeslot</th>
                        <th scope='col'>Veterinarian</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Booking Price</th>
                        <th scope='col'>Note</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody style={{textAlign:'center'}}>
                    {filteredAppointments.map((app) => (
                        <tr key={app.id}>
                            <td>
                                <div className='d-flex align-items-center'>
                                    <img
                                        src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                                        alt=''
                                        style={{ width: '45px', height: '45px' }}
                                        className='rounded-circle'
                                    />
                                    <div className='ms-3'>
                                        <p className='fw-bold mb-1'>{app.ownerName}</p>
                                        <p className='text-muted mb-0'>{app.ownerNumber}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p className='fw-normal mb-1'>{app.petName}</p>
                            </td>
                            <td>
                                <p className='fw-bold mb-1'>{app.appointmentDate}</p>
                                <p className='text-muted mb-0'>{app.timeSlot}</p>
                            </td>                    
                            <td>
                                <p className='fw-normal mb-1'>{app.veterinarianName}</p>
                            </td>
                            <td>
                                <MDBBadge color={getBadgeColor(app)} pill>
                                    {app.isCancel ? "Cancelled" : app.isCheckUp ? "Checked Up" : app.isCheckIn ? "Checked In" :  "Active"}
                                </MDBBadge> 
                            </td>
                            <td>
                                <p className='fw-bold mb-1'>{app.bookingPrice}</p>
                                <p className='text-muted mb-0'>{app.appointmentType}</p>
                            </td>
                            <td>
                                <p className='fw-normal mb-1'>{app.appointmentNotes}</p>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

        </div>
    );
}

export default AppointmentManage;
