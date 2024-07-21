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

function StaffModalForm() {
  const [user, setUser] = useUser();
  const [buffer, setBuffer] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const initialFormData = {
    fullName: '',
    userName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    roleId: 4,
    isMale: false,
  };
  const [formData, setFormData] = useState(initialFormData);

  const createStaffApi = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (
      !formData.fullName ||
      !formData.userName ||
      !formData.dateOfBirth ||
      !formData.email ||
      !formData.phoneNumber
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (isProcessing) {
      setBuffer((prevBuffer) => setBuffer(prevBuffer, formData));
      return;
    }
    setIsProcessing(true);

    const createStaff = async () => {
      console.log(formData);
      const response = await fetch(
        'https://localhost:7206/api/account-management/accounts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );

      if (response.status !== 201 && response.status !== 200) {
        throw new Error('Failed to create staff');
      }

      toast.success(`${formData.fullName} has been added`);
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
    const { id, value } = e.target;
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

  const handleReset = (e) => {
    e.preventDefault();
    setFormData({
      fullName: '',
      userName: '',
      dateOfBirth: '',
      email: '',
      phoneNumber: '',
      roleId: 4,
      isMale: false,
    });
  };

  return (
    <form>
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
            label="Male"
            checked={formData.isMale}
            onChange={handleCheckboxChange}
          ></MDBCheckbox>
        </MDBCol>
      </MDBRow>

      <MDBBtn
        onClick={(e) => createStaffApi(e)}
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

export default StaffModalForm;
