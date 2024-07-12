import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBContainer,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBCol,
    MDBRow,
} from 'mdb-react-ui-kit';
import Spinner from '../../Component/Spinner/Spinner';
import { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import MainLayout from "../../Layouts/MainLayout";
import { toast } from 'react-toastify';
import UserSidebar from "../../Component/UserSidebar/UserSidebar";
import QRCode from 'react-qr-code';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';

function UserAppointments() {
    const [user, setUser] = useUser();
    const [appointmentList, setAppointmentList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [centredModal, setCentredModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const getAppointmentList = async (user) => {
        try {
            const response = await fetch(`https://localhost:7206/api/appointment-management/appointments/accounts/${user.id}/lists/current`, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok && response.status !== 404) {
                throw new Error('Error fetching data');
            } else if (response.status === 404) {
                setAppointmentList(null);
            
            } else {
                const userData = await response.json();
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
        if (user) getAppointmentList(user);
    }, [user]);

    const toggleOpen = (appointment = null) => {
        setSelectedAppointment(appointment);
        setCentredModal(!centredModal);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Sort appointments by date
    const sortedAppointmentList = [...appointmentList].sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

    return (
        <>
            <MainLayout>
                <section style={{ backgroundColor: '#eee' }}>
                    <MDBContainer className="py-5">
                        <MDBRow>
                            <MDBCol lg="4">
                                <UserSidebar />
                            </MDBCol>

                            <MDBCol>
                                <MDBCard className="mb-4 mb-lg-0">
                                    <MDBCardBody className="p-0">
                                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                            <TableContainer sx={{ maxHeight: 440 }}>
                                                <Table stickyHeader aria-label="sticky table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>No</TableCell>
                                                            <TableCell>Pet name</TableCell>
                                                            <TableCell>Veterinarian</TableCell>
                                                            <TableCell>Time slot</TableCell>
                                                            <TableCell>Date</TableCell>
                                                            <TableCell>Booking price</TableCell>
                                                            <TableCell>Status</TableCell>
                                                            <TableCell>Details</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {isLoading ? (
                                                            <TableRow>
                                                                <TableCell colSpan="8">
                                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                                        <Spinner />
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            sortedAppointmentList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((appointment, index) => (
                                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                                    <TableCell>{appointment.petName}</TableCell>
                                                                    <TableCell>{appointment.veterinarianName}</TableCell>
                                                                    <TableCell>{appointment.timeSlot}</TableCell>
                                                                    <TableCell>{appointment.appointmentDate}</TableCell>
                                                                    <TableCell>{appointment.bookingPrice}</TableCell>
                                                                    <TableCell>{appointment.appointmentStatus}</TableCell>
                                                                    <TableCell>
                                                                        <MDBBtn size="sm" onClick={() => toggleOpen(appointment)}>Details</MDBBtn>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <TablePagination
                                                rowsPerPageOptions={[10, 25, 100]}
                                                component="div"
                                                count={appointmentList.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            />
                                        </Paper>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </section>
            </MainLayout>

            {selectedAppointment && (
                <MDBModal tabIndex='-1' open={centredModal} onClose={() => setCentredModal(false)}>
                    <MDBModalDialog centered>
                        <MDBModalContent>
                            <MDBModalHeader>
                                <MDBModalTitle>Appointment for {selectedAppointment.petName}</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                            </MDBModalHeader>
                            <MDBModalBody>
                                <MDBRow>
                                    <MDBCol style={{ textAlign: 'center', justifyContent: 'center', alignContent: 'center' }} size='6'>
                                        <p className='Appointment-detail'>Veterinarian: {selectedAppointment.veterinarianName}</p>
                                        <p className='Appointment-detail'>Time slot: {selectedAppointment.timeSlot}</p>
                                        <p className='Appointment-detail'>Booking price: {selectedAppointment.bookingPrice}</p>
                                    </MDBCol>
                                    <MDBCol style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }} size='6'>
                                        <QRCode size={125} value={selectedAppointment.appointmentId} />
                                    </MDBCol>
                                </MDBRow>
                            </MDBModalBody>
                            <MDBModalFooter>
                                <MDBBtn color='secondary' onClick={toggleOpen}>Close</MDBBtn>
                            </MDBModalFooter>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            )}
        </>
    );
}

export default UserAppointments;
