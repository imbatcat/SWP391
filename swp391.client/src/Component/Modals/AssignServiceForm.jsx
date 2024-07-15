import {
    MDBBadge,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardText,
    MDBCardTitle,
    MDBCol,
    MDBRow,
    MDBTable,
    MDBTableBody,
    MDBTableHead,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBCardFooter
} from 'mdb-react-ui-kit';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import ReactToPrint from 'react-to-print';
import QRCode from 'react-qr-code';
function AssignServiceForm({ mRecId, petData, ownerData, vetData, appointment, toggleOpen }) {
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const toggleModal = () => setModalOpen(!modalOpen);
    const componentRef = useRef();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('https://localhost:7206/api/service-order-management/services', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error("Error fetching data");
                }
                const data = await response.json();
                setServices(data);
                console.log(data);
            } catch (error) {
                console.error(error.message);
            }
        }

        fetchData();
    }, []);

    const calculatePetAge = (petDOB) => {
        const birthDate = new Date(petDOB);
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return `${years} Year${years !== 1 ? 's' : ''} ${months} Month${months !== 1 ? 's' : ''} and ${days} Day${days !== 1 ? 's' : ''}`;
    };

    const handleAddService = (service) => {
        if (!isServiceSelected(service.id)) {
            setSelectedServices((prevServices) => [...prevServices, service]);
        }
    };
    const handleRemoveService = (serviceId) => {
        setSelectedServices((prevServices) => prevServices.filter(service => service.serviceId !== serviceId));
    };
    const handleSubmitService = async () => {
        const submitServices = async () => {
            let serviceIdList = selectedServices.map(item => item.serviceId);
            const reqBody = {
                'serviceId': serviceIdList,
                'medicalRecordId': mRecId
            };
            console.log(JSON.stringify(reqBody));
            const fetchPromise = await fetch('https://localhost:7206/api/service-order-management/service-orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(reqBody)
            });
            if (fetchPromise.status !== 200) throw new Error();
        }

        toast.promise(
            submitServices().catch(err => {
                console.error(err)
                throw new Error(err.message);
            }),
            {
                pending: 'Submitting your request...',
                success: 'Request submitted successfully!',
                error: "There's something wrong" 
            }
        );
    };


    const isServiceSelected = (serviceId) => {
        return selectedServices.some(service => service.serviceId === serviceId);
    };

    const calculateTotalPrice = () => {
        return selectedServices.reduce((total, service) => total + service.servicePrice, 0);
    };
    
    return (
        <div ref={componentRef}>
            <style>
                {`
                    @media print {
                        body {
                            margin: 0;
                        .no-print {
                            display: none !important;
                        }
                        .print-container {
                            width: 100vw;
                            height: 100vh;
                            padding: 0;
                            margin: 0;
                        }
                        .print-container .mdb-card {
                            border: none;
                            margin: 0;
                            padding: 0;
                        }
                    }
                `}
            </style>
            <MDBCard className="print-container" style={{ minHeight: '60vw', minWidth: '100%', maxWidth: '100vw', margin: 'auto' }}>
                <MDBCardHeader style={{ textAlign: 'center', fontSize: '3vw' }}>
                
                    <MDBRow className='mb-2' style={{ alignItems: 'center' }}>
                        <MDBCol size='8' style={{textAlign:'end', fontSize:'40px'}}>Medical Record</MDBCol>
                        <MDBCol size='4' style={{justifyContent:'end', display:'flex'}}>
                            <QRCode size={100} value={appointment.appointmentId}/>
                        </MDBCol>
                    </MDBRow>
                
                </MDBCardHeader>
                <MDBCardBody style={{ height: '5' }} scrollable >
                    <MDBRow style={{ marginLeft: '15px', marginRight: '15px' }}>
                        <MDBCol sm='6'>
                            <MDBCard>
                                <MDBCardBody>
                                    <MDBCardTitle style={{ textAlign: 'center' }}>Owner Information</MDBCardTitle>
                                    <MDBCardText>
                                        <div style={{ textAlign: 'center' }}>
                                            <p className='fw-bold mb-1'>{ownerData.fullName}</p>
                                            <p className='text-muted mb-0'>{ownerData.phoneNumber}</p>
                                        </div>
                                    </MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                            <br />
                            <MDBCard>
                                <MDBCardBody>
                                    <MDBCardTitle style={{ textAlign: 'center' }}>Veterinarian Information</MDBCardTitle>
                                    <MDBCardText>
                                        <div style={{ textAlign: 'center' }}>
                                            <p className='fw-bold mb-1'>{vetData.fullName}</p>
                                            <p className='text-muted mb-0' style={{ fontSize: '1rem' }}>{vetData.position}</p>
                                        </div>
                                    </MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol sm='6'>
                            <MDBCard style={{ minHeight: '100%' }}>
                                <MDBCardBody>
                                    <MDBCardTitle style={{ textAlign: 'center' }}>Pet Information</MDBCardTitle>
                                    <MDBCardText>
                                        <div style={{ textAlign: 'center' }}>
                                            <p className='fw-bold mb-1'>{petData.petName}</p>
                                            <p className='text-muted mb-0'>{petData.petAge}</p>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <MDBBadge color={petData.isCat ? 'warning' : 'primary'} pill>
                                                {petData.isCat ? "Cat" : "Dog"}
                                            </MDBBadge>
                                            <MDBBadge color={petData.isMale ? 'primary' : 'danger'} pill>
                                                {petData.isMale ? "Male" : "Female"}
                                            </MDBBadge>
                                        </div>
                                        <p className='text-muted mb-0'>- Pet Age: {calculatePetAge(petData.petAge)} </p>
                                        <p className='text-muted mb-0'>- Pet Breed: {petData.petBreed} </p>
                                    </MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                    <br />

                    <MDBRow style={{ marginLeft: '15px', marginRight: '15px' }}>
                        <MDBCard>
                            <MDBCardHeader>
                                <MDBRow>
                                    <MDBCol sm='9'>
                                        Medical Service Information
                                    </MDBCol>
                                    <MDBCol sm='3' className='no-print' >
                                        <MDBBtn style={{ fontSize: '0.65rem' }} onClick={toggleModal}>Add Services</MDBBtn>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardHeader>
                            <MDBCardBody>
                                <MDBCardText>
                                    <MDBTable style={{ minWidth: '100%' }} align='middle'>
                                        <MDBTableHead>
                                            <tr>
                                                <th scope='col'>No</th>
                                                <th scope='col'>Service Name</th>
                                                <th scope='col'>Service Price</th>
                                            </tr>
                                        </MDBTableHead>
                                        <MDBTableBody>
                                            {selectedServices.map((ser, index) => (
                                                <tr key={ser.serviceId}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className='ms-3'>
                                                            <p className='fw-bold mb-1'>{ser.serviceName}</p>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p className='fw-normal mb-1'>{ser.servicePrice}</p>
                                                    </td>
                                                    <td>
                                                        <MDBBtn className='no-print' color='danger' onClick={() => handleRemoveService(ser.serviceId)}>x</MDBBtn>
                                                    </td>
                                                </tr>
            

                                            ))}
                                            <tr>
                                                <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Price:</td>
                                                <td colSpan="2" style={{ fontWeight: 'bold' }}>{calculateTotalPrice()}</td>
                                            </tr>
                                        </MDBTableBody>
                                    </MDBTable>
                                </MDBCardText>
                                <MDBBtn className='no-print' type="submit" onClick={() => handleSubmitService()}>Submit</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBRow>
                </MDBCardBody>
                <MDBCardFooter>
                    <ReactToPrint
                        trigger={() => {
                            return <MDBBtn className='no-print'>Print</MDBBtn>;
                        }}
                        content={() => componentRef.current}
                        documentTitle='Pet-ternary'
                        pageStyle="@media print { body { margin: 0; } .print-container { width: 100vw; height: 100vh; } }"
                    />
                </MDBCardFooter>
            </MDBCard>

            <MDBModal open={modalOpen} onClose={() => setModalOpen(false)} tabIndex='-1'>
                <MDBModalDialog scrollable style={{ minWidth: 'fit-content' }}>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Select Services</MDBModalTitle>
                            <MDBBtn
                                className='btn-close'
                                color='none'
                                onClick={toggleModal}
                            ></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <MDBTable style={{ minWidth: '100%' }} align='middle'>
                                <MDBTableHead>
                                    <tr>
                                        <th scope='col'>No</th>
                                        <th scope='col'>Service Name</th>
                                        <th scope='col'>Service Price</th>
                                        <th scope='col'>Action</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {services.map((ser, index) => (
                                        <tr key={ser.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className='ms-3'>
                                                    <p className='fw-bold mb-1'>{ser.serviceName}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <p className='fw-normal mb-1'>{ser.servicePrice}</p>
                                            </td>
                                            <td>
                                                <MDBBtn
                                                    color='primary'
                                                    style={{ color: 'black' }}
                                                    rounded
                                                    size='sm'
                                                    onClick={() => handleAddService(ser)}
                                                    disabled={isServiceSelected(ser.serviceId)}
                                                >
                                                    {isServiceSelected(ser.serviceId) ? 'Added' : 'Add'}
                                                </MDBBtn>
                                            </td>
                                        </tr>
                                    ))}
                                </MDBTableBody>
                            </MDBTable>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={toggleModal} >
                                Close
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </div>
    );
}

export default AssignServiceForm;
