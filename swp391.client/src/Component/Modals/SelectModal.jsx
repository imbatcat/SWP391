import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBCardBody,
    MDBCard,
    MDBCardHeader,
} from 'mdb-react-ui-kit';
import { useState } from 'react';
import PetModal from './PetModal';
import AppointmentModal from './AppointmentModal';
import CheckAuth from '../../Helpers/CheckAuth';
import img3 from '../../assets/images/hero3.png';
import img2 from '../../assets/images/appointment1.jpg';

function SelectModal({ toggleOpen }) {
    const [isPetModal, setIsPetModal] = useState(false);
    const [isAppModal, setIsAppModal] = useState(false);

    const choosePet = () => {
        setIsPetModal(!isPetModal);
    };
    const chooseApp = () => {
        setIsAppModal(!isAppModal);
    };
    if (isPetModal) {
        return (<PetModal toggleOpen={toggleOpen}></PetModal>);
    }
    if (isAppModal) {
        return (<AppointmentModal toggleOpen={toggleOpen}></AppointmentModal>);
    }
    return (
        <CheckAuth>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle style={{ fontSize: '24px' }}>Select which to create</MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <MDBContainer>
                            <MDBRow>
                                <MDBCol className='mb-5'>
                                    <MDBCard alignment='center'>
                                        <MDBCardHeader>Create New Pet</MDBCardHeader>
                                        <MDBCardBody>
                                            <img src={img3} className='w-100' alt='...' />
                                            <MDBBtn onClick={choosePet} style={{marginTop:'15px'}} color='danger'>
                                                PET
                                            </MDBBtn>
                                        </MDBCardBody>

                                    </MDBCard>

                                </MDBCol>
                                <MDBCol className='mb-5 col-6'>
                                    <MDBCard alignment='center'>
                                        <MDBCardHeader>Book an appointment</MDBCardHeader>
                                        <MDBCardBody>
                                            <img src={img2} className='w-100' alt='...' />
                                            <MDBBtn onClick={chooseApp} style={{marginTop:'15px'}} color='danger'>
                                                APPOINTMENT
                                            </MDBBtn>
                                        </MDBCardBody>

                                    </MDBCard>

                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>
                    </MDBModalBody>

                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={toggleOpen}>
                            Close
                        </MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </CheckAuth >

    );
}

export default SelectModal;