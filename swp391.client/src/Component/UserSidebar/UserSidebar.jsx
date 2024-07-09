import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCardText,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBListGroup,
    MDBListGroupItem,
    MDBProgress,
    MDBProgressBar,
    MDBRow
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
function UserSidebar() {
    return (
        <>
            <MDBCard className="mb-4">
                <MDBCardBody className="text-center">
                    <MDBCardImage
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                        alt="avatar"
                        className="rounded-circle"
                        style={{ width: '150px' }}
                        fluid />
                </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0">
                <MDBCardBody className="p-0">
                    <MDBListGroup flush className="rounded-3">
                        <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <Link to='/user/profile'>
                                Profile
                            </Link>
                        </MDBListGroupItem>
                        <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <Link to='/user/pets'>
                                Pet list
                            </Link>

                        </MDBListGroupItem>
                        <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <Link to='/user/appointments'>
                                Appointments
                            </Link>
                        </MDBListGroupItem>
                        <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <Link to='/user/old-appointments'>
                                Historical appointments
                            </Link>
                        </MDBListGroupItem>
                    </MDBListGroup>
                </MDBCardBody>
            </MDBCard>
        </>
    );
}

export default UserSidebar;