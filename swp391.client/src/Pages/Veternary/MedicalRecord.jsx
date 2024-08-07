import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBCardHeader,
  MDBBadge,
  MDBInputGroup,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';
import AssignServiceModal from '../../Component/Modals/AssignServiceModal';
import AssignCageModal from '../../Component/Modals/AssignCageModal';

async function fetchOwnerAndPetData(accountId, petId, vetId) {
  try {
    const [accountResponse, petResponse, vetResponse] = await Promise.all([
      fetch(
        `https://localhost:7206/api/account-management/accounts/${accountId}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      ),
      fetch(`https://localhost:7206/api/pet-management/pets/${petId}`, {
        method: 'GET',
        credentials: 'include',
      }),
      fetch(`https://localhost:7206/api/account-management/accounts/${vetId}`, {
        method: 'GET',
        credentials: 'include',
      }),
    ]);

    if (!accountResponse.ok) {
      throw new Error('Error fetching account data');
    }
    if (!petResponse.ok) {
      throw new Error('Error fetching pet data');
    }

    const accountData = await accountResponse.json();
    const petData = await petResponse.json();
    const vetData = await vetResponse.json();

    return { accountData, petData, vetData };
  } catch (error) {
    console.error(error.message);
    return { accountData: null, petData: null, vetData: null };
  }
}

