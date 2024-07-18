import React from 'react';
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter
} from 'mdb-react-ui-kit';
import UserPetForm from './UserPetForm';

const UserPetModal = ({ centredModal, toggleOpen, selectedPet }) => {
    return (
        <MDBModal tabIndex='-1' open={centredModal} setShow={toggleOpen}>
            <MDBModalDialog size='lg'  centered>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Detail of {selectedPet.petName}</MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody style={{ minHeight:'350px'}}>
                        <UserPetForm selectedPet={selectedPet}/>
                    </MDBModalBody>
                    <MDBModalFooter>
                        {/* Add any footer buttons or actions here if needed */}
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
    );
};

export default UserPetModal;
