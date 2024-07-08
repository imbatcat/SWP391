import './HomeContent.css';
import {
    MDBRipple,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBRow,
    MDBCol,
    MDBModal,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog,
    MDBModalHeader,
    MDBModalTitle
} from 'mdb-react-ui-kit';
import img from '../../assets/images/dogandcatlogin.png'
import { useState, useEffect } from 'react';
import AppointmentForm from '../Modals/AppointmentModalForm';
import SelectModal from '../Modals/SelectModal';
import AOS from 'aos';
import 'aos/dist/aos.css';

function HomeContent() {
    const [basicModal, setBasicModal] = useState(false);

    const toggleOpen = () => setBasicModal(!basicModal);

    useEffect(() => {
        AOS.init({ duration: 500 });
    }, []);

    return (
        <div>
        <MDBCard>
            <div className='page-about-container' data-aos="fade-up">
                <div>
                    <h1 style={{ textAlign: 'center', marginTop: '30px ' }}>About Our Service</h1>
                    <p className='page-about-content'>We are a team of committed, compassionate veterinary
                        professionals with the experience required to operate our veterinary hospitals with
                        the excellence that pet owners and the staff that serve them expect.
                    </p>
                </div>
            </div>

            <MDBRow className='g-0'>
                <MDBCol col='6' data-aos="fade-right">
                    <MDBRipple>
                        <img src={img} className='d-block w-100 img-fit ' alt='...' />
                    </MDBRipple>
                </MDBCol>

                <MDBCol col='6' data-aos="fade-left">
                    <MDBCardBody style={{ maxHeight: '38vw' }} className='d-flex flex-column'>
                        <h5 className="fw-bold my-5" style={{ letterSpacing: '1px', textAlign: 'center', fontSize: '4vw' }}>What's Next </h5>
                        <div className="WN-Content">1. Call us or schedule an appointment online.</div>
                        <div className="WN-Content">2. Meet with a doctor for an initial exam.</div>
                        <div className="WN-Content">3. Put a plan together for your pet.</div>
                        <div className='WN-Content-btn'>
                            <MDBBtn className="mb-4 px-5" color='muted' onClick={toggleOpen} style={{ fontSize: '1.2vw', color: 'black', width: '30vw', margin: 'auto', alignContent: 'center' }}>
                                Make an Appointment
                            </MDBBtn>
                            
                        </div>
                    </MDBCardBody>
                </MDBCol>
            </MDBRow>
        </MDBCard>
        <div>
            <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
                <SelectModal toggleOpen={toggleOpen} />
            </MDBModal>
        </div>
        </div>
    );
}

export default HomeContent;
