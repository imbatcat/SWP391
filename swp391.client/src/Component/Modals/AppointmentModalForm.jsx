import {
  MDBBtn,
  MDBModalHeader,
  MDBModalBody,
  MDBModalTitle,
  MDBCol,
  MDBInput,
  MDBRow,
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
import CircularProgressWithLabel from '../CircularProgress/CircularProgressWithLabel';
import LinearProgress from '@mui/material/LinearProgress';

function AppointmentForm({ toggleOpen }) {
  const [user, setUser] = useUser();
  const [vetList, setVetList] = useState([]);
  const [petList, setPetList] = useState([]);
  const [timeSlotList, setTimeSlotList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVetListLoading, setIsVetListLoading] = useState(false);

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
  ];

  const getData = async () => {
    try {
      const promise = apis.map((api) =>
        fetch(api, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
      );
      const [response1, response2] = await Promise.all(promise);
      if (!response1.ok || !response2.ok) {
        throw new Error('Error fetching data');
      }
      const petData = await response1.json();
      const timeslotData = await response2.json();
      setPetList(petData);
      console.log(petData);
      setTimeSlotList(timeslotData);

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

  const getVetList = async () => {
    setIsVetListLoading(true);
    try {
      const response = await fetch(
        `https://localhost:7206/api/account-management/date/${formData.appointmentDate}/time-slot/${formData.timeSlotId}/choose-vet`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      if (!response.ok && response.status !== 404) {
        throw new Error('Error fetching data');
      } else if (response.status === 404) {
        setVetList(null);
      } else {
        const vetData = await response.json();
        setVetList(vetData);
        console.log(vetData);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    } finally {
      setIsVetListLoading(false);
    }
  };

  useEffect(() => {
    if (formData.appointmentDate && formData.timeSlotId) {
      getVetList();
    }
  }, [formData.appointmentDate, formData.timeSlotId]);

  const addAppointment = async (data) => {
    console.log(data);
    const makePayment = async () => {
      if (isProcessing) return;

      setIsProcessing(false);
      setBuffer((prevBuffer) => [...prevBuffer, data]);
      const fetchPromise = await fetch(
        'https://localhost:7206/api/vn-pay-api-management/make-payment',
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        }
      );
      console.log(fetchPromise.status);
      if (fetchPromise.status !== 200) throw new Error();
      const responseData = await fetchPromise.json();
      console.log(responseData.url);
      openLink(responseData.url);
    };
    toast
      .promise(
        makePayment().catch((err) => {
          setIsProcessing(false);
          if (buffer.length > 0) {
            const nextFormData = buffer.shift();
            setBuffer([]);
            addAppointment(nextFormData);
          }
          throw new Error(err);
        }),
        {
          pending:
            'Processing... You will be directed to payment gateway shortly.',
          error: 'Error registering appointment',
        }
      )
      .finally(() => {
        setIsProcessing(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (isSunday(value)) {
      toast.error(
        'Appointments cannot be scheduled on Sundays. Please select another date.'
      );
      setFormData({
        ...formData,
        [name]: '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.petId ||
      !formData.timeSlotId ||
      !formData.veterinarianAccountId ||
      !formData.appointmentDate ||
      !formData.appointmentType
    ) {
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

  const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1))
    .toISOString()
    .split('T')[0];
  const isSunday = (dateString) => {
    const date = new Date(dateString);
    return date.getDay() === 0;
  };
  const tomorrowDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Increment the date by one day
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  console.log(tomorrowDate());

  if (isLoading) {
    return (
      <>
        <MDBModalHeader>
          <MDBModalTitle style={{ fontSize: '24px' }}>
            Appointment Information
          </MDBModalTitle>
          <MDBBtn
            className="btn-close"
            color="none"
            onClick={toggleOpen}
          ></MDBBtn>
        </MDBModalHeader>
        <MDBModalBody style={{ justifyContent: 'center', display: 'flex' }}>
          <CircularProgressWithLabel />
        </MDBModalBody>
      </>
    );
  }

  return (
    <>
      <MDBModalHeader>
        <MDBModalTitle style={{ fontSize: '24px' }}>
          Appointment Information
        </MDBModalTitle>
        <MDBBtn
          className="btn-close"
          color="none"
          onClick={toggleOpen}
        ></MDBBtn>
      </MDBModalHeader>
      <MDBModalBody>
        <form onSubmit={handleSubmit}>
          <MDBRow className="mb-4">
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

          <MDBRow className="mb-4">
            <MDBCol>
              <MDBInput
                id="appDate"
                name="appointmentDate"
                label="Appointment Date"
                type="date"
                min={tomorrowDate()}
                max={maxDate}
                value={formData.appointmentDate}
                onChange={handleDateChange}
              />
            </MDBCol>
          </MDBRow>

          <MDBRow className="mb-4">
            <MDBCol>
              <FormControl fullWidth>
                <InputLabel id="timeslot-select-label">
                  Choose your time
                </InputLabel>
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

          <MDBRow className="mb-4">
            <MDBCol>
              {isVetListLoading && <LinearProgress />}
              <VetSelectionTable
                vetList={vetList}
                formData={formData}
                handleChange={handleChange}
              />
            </MDBCol>
          </MDBRow>

          <MDBRow className="mb-4">
            <MDBCol>
              <MDBInput
                id="appNotes"
                name="appointmentNotes"
                label="Additional Notes"
                type="text"
                size="lg"
                value={formData.appointmentNotes}
                onChange={handleChange}
              />
            </MDBCol>
          </MDBRow>

          <MDBRow className="mb-4">
            <MDBCol>
              <FormControl fullWidth>
                <InputLabel id="appointment-type-select-label">
                  Choose your payment method
                </InputLabel>
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
          <MDBBtn type="submit" outline color="dark" className="mb-4" block>
            Submit
          </MDBBtn>
        </form>
      </MDBModalBody>
    </>
  );
}

export default AppointmentForm;
