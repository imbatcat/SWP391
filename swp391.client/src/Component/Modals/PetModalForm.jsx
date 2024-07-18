import { MDBBtn, MDBCol, MDBInput, MDBRow } from 'mdb-react-ui-kit';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../../Context/UserContext';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import refreshPage from '../../Helpers/RefreshPage';
import { Form } from 'react-router-dom';

function PetModalForm() {
  const [user, setUser] = useUser();
  const [imageFile, setImageFile] = useState(null);
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
      setImageFile(files[0]);
    }

    // Update other form data in state
    const updatedValue =
      name === 'isMale' || name === 'isCat' ? value === 'true' : value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const uploadImg = async () => {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch(
      `https://localhost:7206/api/account-management/img-upload`,
      {
        body: formData,
        method: 'POST',
        credentials: 'include',
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data.result.variants[0];
  };
  const createPetApi = async (e, data) => {
    e.preventDefault();
    console.log(data);

    const {
      petName,
      petAge,
      petBreed,
      isMale,
      isCat,
      imgUrl,
      description,
      vaccinationHistory,
    } = data;

    if (
      !petName ||
      !petAge ||
      !petBreed ||
      !description ||
      !vaccinationHistory
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const url = await uploadImg();

      let reqBody = formData;
      reqBody.imgUrl = url;

      console.log(reqBody);
      const response = await fetch(
        'https://localhost:7206/api/pet-management/pets',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(reqBody),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to add pet');
      }
      console.log('ok');
      toast.success(`${petName} has been added`);
      refreshPage();
    } catch (err) {
      console.log(err);
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
  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  return (
    <form>
      <MDBRow>
        <MDBCol size="4">
          <MDBInput
            label="Pet Name"
            name="petName"
            value={formData.petName}
            onChange={handleInputChange}
          />
        </MDBCol>
        <MDBCol size="4">
          <MDBInput
            label="Date of Birth"
            name="petAge"
            type="date"
            max={getCurrentDate()}
            value={formData.petAge}
            onChange={handleInputChange}
          />
        </MDBCol>
        <MDBCol size="4">
          <MDBInput
            label="Pet Breed"
            name="petBreed"
            value={formData.petBreed}
            onChange={handleInputChange}
          />
        </MDBCol>
      </MDBRow>
      <br />
      <MDBRow>
        <MDBCol size="6">
          <FormControl fullWidth>
            <InputLabel id="gender-select-label">Gender</InputLabel>
            <Select
              labelId="gender-select-label"
              id="gender-select"
              name="isMale"
              value={formData.isMale ? 'Male' : 'Female'}
              onChange={handleInputChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
        </MDBCol>
        <MDBCol size="6">
          <FormControl fullWidth>
            <InputLabel id="species-select-label">Species</InputLabel>
            <Select
              labelId="species-select-label"
              id="species-select"
              name="isCat"
              value={formData.isCat ? 'Cat' : 'Dog'}
              onChange={handleInputChange}
            >
              <MenuItem value="Cat">Cat</MenuItem>
              <MenuItem value="Dog">Dog</MenuItem>
            </Select>
          </FormControl>
        </MDBCol>
      </MDBRow>
      <br />
      <MDBRow>
        <MDBCol>
          <MDBInput name="imgUrl" type="file" onChange={handleInputChange} />
        </MDBCol>
      </MDBRow>
      <br />
      <MDBRow>
        <MDBCol size="12">
          <MDBInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </MDBCol>
      </MDBRow>
      <br />
      <MDBRow>
        <MDBCol size="12">
          <MDBInput
            label="Vaccination History"
            name="vaccinationHistory"
            value={formData.vaccinationHistory}
            onChange={handleInputChange}
          />
        </MDBCol>
      </MDBRow>
      <br />
      <MDBBtn
        onClick={handleSubmit}
        type="submit"
        outline
        color="dark"
        className="mb-4"
        block
      >
        Submit
      </MDBBtn>
      <MDBRow>
        <MDBCol size="4">
          <MDBBtn
            onClick={handleReset}
            outline
            color="dark"
            className="mb-4"
            block
          >
            Reset
          </MDBBtn>
        </MDBCol>
      </MDBRow>
    </form>
  );
}

export default PetModalForm;
