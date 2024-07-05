import {
    MDBBtn,
    MDBCheckbox,
    MDBModalHeader,
    MDBModalBody,
    MDBModalTitle,
    MDBCol,
    MDBInput,
    MDBRow
} from 'mdb-react-ui-kit';
import { useUser } from '../../Context/UserContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as svg from '@fortawesome/free-solid-svg-icons';
import openLink from '../../Helpers/OpenLink';
import VetSelectionTable from '../VetSelectionTable/VetSelectionTable';

function AppointmentForm({ toggleOpen }) {
    const [user, setUser] = useUser();
    const [vetList, setVetList] = useState([]);
    const [petList, setPetList] = useState([]);
    const [timeSlotList, setTimeSlotList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        accountId: user.id,
        petId: '',
        timeSlotId: '',
        veterinarianAccountId: '',
        appointmentDate: '',
        appointmentNotes: '',
        appointmentType: '',
    });

    const apis = [
        `https://localhost:7206/api/pet-management/accounts/${user.id}/pets`,
        `https://localhost:7206/api/time-slot-management/time-slots`,
        `https://localhost:7206/api/account-management/roles/3/accounts`
    ];
    const getData = async () => {
        try {
            const promise = apis.map(api => fetch(api, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }));
            const [response1, response2, response3] = await Promise.all(promise);
            if (!response1.ok || !response2.ok || !response3.ok) {
                throw new Error("Error fetching data");
            }
            var petData = await response1.json();
            var timeslotData = await response2.json();
            var vetData = await response3.json();
            setPetList(petData);
            setTimeSlotList(timeslotData);
            setVetList(vetData);

            //console.log(petData);
            console.log(timeslotData);
        } catch (error) {
            toast.error('Error getting user details!');
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const addAppointment = async () => {
        console.log(formData);
        const fetchPromise = fetch('https://localhost:7206/api/vn-pay-api-management/make-payment', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });

        toast.promise(
            fetchPromise,
            {
                pending: 'Processing... You will be directed to payment gateway shortly.',
                error: 'Error registering appointment'
            }
        );

        try {
            const response = await fetchPromise;
            var data = await response.json();
            openLink(data.url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };
    if (isLoading) {
        return (<div>Loading...</div>);
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        //console.log(name, value);
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        addAppointment(formData);
    };
    const tomorrow = () => {
        const today = new Date(); // Get today's date in YYYY-MM-DD format
        today.setDate(today.getDate() + 1);
        return today.toISOString().split('T')[0];
    };

    const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]; // One month from today

    return (
        <>
            <MDBModalHeader >
                <MDBModalTitle style={{ fontSize: '24px' }}>Appointment Information <FontAwesomeIcon icon={svg.faCircleQuestion} /></MDBModalTitle>
                <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
                <form onSubmit={handleSubmit}>
                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <select name="petId" value={formData.petId} onChange={handleChange} data-mdb-select-init >
                                <option value="" disabled>Choose your pet</option>
                                {petList.map((pet, index) => (
                                    <option key={index} value={pet.petId}>
                                        {pet.petName}
                                    </option>
                                ))}
                            </select>
                        </MDBCol>
                    </MDBRow>

                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <select name="timeSlotId" value={formData.timeSlotId} onChange={handleChange} data-mdb-select-init >
                                <option value="" disabled>Choose your time</option>
                                {timeSlotList.map((timeslot, index) => (
                                    <option key={index} value={timeslot.timeSlotId}>
                                        {timeslot.startTime} - {timeslot.endTime}
                                    </option>
                                ))}
                            </select>
                        </MDBCol>
                    </MDBRow>

                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <VetSelectionTable vetList={vetList} formData={formData} handleChange={handleChange} />
                        </MDBCol>
                    </MDBRow>

                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <MDBInput id='appDate' name='appointmentDate' label='Appointment Date' type='date' min={tomorrow()} max={maxDate} value={formData.appointmentDate} onChange={handleChange} />
                        </MDBCol>
                    </MDBRow>

                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <MDBInput id='appNotes' name='appointmentNotes' label='Additional Notes' type='text' size='lg' value={formData.appointmentNotes} onChange={handleChange} />
                        </MDBCol>
                    </MDBRow>

                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <select name="appointmentType" value={formData.appointmentType} onChange={handleChange} data-mdb-select-init >
                                <option value="" disabled>Choose your payment method</option>
                                <option value="Deposit">Deposit</option>
                                <option value="Fully paid">Fully paid</option>
                            </select>
                        </MDBCol>
                    </MDBRow>
                    <MDBBtn type='submit' outline color='dark' className='mb-4' block>
                        Submit
                    </MDBBtn>
                </form>
            </MDBModalBody>

        </>
    );
}

export default AppointmentForm;