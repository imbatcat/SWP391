
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import './usePasswordToggle.css';
import './Login.css';
import './usePasswordToggle.css';
import usePasswordToggle from './usePasswordToggle';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBModal,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog,
    MDBModalHeader,
    MDBModalTitle
} from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react';
import ForgotPassForm from '../../Component/ForgotPass/ForgotPassForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../Context/AuthProvider';
import { useUser } from '../../Context/UserContext';
import { GoogleLogin } from '@react-oauth/google';


function Login() {
    const [isAuthenticated, setIsAuthenticated] = useAuth();
    const [user, setUser] = useUser();
    const [localUser, setLocalUser] = useState();
    const [basicModal, setBasicModal] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassWord] = useState('');
    const navigate = useNavigate();
    const toggleOpen = () => setBasicModal(!basicModal);
    const [PasswordInputType, ToggleIcon] = usePasswordToggle();
    const getProfile = async (credential) => {
        try {
            const response = await fetch('https://localhost:7206/api/auth/sign-in-google', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    "token": credential
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); // Parses JSON response into native JavaScript objects

            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
            setIsAuthenticated(true);
            toast.success('Login successful!');
            handleNavigation(data.role);
            console.log(data); // Assuming setProfile is a function to update your component's state with the user profile
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };
    async function loginapi() {
        try {
            const response = await fetch('https://localhost:7206/api/auth/login', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(
                    {
                        "userName": userName,
                        "password": password,
                        "rememberMe": true
                    }
                )
            });
            if (!response.ok) {
                throw new Error("Error fetching data");
            }
            var userData = await response.json();
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
            console.log('ok');
            toast.success('Login successful!');
            handleNavigation(userData.role);
        } catch (error) {
            toast.error('Login failed!');
            console.error(error.message);
        }
    }

    const handleLoginClick = (e) => {
        if (!userName || !password) {
            toast.error("Email/Password is required");
            return;
        }
        loginapi(e);
    };
    const handleOnChangeUsername = (e) => {
        setUserName(e.target.value);
    };

    const handleOnChangePassWord = (e) => {
        setPassWord(e.target.value);
    };
    const handleNavigation = (role) => {
        switch (role) {
            case 'Admin':
                navigate('/admin/customers');
                break;
            case 'Vet':
                navigate('/vet/WorkSchedule');
                break;
            case 'Staff':
                navigate('/staff/cage-list');
                break;
            case 'Customer':
                navigate('/');
                break;
        }

    };
    return (
        <MDBContainer className="my-5 d-10 justify-content-center">
            <MDBCard className='login-card'>
                <MDBRow className='g-0' >
                    <MDBCol md='6' className='imgside'></MDBCol>
                    <MDBCol md='6' >
                        <MDBCardBody className='d-flex flex-column' >

                            <h5 className="fw-bold my-5 pb-2" style={{ letterSpacing: '1px', textAlign: 'center', fontSize: '30px' }}>Sign into your account</h5>

                            <MDBInput wrapperClass='mb-4' label='Username' id='formControlLg' onChange={(e) => handleOnChangeUsername(e)} value={userName} type='email' size="lg" />
                            <div className='password-input-container'>
                                <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg'
                                    onChange={(e) => handleOnChangePassWord(e)}
                                    value={password}
                                    type={PasswordInputType}
                                    size="lg"
                                />
                                <span className='password-toggle-icon'>
                                    {ToggleIcon}
                                </span>
                            </div>

                            <MDBRow>
                                <MDBBtn className="mb-4 px-5" color='blue' size='lg' onClick={(e) => handleLoginClick(e)}>Login</MDBBtn>
                                <GoogleLogin onSuccess={credentialResponse => {
                                    console.log(credentialResponse);
                                    getProfile(credentialResponse.credential);
                                }}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}>
                                </GoogleLogin>
                            </MDBRow>


                            <a className="small text-muted" style={{ textAlign: 'end' }} onClick={toggleOpen}>Forgot password?</a>
                            <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
                                <MDBModalDialog>
                                    <MDBModalContent>
                                        <MDBModalHeader >
                                            <MDBModalTitle>
                                                <h6>Forgot your account’s password?</h6>
                                                <h3 style={{ fontSize: '20px' }}>Enter your email address and we’ll send you a recovery link.</h3>
                                            </MDBModalTitle>
                                            <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                                        </MDBModalHeader>
                                        <MDBModalBody>
                                            <ForgotPassForm />
                                        </MDBModalBody>
                                    </MDBModalContent>
                                </MDBModalDialog>
                            </MDBModal>

                            <p className="mb-5 pb-lg-2" style={{ color: 'Black' }}>Dont have an accounts ?
                                <Link to="/signUp"><a style={{ color: '#393f81' }}>Register here</a></Link>
                            </p>

                            <div className='d-flex flex-row justify-content-start'>
                                <a href="#!" className="small text-muted me-1">Terms of use.</a>
                                <a href="#!" className="small text-muted">Privacy policy</a>
                            </div>


                            <div className='d-flex flex-row mt-2' style={{ justifyContent: 'end' }}>
                                <Link to="/"> <span className="h1 fw-bold mb-0" style={{ fontSize: '20px', color: 'black' }}>BACK</span></Link>
                            </div>

                        </MDBCardBody>
                    </MDBCol>
                </MDBRow>
            </MDBCard>
        </MDBContainer>
    );
}

export default Login;
