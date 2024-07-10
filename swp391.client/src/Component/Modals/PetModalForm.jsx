import {
    MDBBtn,
    MDBCol,
    MDBInput,
    MDBRow
} from 'mdb-react-ui-kit';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../../Context/UserContext';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

function PetModalForm() {
    const [user, setUser] = useUser();
    const [petName, setPetName] = useState('');
    const [petAge, setPetAge] = useState(0);
    const [petBreed, setPetBreed] = useState('');
    const [isMale, setIsMale] = useState('');
    const [isCat, setIsCat] = useState('');
    const [petImg, setPetImg] = useState(null);
    const [petImgUrl, setPetImgUrl] = useState(null);
    const [petNotes, setPetNotes] = useState('');
    const [vaccinationHistory, setVaccinationHistory] = useState('');

    const createPetApi = async () => {
        console.log(user.id);
        const petInfo = {
            petName,
            petAge,
            petBreed,
            isMale: isMale === 'Male',
            isCat: isCat === 'Cat',
            imgUrl: petImgUrl,
            description: petNotes,
            vaccinationHistory,
            isDisable: false,
            accountId: user.id
        };
        try {
            const response = await fetch('https://localhost:7206/api/pet-management/pets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(petInfo)
            });
            if (!response.ok) {
                throw new Error('Failed to add pet');
            }
            console.log('ok');
            toast.success(`${petName} has been added`);
        } catch (error) {
            console.error(error.message);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!petName || !petAge || !petBreed || !isMale || !isCat || !petNotes || !vaccinationHistory) {
            toast.error('Please fill in all required fields.');
            return;
        }
        createPetApi();
    };

    const handleInputChange = (e) => {
        const { id, name, value, files } = e.target;
        if (files) {
            var reader = new FileReader();
            setPetImg(files[0]);
            reader.readAsDataURL(files[0]);
            reader.onload = () => {
                setPetImgUrl(reader.result);
            };
            reader.onerror = (error) => {
                console.error('Error', error);
            };
        } else {
            switch (name || id) {
                case 'petName':
                    setPetName(value);
                    break;
                case 'petAge':
                    setPetAge(value);
                    break;
                case 'petBreed':
                    setPetBreed(value);
                    break;
                case 'isMale':
                    setIsMale(value);
                    break;
                case 'isCat':
                    setIsCat(value);
                    break;
                case 'petNotes':
                    setPetNotes(value);
                    break;
                case 'vaccinationHistory':
                    setVaccinationHistory(value);
                    break;
                default:
                    break;
            }
        }
    };
    const handleReset = (e) => {
        e.preventDefault();
        setPetName('');
        setPetAge(0);
        setPetBreed('');
        setIsMale('');
        setIsCat('');
        setPetImg(null);
        setPetImgUrl(null);
        setPetNotes('');
        setVaccinationHistory('');
        };

    return (
        <form>
            <MDBRow className='mb-4'>
                <MDBCol>
                    <MDBInput id='petName' name='petName' label='Pet Name' value={petName} onChange={handleInputChange} />
                </MDBCol>
                <MDBCol>
                <MDBInput id='petAge' label='Pet Age' type='date' min='0' value={petAge} onChange={handleInputChange} />
                </MDBCol>
                <MDBCol>
                    <MDBInput id='petBreed' name='petBreed' label='Pet Breed' type='text' value={petBreed} onChange={handleInputChange} />
                </MDBCol>
            </MDBRow>
            <MDBRow className='mb-4'>
                <MDBCol>
                    <FormControl fullWidth>
                        <InputLabel id="is-male-label">Gender</InputLabel>
                        <Select
                            labelId="is-male-label"
                            id="isMale"
                            name="isMale"
                            value={isMale}
                            label="Gender"
                            onChange={handleInputChange}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </Select>
                    </FormControl>
                </MDBCol>
                <MDBCol>
                    <FormControl fullWidth>
                        <InputLabel id="is-cat-label">Type</InputLabel>
                        <Select
                            labelId="is-cat-label"
                            id="isCat"
                            name="isCat"
                            value={isCat}
                            label="Type"
                            onChange={handleInputChange}
                        >
                            <MenuItem value="Cat">Cat</MenuItem>
                            <MenuItem value="Dog">Dog</MenuItem>
                        </Select>
                    </FormControl>
                </MDBCol>
            </MDBRow>
            <MDBRow className='mb-4'>
                <MDBCol>
                    <MDBInput id='petImgUrl' type='file' name='photo' accept='image/*' onChange={handleInputChange} />
                </MDBCol>
                {petImgUrl && (
                    <div>
                        <img
                            src={URL.createObjectURL(petImg)}
                            alt='pet photo'
                            height={'200px'}
                        />
                    </div>
                )}
            </MDBRow>
            <MDBRow className='mb-4'>
                <MDBCol>
                    <MDBInput id='petNotes' name='petNotes' label='Description' type='text' size='lg' value={petNotes} onChange={handleInputChange} />
                </MDBCol>
            </MDBRow>
            <MDBRow className='mb-4'>
                <MDBCol>
                    <MDBInput id='vaccinationHistory' name='vaccinationHistory' label='Vaccination History' type='text' size='lg' value={vaccinationHistory} onChange={handleInputChange} />
                </MDBCol>
            </MDBRow>

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
