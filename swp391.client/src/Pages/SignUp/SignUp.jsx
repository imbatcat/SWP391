import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRadio,
  MDBRow,
} from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import { useState, useEffect } from 'react';
import NavBar2 from '../../Component/NavBar/NavBar2';
import MainLayout from '../../Layouts/MainLayout';
import usePasswordToggle from '../Login/usePasswordToggle';

function SignUp() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    phonenumber: '',
    email: '',
    dateOfBirth: '',
    password: '',
    gender: '',
  });

  const [registerData, setRegisterData] = useState({
    fullName: '',
    userName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    password: '',
    isMale: '',
    roleId: 1,
  });

  const [buffer, setBuffer] = useState([]);
  const [errors, setErrors] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();
  const [PasswordInputType, ToggleIcon] = usePasswordToggle(); // Use the usePasswordToggle hook

  useEffect(() => {
    setRegisterData({
      fullName: formData.lastname + formData.firstname,
      userName: formData.username,
      phoneNumber: formData.phonenumber,
      email: formData.email,
      dateOfBirth: formData.dateOfBirth,
      password: formData.password,
      isMale: formData.gender,
      roleId: 1,
    });
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGenderChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      gender: value === 'Male' ? true : false,
    });
  };

  const checkPassword = () => {
    const passwordRegex =
      /^(?=.*[!@#$%^&*()_+{}|:<>?/~\-=[\];.,])(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{6,}$/;
    const isValidPassword = passwordRegex.test(formData.password);
    return isValidPassword;
  };

  const handleRegister = async (e, data) => {
    e.preventDefault();
    setIsDisabled(true);

    const fetchRegister = async () => {
      if (!checkPassword()) {
        toast.error('Invalid password format');
        throw new Error('Invalid password format');
      }
      const response = await fetch('https://localhost:7206/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData);
        throw new Error(errorData || 'Failed to register');
      }

      return response;
    };

    toast
      .promise(
        fetchRegister().catch((err) => {
          console.error(err);
          setIsDisabled(false);
          if (buffer.length > 0) {
            var nextFormData = buffer.shift();
            setBuffer([]);
            handleRegister(err, nextFormData);
          }
          throw err;
        }),
        {
          pending: 'Registering your account...',
          success: 'Check your email to activate your account!',
          error: 'Registration failed!',
        }
      )
      .then(() => {
        navigate('/');
        console.log('ok');
      })
      .finally(() => {
        setIsDisabled(false);
      });
  };

  const handleRegisterClick = (e) => {
    if (isDisabled) {
      setBuffer((prevBuffer) => [...prevBuffer, registerData]);
      return;
    }
    handleRegister(e, registerData);
  };

  return (
    <div className="pageSignUp">
      <MainLayout>
        <MDBContainer fluid className="page-container">
          <MDBRow className="justify-content-center align-items-center m-5">
            <MDBCard className="card">
              <MDBCardBody className="px-4">
                <h3 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5">
                  Registration Form
                </h3>
                <form onSubmit={handleRegisterClick}>
                  <MDBRow>
                    <MDBCol md="6">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="First Name"
                        size="lg"
                        id="form1"
                        type="text"
                        name="firstname"
                        required
                        onChange={handleChange}
                      />
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="Last Name"
                        size="lg"
                        id="form2"
                        type="text"
                        name="lastname"
                        required
                        onChange={handleChange}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="12">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="Username"
                        size="lg"
                        id="form3"
                        type="text"
                        name="username"
                        required
                        onChange={handleChange}
                        data-tooltip-id="usernameTip"
                      />
                      <Tooltip id="usernameTip" isOpen place="left">
                        {errors &&
                          errors.message.username &&
                          errors.message.username}
                      </Tooltip>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="12">
                      <div className="password-input-container">
                        <MDBInput
                          wrapperClass="mb-4"
                          label="Password"
                          size="lg"
                          id="form4"
                          type={PasswordInputType} // Use PasswordInputType
                          name="password"
                          required
                          onChange={handleChange}
                          data-tooltip-id="passwordTip"
                        />
                        <span className="password-toggle-icon2">
                          {ToggleIcon}
                        </span>{' '}
                        {/* Add ToggleIcon */}
                      </div>
                      <Tooltip id="passwordTip">
                        Your password must be:
                        <br />
                        - At least 6 characters long,
                        <br />
                        - Contain at least one uppercase letter,
                        <br />
                        - One lowercase letter,
                        <br />
                        - One number, <br />- One special character.
                      </Tooltip>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="Birthday"
                        size="lg"
                        id="form5"
                        type="date"
                        name="dateOfBirth"
                        required
                        onChange={handleChange}
                      />
                    </MDBCol>
                    <MDBCol md="6" className="mb-4">
                      <h6 className="fw-bold">Gender: </h6>
                      <MDBRadio
                        name="gender"
                        id="inlineRadio1"
                        value="Female"
                        label="Female"
                        inline
                        onChange={handleGenderChange}
                      />
                      <MDBRadio
                        name="gender"
                        id="inlineRadio2"
                        value="Male"
                        label="Male"
                        inline
                        onChange={handleGenderChange}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="Email"
                        size="lg"
                        id="form6"
                        type="email"
                        name="email"
                        required
                        onChange={handleChange}
                        data-tooltip-id="emailTip"
                      />
                      <Tooltip id="emailTip" isOpen place="left">
                        {errors && errors.message.email && errors.message.email}
                      </Tooltip>
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="Phone Number"
                        size="lg"
                        id="form7"
                        type="tel"
                        name="phonenumber"
                        required
                        onChange={handleChange}
                        data-tooltip-id="phoneTip"
                      />
                      <Tooltip id="phoneTip" isOpen place="right">
                        {errors &&
                          errors.message.phonenumber &&
                          errors.message.phonenumber}
                      </Tooltip>
                    </MDBCol>
                  </MDBRow>
                  <MDBBtn
                    className="mb-4"
                    color="danger"
                    size="lg"
                    type="submit"
                    disabled={isDisabled}
                    style={{ color: 'black' }}
                  >
                    Submit
                  </MDBBtn>
                  <div
                    className="d-flex flex-row mt-2"
                    style={{ justifyContent: 'end' }}
                  >
                    <Link to="/">
                      <span
                        className="h1 fw-bold mb-0"
                        style={{ fontSize: '20px', color: 'black' }}
                      >
                        BACK
                      </span>
                    </Link>
                  </div>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBRow>
        </MDBContainer>
      </MainLayout>
    </div>
  );
}

export default SignUp;
