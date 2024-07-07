import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCardText,
    MDBCardTitle,
    MDBCol,
    MDBContainer,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBRow,
} from 'mdb-react-ui-kit';
import { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import MainLayout from "../../Layouts/MainLayout";
import { toast } from 'react-toastify';
import UserSidebar from '../../Component/UserSidebar/UserSidebar';
import img3 from '../../assets/images/hero3.png';

function UserPets() {
    const [user, setUser] = useUser();
    const [petList, setPetList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [centredModal, setCentredModal] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    const getPetList = async (user) => {
        try {
            const response = await fetch(`https://localhost:7206/api/pets/by-account/${user.id}`, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error("Error fetching data");
            }
            var userData = await response.json();
            setPetList(userData);
            console.log(userData);
        } catch (error) {
            toast.error('Error getting user details!');
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user)
            getPetList(user);
    }, [user]);

    if (isLoading) {
        return <div>Loading...</div>; // Loading state
    }

    const toggleOpen = (Pet = null) => {
        setSelectedPet(Pet);
        setCentredModal(!centredModal);
    };

    return (
        <>
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
                                                <MDBCard>
                                                    <MDBCardImage src={img3} alt='pet image' position='top' />
                                                    <MDBCardBody>
                                                        <MDBCardTitle>{pet.petName}</MDBCardTitle>
                                                        <MDBCardText>{pet.petBreed}</MDBCardText>
                                                        <MDBBtn color='muted' onClick={() => toggleOpen(pet)}>Detail</MDBBtn>
                                                    </MDBCardBody>
                                                </MDBCard>
                                            </MDBCol>
                                        ))}
                                    </MDBRow>
                                    {
                                        selectedPet && (
                                            <MDBModal tabIndex='-1' open={centredModal} setShow={setCentredModal}>
                                                <MDBModalDialog centered>
                                                    <MDBModalContent>
                                                        <MDBModalHeader>
                                                            <MDBModalTitle>Detail of {selectedPet.petName}</MDBModalTitle>
                                                            <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                                                        </MDBModalHeader>
                                                        <MDBModalBody>
                                                            <p className='Pet-detail'>Age: {selectedPet.petAge}</p>
                                                            <p className='Pet-detail'>Vaccination: {selectedPet.vaccinationHistory}</p>
                                                            <p className='Pet-detail'>Gender: {selectedPet.isMale ? 'Male' : 'Female'}</p>
                                                            <p className='Pet-detail'>Description: {selectedPet.description}</p>
                                                        </MDBModalBody>
                                                        <MDBModalFooter>
                                                        </MDBModalFooter>
                                                    </MDBModalContent>
                                                </MDBModalDialog>
                                            </MDBModal>
                                        )
                                    }
                                </div>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </section>
            </MainLayout>
        </>
    );
}

export default UserPets;
