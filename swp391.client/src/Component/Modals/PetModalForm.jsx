import {
    MDBBtn,
    MDBCol,
    MDBInput,
    MDBRow,
} from 'mdb-react-ui-kit';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../../Context/UserContext';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

function PetModalForm() {
    const [user, setUser] = useUser();
    const [formData, setFormData] = useState({
        petName: '',
        petAge: '',
        petBreed: '',
        isMale: true,
        isCat: true,
        imgUrl: '',
        description: '',
        vaccinationHistory: '',
        isDisable: false,
        accountId: user.id, // Pre-populate with user ID
    });
    const [buffer, setBuffer] = useState([]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        // Handle file upload separately
        if (files) {
            const reader = new FileReader();
            setFormData((prevState) => ({ ...prevState, imgUrl: files[0] })); // Update imgUrl in state
            reader.readAsDataURL(files[0]);
            reader.onload = () => setFormData((prevState) => ({ ...prevState, imgUrl: reader.result }));
            reader.onerror = (error) => console.error('Error:', error);
            return; // Prevent further processing for file uploads
        }

        // Update other form data in state
        const updatedValue = name === 'isMale' || name === 'isCat' ? (value === 'true') : value;
        setFormData((prevState) => ({
            ...prevState,
            [name]: updatedValue,
        }));
    };

    const createPetApi = async (e, data) => {
        e.preventDefault();
        console.log(data);
        const { petName, petAge, petBreed, isMale, isCat, imgUrl, description, vaccinationHistory } = data;

        if (!petName || !petAge || !petBreed || !description || !vaccinationHistory) {
            toast.error('Please fill in all required fields.');
            return;
        }

        try {
            const response = await fetch('https://localhost:7206/api/pet-management/pets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data), // Use data directly
            });
            if (!response.ok) {
                throw new Error('Failed to add pet');
            }
            console.log('ok');
            toast.success(`${petName} has been added`);
        } catch (error) {
            console.error(error.message);
            if (buffer.length > 0) {
                setTimeout(() => {
                    setBuffer([]);
                    createPetApi(e, buffer[0]);
                }, 1000);
            }
        }
    };

    const handleSubmit = (e) => {
        if (formData.isDisable) {
            setBuffer((prevBuffer) => [...prevBuffer, formData]);
            return;
        }
        createPetApi(e, formData);
    };

    const handleReset = (e) => {
        e.preventDefault();
        setFormData({
            petName: '',
            petAge: '',
            petBreed: '',
            isMale: true,
            isCat: 'Cat',
            imgUrl: '',
            description: '',
            vaccinationHistory: '',
            isDisable: false,
            accountId: user.id, // Reset but retain user ID
        });
    };

    return (
        <form>
            <MDBRow>
                <MDBCol size='4'>
                    <MDBInput
                        label='Pet Name'
                        name='petName'
                        value={formData.petName}
                        onChange={handleInputChange}
                    />
                </MDBCol>
                <MDBCol size='4'>
                    <MDBInput
                        label='Pet Age'
                        name='petAge'
                        type='date'
                        value={formData.petAge}
                        onChange={handleInputChange}
                    />
                </MDBCol>
                <MDBCol size='4'>
                    <MDBInput
                        label='Pet Breed'
                        name='petBreed'
                        value={formData.petBreed}
                        onChange={handleInputChange}
                    />
                </MDBCol>
            </MDBRow>
            <br/>
            <MDBRow>
                <MDBCol size='6'>
                    <FormControl fullWidth>
                        <InputLabel id='gender-select-label'>Gender</InputLabel>
                        <Select
                            labelId='gender-select-label'
                            id='gender-select'
                            name='isMale'
                            value={formData.isMale ? 'Male' : 'Female'}
                            onChange={handleInputChange}
                        >
                            <MenuItem value='Male'>Male</MenuItem>
                            <MenuItem value='Female'>Female</MenuItem>
                        </Select>
                    </FormControl>
                </MDBCol>
                <MDBCol size='6'>
                    <FormControl fullWidth>
                        <InputLabel id='species-select-label'>Species</InputLabel>
                        <Select
                            labelId='species-select-label'
                            id='species-select'
                            name='isCat'
                            value={formData.isCat ? 'Cat' : 'Dog'}
                            onChange={handleInputChange}
                        >
                            <MenuItem value='Cat'>Cat</MenuItem>
                            <MenuItem value='Dog'>Dog</MenuItem>
                        </Select>
                    </FormControl>
                </MDBCol>
            </MDBRow>
            <br/>
            <MDBRow>
                <MDBCol>
                    <MDBInput
                        name='imgUrl'
                        type='file'
                        onChange={handleInputChange}
                    />
                </MDBCol>
                    
            </MDBRow>
            <br/>
            <MDBRow>
                <MDBCol size='12'>
                    <MDBInput
                        label='Description'
                        name='description'
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </MDBCol>
            </MDBRow>
            <br/>
            <MDBRow>
                <MDBCol size='12'>
                    <MDBInput
                        label='Vaccination History'
                        name='vaccinationHistory'
                        value={formData.vaccinationHistory}
                        onChange={handleInputChange}
                    />
                </MDBCol>
            </MDBRow>
            <br/>
            <MDBBtn onClick={handleSubmit} type='submit' outline color='dark' className='mb-4' block>
                Submit
            </MDBBtn>
            <MDBRow>
                <MDBCol size='4'>
                    <MDBBtn onClick={handleReset} outline color='dark' className='mb-4' block>
                        Reset
                    </MDBBtn>
                </MDBCol>
            </MDBRow>
        </form>
    );
}

export default PetModalForm;
