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
    MDBCard,
    MDBCardHeader,
    MDBCardBody
} from 'mdb-react-ui-kit';
import { useState } from 'react';
import VetModal from './VetModal';
import StaffModal from './StaffModal';
import CheckAuth from '../../Helpers/CheckAuth';
import img3 from '../../assets/images/hero3.png';
function SelectAccountModal({ toggleOpen }) {
    const [isVetModal, setIsVetModal] = useState(false);
    const [isStaffModal, setIsStaffModal] = useState(false);

    const chooseVet = () => {
        setIsVetModal(!isVetModal);
    };
    const chooseStaff = () => {
        setIsStaffModal(!isStaffModal);
    };
    if (isVetModal) {
        return (<VetModal toggleOpen={toggleOpen}></VetModal>);
    }
    if (isStaffModal) {
        return (<StaffModal toggleOpen={toggleOpen} ></StaffModal>);
    }
    return (
        <CheckAuth>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle style={{ fontSize: '24px' }}>Select which to create</MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={toggleOpen} />
                    </MDBModalHeader>
                    <MDBModalBody>
                        <MDBContainer>
                            <MDBRow>
                                <MDBCol className='mb-5'>
                                    <MDBCard alignment='center'>
                                        <MDBCardHeader>Veterinarian Account</MDBCardHeader>
                                        <MDBCardBody>
                                            <img src={img3} className='w-100' alt='...' />
                                            <MDBBtn onClick={chooseVet} style={{marginTop:'10px'}} color='danger'>Veterinarian</MDBBtn>
                                        </MDBCardBody>
                                    </MDBCard> 
                                </MDBCol>
                                <MDBCol className='mb-5'>
                                    <MDBCard alignment='center'>
                                        <MDBCardHeader>Staff Account</MDBCardHeader>
                                        <MDBCardBody>
                                            <img src={img3} className='w-100' alt='...' />
                                            <MDBBtn onClick={chooseStaff} style={{marginTop:'10px'}} color='danger'>Staff</MDBBtn>
                                        </MDBCardBody>
                                    </MDBCard> 
                                </MDBCol>
                            </MDBRow>
                                
                        </MDBContainer>
                    </MDBModalBody>
                </MDBModalContent>
            </MDBModalDialog>
        </CheckAuth>
    );
}

export default SelectAccountModal;