function MedicalRecord() {
  const location = useLocation();
  const appointment = location.state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [medRecloading, setMedRecLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingRecord, setExistingRecord] = useState(null);
  const [showBackModal, setShowBackModal] = useState(false);

  useEffect(() => {
    async function getMedicalRecord() {
      console.log(appointment);
      try {
        const response = await fetch(
          `https://localhost:7206/api/medical-record-management/appointments/${appointment.appointmentId}/medical-records`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        let data = null;
        if (response.status === 204) {
          const reqBody = {
            appointmentId: appointment.appointmentId,
            petId: appointment.petId,
          };
          const response1 = await fetch(
            `https://localhost:7206/api/medical-record-management/medical-records/create-empty`,
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(reqBody),
            }
          );
          data = await response1.json();
        } else {
          data = await response.json();
        }
        console.log(data);
        setFormData(data);
        setExistingRecord(data);
      } catch (error) {
        console.log(error);
      } finally {
        setMedRecLoading(false);
      }
    }
    getMedicalRecord();
  }, [appointment.appointmentId]);

  const [buffer, setBuffer] = useState([]);
  const [ownerData, setOwnerData] = useState(null);
  const [assignServiceModal, setAssignServiceModal] = useState(false);
  const [assignCageModal, setAssignCageModal] = useState(false);
  const toggleAssignServiceOpen = () =>
    setAssignServiceModal(!assignServiceModal);
  const toggleAssignCageOpen = () => setAssignCageModal(!assignCageModal);
  const [assignModal, setAssignModal] = useState(false);
  const [petData, setPetData] = useState(null);
  const [vetData, setVetData] = useState(null);
  const [formData, setFormData] = useState({
    petId: appointment.petId,
    appointmentId: appointment.appointmentId,
    petWeight: '',
    symptoms: '',
    allergies: '',
    diagnosis: '',
    additionalNotes: '',
    followUpAppointmentDate: '',
    followUpAppointmentNotes: '',
    drugPrescriptions: '',
  });

  useEffect(() => {
    if (appointment) {
      fetchOwnerAndPetData(
        appointment.accountId,
        appointment.petId,
        appointment.veterinarianId
      )
        .then(({ accountData, petData, vetData }) => {
          setOwnerData(accountData);
          setPetData(petData);
          setVetData(vetData);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      setError('No appointment data provided');
      setLoading(false);
    }
  }, [appointment]);

  if (loading || medRecloading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!ownerData || !petData) {
    return <div>No data available</div>;
  }

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

    return `${years} Year${years !== 1 ? 's' : ''} ${months} Month${
      months !== 1 ? 's' : ''
    } and ${days} Day${days !== 1 ? 's' : ''}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e, reqBody) => {
    e.preventDefault();
    console.log(existingRecord);

    // Validation
    const emptyFields = Object.keys(formData).filter((key) => !formData[key]);
    if (emptyFields.length > 0) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!reqBody) {
      reqBody = {
        ...formData,
        petId: appointment.petId,
        appointmentId: appointment.appointmentId,
      };
    } else {
      setBuffer((prevBuffer) => [...prevBuffer, reqBody]);
      return;
    }

    const putApi = async () => {
      const response = await fetch(
        `https://localhost:7206/api/medical-record-management/medical-records/${formData.medicalRecordId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqBody),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      // console.log('Saved');
      navigate('/vet/WorkSchedule');
    };

    toast
      .promise(
        putApi().catch((err) => {
          console.error('Error:', error);
          toast.error(`Error: ${error.message}`);
          throw new Error(err.message);
        }),
        {
          pending: 'Saving record...',
          success: 'Medical Record Updated Successfully',
          error: 'Failed to save record!',
        }
      )
      .finally(() => {
        handleBuffer();
      });
  };

  const handleBuffer = async () => {
    if (buffer.length > 0) {
      const nextForm = buffer.shift();
      await handleSubmit({ preventDefault: () => {} }, nextForm);
    }
  };

  const handleBackClick = () => {
    setShowBackModal(true);
  };

  const handleCloseBackModal = () => {
    setShowBackModal(false);
  };

  const handleConfirmBack = () => {
    setShowBackModal(false);
    navigate('/vet/WorkSchedule');
  };

  let today = new Date();

  let tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  let dd = String(tomorrow.getDate()).padStart(2, '0');
  let mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  let yyyy = tomorrow.getFullYear();

  return (
    <div>
      <MDBCard
        style={{
          minHeight: '60vw',
          maxWidth: '50vw',
          margin: 'auto',
          marginTop: '50px',
        }}
      >
        <MDBCardHeader style={{ textAlign: 'center', fontSize: '3vw' }}>
          Medical Record
        </MDBCardHeader>
        <MDBCardBody style={{ height: '5' }}>
          <MDBRow style={{ marginLeft: '15px', marginRight: '15px' }}>
            <MDBCol sm="6">
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle style={{ textAlign: 'center' }}>
                    Owner Information
                  </MDBCardTitle>
                  <MDBCardText>
                    <div
                      className="d-flex"
                      style={{ justifyContent: 'center' }}
                    >
                      <img
                        src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                        alt=""
                        style={{ width: '45px', height: '45px' }}
                        className="rounded-circle"
                      />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p className="fw-bold mb-1">{ownerData.fullName}</p>
                      <p className="text-muted mb-0">{ownerData.phoneNumber}</p>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: '0.9vw' }}
                      >
                        {ownerData.email}
                      </p>
                    </div>
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
              <br />
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle style={{ textAlign: 'center' }}>
                    Veterinarian
                  </MDBCardTitle>
                  <MDBCardText>
                    <div
                      className="d-flex"
                      style={{ justifyContent: 'center' }}
                    >
                      <img
                        src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                        alt=""
                        style={{ width: '45px', height: '45px' }}
                        className="rounded-circle"
                      />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p className="fw-bold mb-1">{vetData.fullName}</p>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: '1vw' }}
                      >
                        {vetData.position}
                      </p>
                      <br />
                    </div>
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol sm="6">
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle style={{ textAlign: 'center' }}>
                    Pet Information
                  </MDBCardTitle>
                  <MDBCardText>
                    <div
                      className="d-flex"
                      style={{ justifyContent: 'center' }}
                    >
                      <img
                        src={petData.imgUrl}
                        alt="petimg"
                        style={{ width: '45px', height: '45px' }}
                        className="rounded-circle"
                      />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <p className="fw-bold mb-1">{petData.petName}</p>
                      <p className="text-muted mb-0">{petData.petAge}</p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <MDBBadge
                        color={petData.isCat ? 'warning' : 'primary'}
                        pill
                      >
                        {petData.isCat ? 'Cat' : 'Dog'}
                      </MDBBadge>
                      <MDBBadge
                        color={petData.isMale ? 'primary' : 'danger'}
                        pill
                      >
                        {petData.isMale ? 'Male' : 'Female'}
                      </MDBBadge>
                    </div>
                    <p className="text-muted mb-0">
                      - Pet Age: {calculatePetAge(petData.petAge)}{' '}
                    </p>
                    <p className="text-muted mb-0">
                      - Pet Breed: {petData.petBreed}{' '}
                    </p>
                    <p className="text-muted mb-0">
                      - Vaccination: {petData.vaccinationHistory}{' '}
                    </p>
                    <p className="text-muted mb-0">"{petData.description}" </p>
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
          <br />

          <MDBRow style={{ marginLeft: '15px', marginRight: '15px' }}>
            <MDBCard>
              <MDBCardHeader>Medical Record Information</MDBCardHeader>
              <MDBCardBody>
                <MDBCardTitle>Special title treatment</MDBCardTitle>

                <MDBCardText>
                  <form
                    onSubmit={(e) => handleSubmit(e, null)}
                    style={{ maxWidth: '600px', margin: 'auto' }}
                  >
                    <MDBRow>
                      <MDBCol>
                        <MDBInputGroup
                          className="mb-3"
                          textBefore="Pet Weight"
                          textAfter="kg"
                        >
                          <input
                            className="form-control"
                            style={{ width: '5vw', textAlign: 'center' }}
                            type="number"
                            min="0"
                            name="petWeight"
                            value={formData.petWeight}
                            onChange={handleChange}
                            required
                          />
                        </MDBInputGroup>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol>
                        <MDBInputGroup className="mb-3" textBefore="Symptoms">
                          <input
                            className="form-control"
                            type="text"
                            name="symptoms"
                            value={formData.symptoms}
                            onChange={handleChange}
                            required
                          />
                        </MDBInputGroup>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol>
                        <MDBInputGroup className="mb-3" textBefore="Allergies">
                          <input
                            className="form-control"
                            type="text"
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleChange}
                            required
                          />
                        </MDBInputGroup>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol>
                        <MDBInputGroup className="mb-3" textBefore="Diagnosis">
                          <input
                            className="form-control"
                            type="text"
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            required
                          />
                        </MDBInputGroup>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol>
                        <MDBInputGroup
                          className="mb-3"
                          textBefore="Additional Notes"
                        >
                          <input
                            className="form-control"
                            type="text"
                            name="additionalNotes"
                            value={formData.additionalNotes}
                            onChange={handleChange}
                            required
                          />
                        </MDBInputGroup>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol>
                        <MDBInputGroup
                          className="mb-3"
                          textBefore="Follow-Up Appointment Date"
                        >
                          <input
                            className="form-control"
                            type="date"
                            name="followUpAppointmentDate"
                            min={tomorrow}
                            value={formData.followUpAppointmentDate}
                            onChange={handleChange}
                            required
                          />
                        </MDBInputGroup>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol>
                        <MDBInputGroup
                          className="mb-3"
                          textBefore="Follow-Up Appointment Notes"
                        >
                          <input
                            className="form-control"
                            type="text"
                            name="followUpAppointmentNotes"
                            value={formData.followUpAppointmentNotes}
                            onChange={handleChange}
                            required
                          />
                        </MDBInputGroup>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol>
                        <MDBInputGroup
                          className="mb-3"
                          textBefore="Drug Prescriptions"
                        >
                          <input
                            className="form-control"
                            type="text"
                            name="drugPrescriptions"
                            value={formData.drugPrescriptions}
                            onChange={handleChange}
                            required
                          />
                        </MDBInputGroup>
                      </MDBCol>
                    </MDBRow>
                  </form>
                </MDBCardText>
                <div>
                  <MDBBtn type="submit" onClick={handleSubmit}>
                    Submit
                  </MDBBtn>

                  <MDBBtn
                    style={{ marginLeft: '15px' }}
                    type="button"
                    onClick={toggleAssignServiceOpen}
                  >
                    Assign service
                  </MDBBtn>

                  <MDBBtn
                    style={{ marginLeft: '15px' }}
                    type="button"
                    onClick={toggleAssignCageOpen}
                  >
                    Assign Cage
                  </MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBRow>
        </MDBCardBody>
        <MDBRow className="justify-content-end">
          <MDBCol
            style={{
              justifyContent: 'end',
              display: 'flex',
              marginRight: '25px',
            }}
            size="3"
          >
            <MDBBtn color="mute" onClick={handleBackClick}>
              Back
            </MDBBtn>
          </MDBCol>
        </MDBRow>
        <br></br>
      </MDBCard>

      <div>
        <MDBModal
          open={assignServiceModal}
          onClose={() => setAssignModal(false)}
          tabIndex="-1"
        >
          <AssignServiceModal
            mRecId={existingRecord.medicalRecordId}
            petData={petData}
            ownerData={ownerData}
            vetData={vetData}
            appointment={appointment}
            toggleOpen={toggleAssignServiceOpen}
          />
        </MDBModal>
      </div>
      <div>
        <MDBModal
          open={assignCageModal}
          onClose={() => setAssignCageModal(false)}
          tabIndex="-1"
        >
          <AssignCageModal
            mRecId={existingRecord.medicalRecordId}
            petData={petData}
            ownerData={ownerData}
            vetData={vetData}
            toggleOpen={toggleAssignCageOpen}
          />
        </MDBModal>
      </div>

      <MDBModal
        tabIndex="-1"
        open={showBackModal}
        onClose={() => setShowBackModal(false)}
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Unsaved Changes</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={handleCloseBackModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              You have unsaved changes. Do you want to submit the medical record
              before leaving?
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="primary" onClick={handleSubmit}>
                Submit and Leave
              </MDBBtn>
              <MDBBtn color="danger" onClick={handleConfirmBack}>
                Leave without Submitting
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}

export default MedicalRecord;
