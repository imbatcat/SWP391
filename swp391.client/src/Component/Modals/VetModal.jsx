import {
    MDBBtn,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
} from 'mdb-react-ui-kit';
import VetModalForm from './VetModalForm';

function VetModal({ toggleOpen }) {
    return (
        <>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader >
                        <MDBModalTitle>Vet Information</MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <VetModalForm toggleOpen={toggleOpen}></VetModalForm>
                    </MDBModalBody>
                </MDBModalContent>
            </MDBModalDialog>
        </>
    );
}

export default VetModal;