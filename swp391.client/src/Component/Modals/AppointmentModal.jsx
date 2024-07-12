import {
    MDBBtn,
    MDBModal,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog,
    MDBModalHeader,
    MDBModalTitle
} from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react';
import AppointmentForm from '../Modals/AppointmentModalForm';
import PaymentModal from './PaymentModal';


function AppointmentModal({ toggleOpen }) {
    // This represents the step count from stepper
    const [stepData, setStepData] = useState(0);

    return (
        <>
            <MDBModalDialog size='lg'>
                <MDBModalContent>
                    {stepData == 0 && <AppointmentForm toggleOpen={toggleOpen}></AppointmentForm>}

                </MDBModalContent>
            </MDBModalDialog>
        </>);
}
export default AppointmentModal;