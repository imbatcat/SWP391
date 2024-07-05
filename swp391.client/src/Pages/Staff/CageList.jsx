import { useState, useEffect } from 'react';

import { MDBBadge, MDBBtn, MDBTable, MDBTableBody, MDBTableHead, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput, MDBModalDialog, MDBModalContent, MDBModalTitle, MDBCol, MDBRow, MDBCheckbox } from 'mdb-react-ui-kit';

import SideNavForStaff from '../../Component/SideNavForStaff/SideNavForStaff';
import refreshPage from '../../Helpers/RefreshPage';
import { toast } from 'react-toastify';


function CageList() {
    const [cageList, setCageList] = useState([]);
    const [filteredCageList, setFilteredCageList] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState('');
    const [selectedCage, setSelectedCage] = useState();
    const [petCurrentCondition, setPetCurrentCondition] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSetPetCurrentCondition = (e) => {
        setPetCurrentCondition(e.target.value);
    };
    const toggleOpen = (cage = null) => {
        setSelectedCage(cage);
        setIsModalOpen(!isModalOpen);
    };
    const handleSearchInputChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchInput(value);
        if (value === '') {
            setFilteredCageList(cageList);
        } else {
            setFilteredCageList(cageList.filter(cage =>
                cage.petId.toLowerCase().includes(value) ||
                cage.petName.toLowerCase().includes(value)
            ));
        }
    };
    useEffect(() => {
        async function fetchData() {
            try {
                const appResponse = await fetch('https://localhost:7206/api/cage-management/cages-pets', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!appResponse.ok) {
                    throw new Error("Error fetching pet data");
                }
                const data = await appResponse.json();
                setCageList(data);
                setFilteredCageList(data);

            } catch (error) {
                console.error(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    async function dischargePet(e, cage) {
        e.preventDefault();
        try {
            const appResponse = await fetch(`https://localhost:7206/api/DischargePet/${cage.petId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!appResponse.ok) {
                throw new Error("There's something wrong");
            }
            //const data = await appResponse.json();
            //console.log(data.imgUrl);
            //setCageList(data);
            refreshPage();
            toast.success('Pet successfully discharged!');

        } catch (error) {
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function updatePet(e, cage) {
        const obj = {
            'petCurrentCondition': petCurrentCondition
        };
        e.preventDefault();
        try {
            const appResponse = await fetch(`https://localhost:7206/api/Cage/UpdatePetCondition/${cage.petId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj)
            });
            if (!appResponse.ok) {
                throw new Error("There's something wrong");
            }
            toast.success('Changes saved');
            refreshPage();

        } catch (error) {
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (<>Loading...</>);
    }

    return (
        <div>
            <SideNavForStaff searchInput={searchInput} handleSearchInputChange={handleSearchInputChange} />
            <MDBTable align='middle'>
                <MDBTableHead>
                    <tr style={{ textAlign: 'center' }}>
                        <th scope='col'>Id</th>
                        <th scope='col'>Pet Name</th>
                        <th scope='col'></th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Actions</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody style={{ textAlign: 'center' }}>
                    {filteredCageList.map((cage) => (
                        <tr key={cage.id}>
                            <td>
                                <div>
                                    <img
                                        src={(cage.imgUrl != null && cage.imgUrl != 'string' && URL.createObjectURL(cage.imgUrl)) || 'https://mdbootstrap.com/img/new/avatars/8.jpg'}
                                        alt=''
                                        style={{ width: '45px', height: '45px' }}
                                        className='rounded-circle'
                                    />
                                    <div className='ms-3'>
                                        {cage.petId}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div>
                                    {cage.petName || 'N / A'}
                                </div>
                            </td>
                            <td>
                                {cage.petName ? (
                                    <div>
                                        <div>
                                            {cage.petBreed}
                                        </div>
                                        <div>
                                            {cage.petAge}
                                        </div>
                                    </div>

                                ) : (
                                    'N / A'
                                )}
                            </td>
                            <td>
                                <div>
                                    {cage.isOccupied ? (
                                        <div>
                                            Occupied
                                        </div>
                                    ) : (
                                        <div>
                                            Unoccupied
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td>
                                <MDBRow className="justify-content-center">
                                    <MDBCol size='3'>
                                        <MDBBtn onClick={(e) => dischargePet(e, cage)}>Discharge</MDBBtn>
                                    </MDBCol>
                                    <MDBCol size='3'>
                                        <MDBBtn onClick={() => toggleOpen(cage)}>Update pet</MDBBtn>
                                    </MDBCol>
                                </MDBRow>
                            </td>
                        </tr>
                    ))
                    }
                </MDBTableBody>
            </MDBTable>

            {selectedCage && (
                <MDBModal open={isModalOpen} onClose={() => setIsModalOpen(false)} tabIndex='-1'>
                    <MDBModalDialog centered>
                        <MDBModalContent>
                            <MDBModalHeader>
                                <MDBModalTitle>Edit pet`s current condition</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                            </MDBModalHeader>
                            <MDBModalBody>
                                <form>
                                    <MDBRow className='mb-4'>
                                        <MDBCol>
                                            <MDBInput
                                                label="Current pet condition"
                                                name="fullName"
                                                value={petCurrentCondition}
                                                onChange={(e) => handleSetPetCurrentCondition(e)}
                                            />
                                        </MDBCol>

                                    </MDBRow>

                                </form>
                            </MDBModalBody>
                            <MDBModalFooter>
                                <MDBBtn color='secondary' onClick={() => toggleOpen()}>Close</MDBBtn>
                                <MDBBtn color='success' style={{ color: 'black' }} onClick={(e) => updatePet(e, selectedCage)}>Save changes</MDBBtn>
                            </MDBModalFooter>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            )}
        </div>
    );
}

export default CageList;
