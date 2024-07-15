import { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { SideNavData } from './SideNavDataForStaff';
import './SideNavForStaff.css';
import { IconContext } from 'react-icons';
import { toast } from 'react-toastify';
import { MDBCol, MDBContainer, MDBIcon } from 'mdb-react-ui-kit';
import QRCodeScannerModal from '../QRCodeScanner/QRCodeScanner';

function SideNavForStaff({ searchInput, handleSearchInputChange }) {
    const [sidebar, setSidebar] = useState(false);
    const [scannerModal, setScannerModal] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);
    const navigate = useNavigate();
    const toggleOpen = () => setScannerModal(!scannerModal);
    
    const logout = async () => {
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
            localStorage.removeItem("user");
            navigate('/');
        } catch (error) {
            navigate('/');
            toast.error('Error logging out!');
            console.error(error.message);
        }
    };

    const handleScan = (data) => {
        if (data) {
            handleSearchInputChange({ target: { value: data.text } });
            setScannerModal(false);
        }
    };

    const handleError = (err) => {
        console.error(err);
        toast.error('Error scanning QR code!');
    };


    return (
        <>
            <IconContext.Provider value={{ color: '#fff' }}>
                <div className='navbar'>
                    <MDBCol md='9'>
                        <Link className='menu-bars'>
                            <FaIcons.FaBars onClick={showSidebar} />
                        </Link>
                    </MDBCol>
                    <MDBCol md='2'>
                        <MDBContainer className="py-1 search-container">
                            <input
                                type="text"
                                className="search-hover"
                                placeholder="Search here"
                                value={searchInput}
                                onChange={handleSearchInputChange}
                            />
                            <MDBIcon icon='search' style={{ marginLeft: '-35px' }} />
                        </MDBContainer>
                    </MDBCol>
                    <MDBCol style={{ justifyContent: 'center', display: 'flex' }} md='1'>
                        <AiIcons.AiOutlineExpand size='45px' onClick={toggleOpen} />
                    </MDBCol>
                </div>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        <li className='navbar-toggle'>
                            <Link to='#' className='menu-bars'>
                                <AiIcons.AiOutlineClose />
                            </Link>
                        </li>
                        {SideNavData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                        <li className='nav-text'>
                            <Link onClick={() => logout()}>
                                <span>Log Out</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <QRCodeScannerModal
                    scannerModal={scannerModal}
                    toggleOpen={toggleOpen}
                    handleScan={handleScan}
                    handleError={handleError}
                />
            </IconContext.Provider>
        </>
    );
}

export default SideNavForStaff;
