import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar2.css';
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarToggler,
    MDBIcon,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBCollapse,
} from 'mdb-react-ui-kit';
import { useAuth } from '../../Context/AuthProvider';
import { useUser } from '../../Context/UserContext';
import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function NavBar2() {
    const [isAuthenticated, setIsAuthenticated] = useAuth();
    const [user, setUser] = useUser();
    const [openBasic, setOpenBasic] = useState(false);
    const navigate = useNavigate();
    const logout = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://localhost:7206/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setIsAuthenticated(false);
            localStorage.removeItem("user");
            return redirect("/");
        } catch (error) {
            toast.error('Error logging out!');
            console.error(error.message);
        }
    };

    return (
        <MDBNavbar expand='lg' light bgColor='light' sticky>
            <MDBContainer fluid>
                <Link to="/"><h1 style={{ minWidth: '15vw' }}>Pet-ternary</h1></Link>
                <h2 style={{ minWidth: '10vw', fontSize: '100%', margin: 'auto', marginLeft: '1vw' }} >Purr-fectly Healthy, Woof-tastically Happy</h2>
                <MDBNavbarToggler
                    aria-controls='navbarSupportedContent'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                    onClick={() => setOpenBasic(!openBasic)}
                >
                    <MDBIcon icon='bars' fas />
                </MDBNavbarToggler>

                <MDBCollapse navbar open={openBasic} style={{ justifyContent: 'end' }}>
                    <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
                        <MDBNavbarItem>
                            <Link to="/"><MDBNavbarLink active aria-current='page'>
                                Home
                            </MDBNavbarLink>
                            </Link>
                        </MDBNavbarItem>

                        <MDBNavbarItem>
                            <MDBDropdown>
                                <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                                    Appointment
                                </MDBDropdownToggle>
                                <MDBDropdownMenu>
                                    <MDBDropdownItem link>My Appointment</MDBDropdownItem>
                                        <Link to="/user/appointments">
                                            <MDBDropdownItem link> Make an Appointment</MDBDropdownItem>
                                        </Link>
                                    

                                </MDBDropdownMenu>
                            </MDBDropdown>
                        </MDBNavbarItem>

                        <MDBNavbarItem>
                            <MDBDropdown>
                                <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                                    Contact Us
                                </MDBDropdownToggle>
                                <MDBDropdownMenu>
                                    <MDBDropdownItem link href='https://zalo.me/g/alobzv478'>Zalo</MDBDropdownItem>
                                    <MDBDropdownItem link href='https://www.facebook.com/profile.php?id=100009406588322'>FaceBook</MDBDropdownItem>
                                    <MDBDropdownItem link>09321231232</MDBDropdownItem>
                                </MDBDropdownMenu>
                            </MDBDropdown>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <Link to="/petList"> <MDBNavbarLink>My Pet List</MDBNavbarLink></Link>
                        </MDBNavbarItem>


                        {isAuthenticated ? (
                            <>
                                <MDBNavbarItem>
                                    <Link to="/user/profile">
                                        <button className="btn">Profile</button>
                                    </Link>
                                </MDBNavbarItem>
                                <MDBNavbarItem>
                                    <button className="btn" onClick={(e) => logout(e)}>Logout</button>
                                </MDBNavbarItem>
                            </>
                        ) : (
                            <>
                                <MDBNavbarItem>
                                    <Link to="/login"><button className='btn'>Sign In</button></Link>
                                </MDBNavbarItem>
                                <MDBNavbarItem>
                                    <Link to="/signUp"><button className='btn'>Register</button></Link>
                                </MDBNavbarItem>
                            </>

                        )}
                    </MDBNavbarNav>

                </MDBCollapse>
            </MDBContainer >
        </MDBNavbar >
    );
}