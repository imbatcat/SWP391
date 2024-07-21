import {
  MDBBtn,
  MDBCheckbox,
  MDBCol,
  MDBInput,
  MDBRow,
} from 'mdb-react-ui-kit';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../../Context/UserContext';
import refreshPage from '../../Helpers/RefreshPage';

function VetModalForm() {
  const [user, setUser] = useUser();
  const [vetImg, setVetImg] = useState();
  const [buffer, setBuffer] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    roleId: 3,
    isMale: false,
    imgUrl: '',
    description: '',
    department: '',
    position: '',
    experience: '',
    joinDate: new Date().toISOString().split('T')[0],
  });

  const uploadImg = async () => {
    const formData = new FormData();
    formData.append('file', vetImg);

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
    return data.result.variants[0];
  };

  function checkFields(userData) {
    // Iterate over each property in the userData object
    for (let key in userData) {
      // Check if the value is null or an empty string
      if (userData[key] === null || userData[key] === '') {
        // Display an error toast
        toast.error(`The ${key} field cannot be empty.`);
        return; // Exit the function after finding the first empty field
      }
    }
  }

  const createStaffApi = async () => {
    checkFields(formData);
    if (isProcessing) {
      setBuffer((prevBuffer) => setBuffer(prevBuffer, formData));
      return;
    }
    setIsProcessing(true);
    const url = await uploadImg();

    let reqBody = formData;
    reqBody.imgUrl = url;

    console.log(reqBody);

    const createStaff = async () => {
      console.log(reqBody);
      const fetchPromise = await fetch(
        'https://localhost:7206/api/account-management/accounts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(reqBody),
        }
      );
      if (fetchPromise.status !== 201 && fetchPromise.status !== 200)
        throw new Error();
      toast.success(`${reqBody.fullName} has been added`);
      refreshPage();
    };
    toast
      .promise(
        createStaff().catch((err) => {
          console.error(err);
          throw new Error(err.message);
        }),
        {
          pending: 'Submitting...',
          success: `${formData.fullName} has been added successfully!`,
          error: {
            render({ data }) {
              return data.message || 'There was an error. Please try again!';
            },
          },
        }
      )
      .finally(() => {
        setIsProcessing(false);
        setBuffer([]);
      });
  };

  // Handle changes for each input/checkbox
  const handleInputChange = (e) => {
    const { id, value, files } = e.target;

    if (files) {
      setVetImg(files[0]);
    }
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData({
      ...formData,
      isMale: checked,
    });
  };

  const handleImgChange = (e) => {
    var reader = new FileReader();
    setVetImg(e.target.files[0]);

    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setFormData({
        ...formData,
        imgUrl: reader.result,
      });
    };
    reader.onerror = (error) => {
      console.error('Error', error);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.userName ||
      !formData.dateOfBirth ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.description ||
      !formData.department ||
      !formData.position ||
      !formData.experience
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }
    createStaffApi();
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      userName: '',
      dateOfBirth: '',
      email: '',
      phoneNumber: '',
      roleId: 3,
      isMale: false,
      imgUrl: '',
      description: '',
      department: '',
      position: '',
      experience: '',
    });
    setVetImg(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <MDBRow className="mb-4">
        <MDBCol>
          <MDBInput
            id="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
          />
        </MDBCol>
        <MDBCol>
          <MDBInput
            id="userName"
            label="Username"
            value={formData.userName}
            onChange={handleInputChange}
          />
        </MDBCol>
      </MDBRow>
      <MDBRow className="mb-4">
        <MDBCol>
          <MDBInput
            id="dateOfBirth"
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />
        </MDBCol>
        <MDBCol>
          <MDBInput
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </MDBCol>
      </MDBRow>
      <MDBRow className="mb-4">
        <MDBCol>
          <MDBInput
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </MDBCol>
        <MDBCol>
          <MDBCheckbox
            id="isMale"
            label="Is Male"
            checked={formData.isMale}
            onChange={handleCheckboxChange}
          ></MDBCheckbox>
        </MDBCol>
      </MDBRow>
      <MDBRow className="mb-4">
        <MDBCol>
          <MDBInput
            id="imgUrl"
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleImgChange}
          />
        </MDBCol>
        {formData.imgUrl && (
          <div>
            <img src={formData.imgUrl} alt="vet photo" height={'200px'} />
          </div>
        )}
      </MDBRow>
      <MDBRow className="mb-4">
        <MDBCol>
          <MDBInput
            id="description"
            label="Vet description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </MDBCol>
      </MDBRow>
      <MDBRow className="mb-4">
        <MDBCol>
          <MDBInput
            id="department"
            label="Department"
            value={formData.department}
            onChange={handleInputChange}
          />
        </MDBCol>
        <MDBCol>
          <MDBInput
            id="position"
            label="Position"
            value={formData.position}
            onChange={handleInputChange}
          />
        </MDBCol>
        <MDBCol>
          <MDBInput
            id="experience"
            type="number"
            label="Years of experience"
            value={formData.experience}
            onChange={handleInputChange}
          />
        </MDBCol>
      </MDBRow>
      <MDBBtn type="submit" outline color="dark" className="mb-4" block>
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

export default VetModalForm;
