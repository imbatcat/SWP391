import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
} from 'mdb-react-ui-kit';
import AOS from 'aos';
import 'aos/dist/aos.css';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const resetPassword = async (navigate, userId, token, password1) => {
  try {
    const response = await fetch(`https://localhost:7206/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(
        {
          "UserId": userId,
          "Token": token,
          "NewPassword": password1
        }
      ),
    });
    if (response.ok) {
      navigate('/');
    }
  } catch (error) {
    console.error('Error resetting password:', error);
  }
};

const PasswordResetForm = () => {
  const navigate = useNavigate();
  const query = useQuery();

  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const _userId = query.get('userId');
    const _token = query.get('token');
    setUserId(_userId);
    setToken(_token);
  }, [query]);

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    const validate = () => {
      if (password1.length >= 6 && password2.length >= 6) {
        if (password1 === password2) {
          setIsButtonDisabled(false);
          setMessage('Password Matched');
        } else {
          setIsButtonDisabled(true);
          setMessage('Password not matching');
        }
      } else {
        setIsButtonDisabled(true);
        setMessage('');
      }
    };

    validate();
  }, [password1, password2]);

  return (
    <MDBContainer className="bg-body-tertiary d-block" fluid>
      <MDBRow className="justify-content-center">
        <MDBCol md="6" lg="4" style={{ minWidth: '200px' }}>
          <MDBCard 
            className="bg-white mb-5 mt-5 border-0" 
            style={{ boxShadow: '0 12px 15px rgba(0, 0, 0, 0.02)' }}
            data-aos="fade-up"
             data-aos-duration="2000"
          >
            <MDBCardBody className="p-5 text-center">
              <form onSubmit={(e) => { e.preventDefault(); resetPassword(navigate, userId, token, password1) }}>
                <h4 data-aos="fade-up"
                    data-aos-duration="2000" >
                    Reset your Password
                </h4>
                <MDBRow data-aos="fade-up" data-aos-duration="2000" style={{width:'20vw',minWidth:'250px', margin:'auto'}}>
                  <MDBCol >
                    <MDBInput
                      wrapperClass="mb-3"
                      id="password-1"
                      type="password"
                      label="Type your new password"
                      value={password1}
                      onChange={(e) => setPassword1(e.target.value)}
                    />

                    <MDBInput
                      wrapperClass="mb-2"
                      id="password-2"
                      type="password"
                      label="Re-type your new password"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                    />
                  </MDBCol>
                </MDBRow>

                <div data-aos="fade-up" data-aos-duration="2000" id="pwd-length-2">Minimum 6 characters</div>
                <span id="message" style={{ color: password1 === password2 ? 'green' : 'red' }}>{message}</span>
                <div>
                  <MDBBtn
                    id="formSubmit"
                    type="submit"
                    disabled={isButtonDisabled}
                    color={isButtonDisabled ? 'muted' : 'danger'}
                  >
                    Submit
                  </MDBBtn>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default PasswordResetForm;
