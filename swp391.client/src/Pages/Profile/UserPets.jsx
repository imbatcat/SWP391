import React, { useState, useEffect } from 'react';
import {
  MDBBadge,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBRow,
} from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';
import { useUser } from '../../Context/UserContext';
import MainLayout from '../../Layouts/MainLayout';
import UserSidebar from '../../Component/UserSidebar/UserSidebar';
import CircularProgressWithLabel from '../../Component/CircularProgress/CircularProgressWithLabel';
import UserPetModal from '../../Component/Modals/UserPetModal';

function UserPets() {
  const [user, setUser] = useUser();
  const [petList, setPetList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [centredModal, setCentredModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [admissionRecords, setAdmissionRecords] = useState({});

  const getPetList = async (user) => {
    try {
      const response = await fetch(
        `https://localhost:7206/api/pet-management/accounts/${user.id}/pets`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const userData = await response.json();
      setPetList(userData);
    } catch (error) {
      toast.error('Error getting user details!');
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdmissionRecords = async (petId) => {
    try {
      const response = await fetch(
        `https://localhost:7206/api/admission-record-management/pets/${petId}/admission-records`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Error fetching admission records');
      }

      const data = await response.json();
      setAdmissionRecords((prevRecords) => ({
        ...prevRecords,
        [petId]: data,
      }));
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getPetList(user);
    }
  }, [user]);

  useEffect(() => {
    if (petList.length > 0) {
      petList.forEach((pet) => {
        fetchAdmissionRecords(pet.petId);
      });
    }
  }, [petList]);

  const toggleOpen = (pet = null) => {
    setSelectedPet(pet);
    setCentredModal(!centredModal);
  };

  const getAdmissionStatus = (petId) => {
    const records = admissionRecords[petId];
    if (records && records.length > 0) {
      const latestRecord = records[0]; // Assuming the latest record is the first one
      return latestRecord.isDischarged ? 'Home' : 'Hospital';
    }
    return 'No Records';
  };

  if (isLoading) {
    return (
      <MainLayout>
        <section style={{ backgroundColor: '#eee' }}>
          <MDBContainer className="py-5">
            <MDBRow>
              <MDBCol lg="4">
                <UserSidebar />
              </MDBCol>
              <MDBCol
                lg="8"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgressWithLabel value={progress} />
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section style={{ backgroundColor: '#eee' }}>
        <MDBContainer className="py-5">
          <MDBRow>
            <MDBCol lg="4">
              <UserSidebar />
            </MDBCol>
            <MDBCol>
              <div style={{ padding: '15px' }}>
                <MDBRow className="row-cols-1 row-cols-md-3 g-4">
                  {petList.map((pet, index) => (
                    <MDBCol key={index}>
                      <MDBCard style={{ minHeight: '300px' }}>
                        <MDBCardImage
                          style={{
                            minHeight: '170px',
                            maxHeight: '170px',
                            objectFit: 'fill',
                          }}
                          src={pet.imgUrl}
                          alt="pet image"
                          position="top"
                        />
                        <MDBCardBody>
                          <MDBCardTitle>
                            <MDBRow>
                              <MDBCol
                                size="6"
                                style={{
                                  justifyContent: 'start',
                                  display: 'flex',
                                }}
                              >
                                {pet.petName}{' '}
                              </MDBCol>
                              <MDBCol
                                size="6"
                                style={{
                                  justifyContent: 'center',
                                  display: 'flex',
                                }}
                              >
                                <MDBBadge
                                  color={
                                    getAdmissionStatus(pet.petId) === 'Home'
                                      ? 'success'
                                      : getAdmissionStatus(pet.petId) ===
                                        'Hospital'
                                      ? 'warning'
                                      : 'secondary'
                                  }
                                >
                                  {getAdmissionStatus(pet.petId)}
                                </MDBBadge>
                              </MDBCol>
                            </MDBRow>
                          </MDBCardTitle>
                          <MDBCardText>{pet.petBreed}</MDBCardText>
                          <MDBBtn color="muted" onClick={() => toggleOpen(pet)}>
                            Detail
                          </MDBBtn>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  ))}
                </MDBRow>
                {selectedPet && (
                  <UserPetModal
                    centredModal={centredModal}
                    toggleOpen={toggleOpen}
                    selectedPet={selectedPet}
                    admissionRecords={admissionRecords[selectedPet.petId] || []} // Pass empty array if no records
                  />
                )}
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </MainLayout>
  );
}

export default UserPets;
