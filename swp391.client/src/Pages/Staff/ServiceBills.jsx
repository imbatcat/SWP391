import { useState, useEffect } from 'react';
import {
    MDBBadge, MDBBtn, MDBTable, MDBTableBody, MDBTableHead
}
    from 'mdb-react-ui-kit';
import SideNavForStaff from '../../Component/SideNavForStaff/SideNavForStaff';

export default function AppointmentCheckin() {
    const [appointmentList, setAppointmentList] = useState([]);
    const [searchInput, setSearchInput] = useState();
    const [isPaidClicked, setIsPaidClicked] = useState(false);

    const handleSearchInputChange = () => {
    };

    const handleOnPaidClick = () => {
        setIsPaidClicked(false);
    };

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`https://localhost:7206/api/service-order-management/service-orders/staff`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            console.log(data);
        }

        fetchData();
    }, []);
    useEffect(() => {
        if (isPaidClicked) {
            setIsPaidClicked(true);
        }
    }, [isPaidClicked]);
    return (
        <>
            <SideNavForStaff searchInput={searchInput} handleSearchInputChange={handleSearchInputChange} />
            <MDBTable align='middle'>
                <MDBTableHead>
                    <tr style={{ textAlign: 'center' }}>
                        <th scope='col' width='20%'>Bill id</th>
                        <th scope='col'>Owner name</th>
                        <th scope='col'>Pet name</th>
                        <th scope='col'>Service</th>
                        <th scope='col'></th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody style={{ textAlign: 'center' }}>
                    {appointmentList.map((app) => (
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
                                <div className='ms-3'>
                                    <p className='fw-bold mb-1'>{app.serviceName}</p>
                                    <p className='text-muted mb-0'>{app.servicePrice}</p>
                                </div>
                            </td>
                            <td>
                                <MDBBtn onClick={handleOnPaidClick}>Paid</MDBBtn>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>
        </>
    );
}