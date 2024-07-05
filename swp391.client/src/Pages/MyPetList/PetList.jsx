/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import './PetList.css'
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
} from 'mdb-react-ui-kit';
import { useUser } from '../../Context/UserContext';
import { toast } from 'react-toastify';
export default function PetList() {
    const [petLists, setPetLists] = useState([]);
    const [user, setUser] = useUser();
    // const [petList, setPetList] = useState(null);
    const [centredModal, setCentredModal] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    useEffect(() => {
        const getPetList = async (user) => {
            console.log(user.id + '1');
            try {
                const response = await fetch(`https://localhost:7206/api/pet-management/accounts/${user.id}/pets`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error status: ${response.status}`);
                }
                const pets = await response.json();
                console.log(pets);
                setPetLists(pets);
            } catch (error) {
                console.error(error.message);
            }
        };

        getPetList(user);
    }, [user]);

    const toggleOpen = (Pet = null) => {
        setSelectedPet(Pet);
        setCentredModal(!centredModal);
    };

    return (
        < div className='Pet-display' >
            <div className='Pet-display-list'>
                {petLists.map((pet, index) => (
                    <div className="Pet-item" key={index}>
                        <div className="Pet-item-img-container">
                            <img className='Pet-item-image' src={pet.img} alt='' />
                        </div>
                        <div className='Pet-info'>
                            <div className='Pet-name-rating'>
                                <p>{pet.petName}</p>
                                <p>{pet.isCat ? 'Cat' : 'Dog'}</p>
                            </div>
                            <>
                                <MDBBtn color='muted' onClick={() => toggleOpen(pet)}>Detail</MDBBtn>
                            </>
                        </div>
                    </div>
                ))}
            </div>

            {
                selectedPet && (
                    <MDBModal tabIndex='-1' open={centredModal} onClose={() => setCentredModal(false)}>
                        <MDBModalDialog centered>
                            <MDBModalContent>
                                <MDBModalHeader>
                                    <MDBModalTitle>Detail of {selectedPet.name}</MDBModalTitle>
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
        </div >
    );
}
