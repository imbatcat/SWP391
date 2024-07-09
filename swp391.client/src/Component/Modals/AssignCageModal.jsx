import {
    MDBBtn,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog,
    MDBModalHeader,
    MDBModalTitle
} from 'mdb-react-ui-kit';
import AssignServiceForm from './AssignServiceForm';
import AssignCageForm from './AssignCageForm';

function AssignCageModal({ mRecId, petData, ownerData, vetData, toggleOpen }) {

    return (
        <>
            <MDBModalDialog style={{ minWidth: 'fit-content' }}>
                <MDBModalContent>
                    <MDBModalHeader >
                        <MDBModalTitle>Assign Cage Form</MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <AssignCageForm mRecId={mRecId} petData={petData} ownerData={ownerData} vetData={vetData} toggleOpen={toggleOpen} />
                    </MDBModalBody>
                </MDBModalContent>
            </MDBModalDialog>
        </>
    );
}
export default AssignCageModal;