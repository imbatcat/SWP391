import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBBadge,
    MDBCardImage,
    MDBTable, MDBTableBody, MDBTableHead,
    MDBCardText,
    MDBCol,
    MDBContainer,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBIcon,
    MDBListGroup,
    MDBListGroupItem,
    MDBRow,
} from 'mdb-react-ui-kit';
import { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import MainLayout from "../../Layouts/MainLayout";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import UserSidebar from "../../Component/UserSidebar/UserSidebar";

function UserAppointments() {
    const [user, setUser] = useUser();
    const [appointmentList, setAppointmentList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [centredModal, setCentredModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const getAppointmentList = async (user) => {
        try {
            const response = await fetch(`https://localhost:7206/api/appointment-management/appointments/accounts/${user.id}/lists/current`, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok && response.status != 404) {
                throw new Error('Error fetching data');
            }
            else if (response.status == 404) {
                setAppointmentList(null);
            }
            else {
                var userData = await response.json();
                setAppointmentList(userData);
                console.log(userData);
            }
        } catch (error) {
            toast.error(error.message);
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user)
            getAppointmentList(user);
    }, [user]);

    if (isLoading) {
        return <div>Loading...</div>; // Loading state
    }
    const toggleOpen = (Appointment = null) => {
        setSelectedAppointment(Appointment);
        setCentredModal(!centredModal);
    };
    return (
        <>
            <MainLayout>
                <section style={{ backgroundColor: '#eee' }}>
                    <MDBContainer className="py-5">
                        <MDBRow>
                            <MDBCol lg="4">
                                <UserSidebar></UserSidebar>
                            </MDBCol>

                            <MDBCol>
                                <MDBCard className="mb-4 mb-lg-0">
                                    <MDBCardBody className="p-0">
                                        {appointmentList && appointmentList.length > 0 ? (
                                            <MDBTable align='middle'>
                                                <MDBTableHead>
                                                    <tr>
                                                        <th scope='col'>Pet name</th>
                                                        <th scope='col'>Veterinarian</th>
                                                        <th scope='col'>Time slot</th>
                                                        <th scope='col'>Date</th>
                                                        <th scope='col'>Booking price</th>
                                                        <th scope='col'>Status</th>
                                                    </tr>
                                                </MDBTableHead>
                                                <MDBTableBody>
                                                    {appointmentList.map((appointment, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <div className='d-flex align-items-center'>
                                                                    <p className='fw-bold mb-1'>{appointment.petName}</p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <p className='fw-normal mb-1'>{appointment.veterinarianName}</p>
                                                            </td>
                                                            <td>
                                                                <p className='fw-normal mb-1'>{appointment.timeSlot}</p>
                                                            </td>
                                                            <td>
                                                                <p className='fw-normal mb-1'>{appointment.appointmentDate}</p>
                                                            </td>
                                                            <td>
                                                                <p className='fw-normal mb-1'>{appointment.bookingPrice}</p>
                                                            </td>
                                                            <td>
                                                                <p className='fw-normal mb-1'>{appointment.appointmentStatus}</p>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </MDBTableBody>
                                            </MDBTable>
                                        ) : (
                                            <div>No upcoming appointments</div>
                                        )}

                                        {
                                            selectedAppointment && (
                                                <MDBModal tabIndex='-1' open={centredModal} onClose={() => setCentredModal(false)}>
                                                    <MDBModalDialog centered>
                                                        <MDBModalContent>
                                                            <MDBModalHeader>
                                                                <MDBModalTitle>Appointment for {selectedAppointment.petName}</MDBModalTitle>
                                                                <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                                                            </MDBModalHeader>
                                                            <MDBModalBody>
                                                                <p className='Appointment-detail'>Veterinarian: {selectedAppointment.veterinarianName}</p>
                                                                <p className='Appointment-detail'>Time slot: {selectedAppointment.timeSlot}</p>
                                                                <p className='Appointment-detail'>Booking price: {selectedAppointment.bookingPrice}</p>
                                                            </MDBModalBody>
                                                            <MDBModalFooter>
                                                            </MDBModalFooter>
                                                        </MDBModalContent>
                                                    </MDBModalDialog>
                                                </MDBModal>
                                            )
                                        }
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </section>
            </MainLayout >
        </>
    );
}

export default UserAppointments;