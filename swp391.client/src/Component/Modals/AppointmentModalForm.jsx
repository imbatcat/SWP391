import {
    MDBBtn,
    MDBModalHeader,
    MDBModalBody,
    MDBModalTitle,
    MDBCol,
    MDBInput,
    MDBRow
} from 'mdb-react-ui-kit';
import { useUser } from '../../Context/UserContext';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import openLink from '../../Helpers/OpenLink';
import VetSelectionTable from '../VetSelectionTable/VetSelectionTable';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
    const [buffer, setBuffer] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    

    const apis = [
        `https://localhost:7206/api/pet-management/accounts/${user.id}/pets`,
        `https://localhost:7206/api/time-slot-management/time-slots`,
        `https://localhost:7206/api/account-management/roles/3/accounts`
    ];

    const getData = async () => {
        try {
            const promise = apis.map(api => fetch(api, {
                method: 'GET',
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

    const addAppointment = async (data) => {
        console.log(data);
        const makePayment = async () => {
            const fetchPromise = await fetch('https://localhost:7206/api/vn-pay-api-management/make-payment', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });
            console.log(fetchPromise.status);
            if (fetchPromise.status !== 200) throw new Error;
            const responseData = await fetchPromise.json();
            console.log(responseData.url);
            openLink(responseData.url);
        }
        toast.promise(
            makePayment().catch(err => {
                if (buffer.length > 0) {
                    var nextFormData = buffer.shift();
                    setBuffer([]);
                    addAppointment(nextFormData);
                }
                setIsProcessing(false);
                throw err; 
            }),
            {
                pending: 'Processing... You will be directed to payment gateway shortly.',
                error: 'Error registering appointment'
            }
        ).finally(() => {
            setIsProcessing(false);
        });
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Check if all required fields are filled
        if (!formData.petId || !formData.timeSlotId || !formData.veterinarianAccountId || !formData.appointmentDate || !formData.appointmentType) {
            toast.error('Please fill in all required fields.');
            return;
        }
        if (isProcessing) {
            setBuffer((prevBuffer) => [...prevBuffer, formData]);
            return;
        }
        setIsProcessing(true);
        addAppointment(formData);
    };

    const tomorrow = () => {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        return today.toISOString().split('T')[0];
    };

    const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];
    // Check if the selected date is a Sunday
    const isSunday = (dateString) => {
        const date = new Date(dateString);
        return date.getDay() === 0;
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (isSunday(value)) {
            toast.error('Appointments cannot be scheduled on Sundays. Please select another date.');
            setFormData({
                ...formData,
                [name]: ''
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    if (isLoading) {
        return (<div>Loading...</div>);
    }

    return (
        <>
            <MDBModalHeader>
                <MDBModalTitle style={{ fontSize: '24px' }}>Appointment Information</MDBModalTitle>
                <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
                <form onSubmit={handleSubmit}>
                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <FormControl fullWidth>
                                <InputLabel id="pet-select-label">Choose your pet</InputLabel>
                                <Select
                                    labelId="pet-select-label"
                                    id="pet-select"
                                    name="petId"
                                    value={formData.petId}
                                    label="Choose your pet"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Choose your pet</em>
                                    </MenuItem>
                                    {petList.map((pet, index) => (
                                        <MenuItem key={index} value={pet.petId}>
                                            {pet.petName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </MDBCol>
                    </MDBRow>

                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <MDBInput
                                id='appDate'
                                name='appointmentDate'
                                label='Appointment Date'
                                type='date'
                                min={tomorrow()}
                                max={maxDate}
                                value={formData.appointmentDate}
                                onChange={handleDateChange}
                            />
                        </MDBCol>
                    </MDBRow>

                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <VetSelectionTable vetList={vetList} formData={formData} handleChange={handleChange} />
                        </MDBCol>
                    </MDBRow>

                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <FormControl fullWidth>
                                <InputLabel id="timeslot-select-label">Choose your time</InputLabel>
                                <Select
                                    labelId="timeslot-select-label"
                                    id="timeslot-select"
                                    name="timeSlotId"
                                    value={formData.timeSlotId}
                                    label="Choose your time"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Choose your time</em>
                                    </MenuItem>
                                    {timeSlotList.map((timeslot, index) => (
                                        <MenuItem key={index} value={timeslot.timeSlotId}>
                                            {timeslot.startTime} - {timeslot.endTime}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </MDBCol>
                    </MDBRow>

                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <MDBInput id='appNotes' name='appointmentNotes' label='Additional Notes' type='text' size='lg' value={formData.appointmentNotes} onChange={handleChange} />
                        </MDBCol>
                    </MDBRow>

                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <FormControl fullWidth>
                                <InputLabel id="appointment-type-select-label">Choose your payment method</InputLabel>
                                <Select
                                    labelId="appointment-type-select-label"
                                    id="appointment-type-select"
                                    name="appointmentType"
                                    value={formData.appointmentType}
                                    label="Choose your payment method"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Choose your payment method</em>
                                    </MenuItem>
                                    <MenuItem value="Deposit">Deposit</MenuItem>
                                </Select>
                            </FormControl>
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
