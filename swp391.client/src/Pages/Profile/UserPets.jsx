import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCardText,
    MDBCardTitle,
    MDBCol,
    MDBContainer,
    MDBRow
} from 'mdb-react-ui-kit';
import { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import MainLayout from "../../Layouts/MainLayout";
import { toast } from 'react-toastify';
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

    const getPetList = async (user) => {
        try {
            const response = await fetch(`https://localhost:7206/api/pet-management/accounts/${user.id}/pets`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error("Error fetching data");
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

    useEffect(() => {
        if (user) getPetList(user);
    }, [user]);

    if (isLoading) {
        return (
            <MainLayout>
                <section style={{ backgroundColor: '#eee' }}>
                    <MDBContainer className="py-5">
                        <MDBRow>
                            <MDBCol lg="4">
                                <UserSidebar />
                            </MDBCol>
                            <MDBCol lg="8" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgressWithLabel value={progress} />
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </section>
            </MainLayout>
        );
    }

    const toggleOpen = (Pet = null) => {
        setSelectedPet(Pet);
        setCentredModal(!centredModal);
    };

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
                                                <MDBCardImage style={{ minHeight: '170px', maxHeight: '170px', objectFit: 'fill' }} src={pet.imgUrl} alt='pet image' position='top' />
                                                <MDBCardBody>
                                                    <MDBCardTitle>{pet.petName}</MDBCardTitle>
                                                    <MDBCardText>{pet.petBreed}</MDBCardText>
                                                    <MDBBtn color='muted' onClick={() => toggleOpen(pet)}>Detail</MDBBtn>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                    ))}
                                </MDBRow>
                                {selectedPet && (
                                    <UserPetModal centredModal={centredModal} toggleOpen={toggleOpen} selectedPet={selectedPet} />
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
