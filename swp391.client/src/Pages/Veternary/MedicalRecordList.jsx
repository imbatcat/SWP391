import { useState, useEffect } from 'react';
import { 
  MDBBadge, MDBBtn, MDBTable, MDBTableBody, MDBTableHead
} 
  from 'mdb-react-ui-kit';
import SideNavForVet from '../../Component/SideNavForVet/SideNavForVet';
import { useUser } from '../../Context/UserContext';


function MedicalRecordList() {
    const { user } = useUser();
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredMedicalRecords, setFilteredMedicalRecords] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`https://localhost:7206/api/medical-record-management/vets/${user.id}/medical-records`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error("Error fetching data");
                }
                const data = await response.json();
                setMedicalRecords(data);
                setFilteredMedicalRecords(data);
                console.log(data);
            } catch (error) {
                console.error(error.message);
            }
        }

        fetchData();
    }, []);

    const handleSearchInputChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchInput(value);
        if (value === '') {
            setFilteredMedicalRecords(medicalRecords);
        } else {
            setFilteredMedicalRecords(filteredMedicalRecords.filter(mc =>
                mc.dateCreated.toLowerCase().includes(value) 
                // mc.username.toLowerCase().includes(value) ||
                // mc.fullName.toLowerCase().includes(value) ||
                // mc.username.toLowerCase().includes(value)
            ));
        }
    };


    return (
        <div>
            <SideNavForVet searchInput={searchInput} handleSearchInputChange={handleSearchInputChange} />
            <MDBTable align='middle'>
                <MDBTableHead>
                    <tr>
                        <th scope='col'>Name</th>
                        <th scope='col'>Email</th>
                        <th scope='col'>Phone Number</th>
                        <th scope='col'>Date of Birth</th>
                        <th scope='col'>Gender</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Actions</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {filteredMedicalRecords.map((mc) => (
                        <tr key={mc.id}>
                            <td>
                                <div className='d-flex align-items-center'>
                                    <img
                                        src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                                        alt=''
                                        style={{ width: '45px', height: '45px' }}
                                        className='rounded-circle'
                                    />
                                    <div className='ms-3'>
                                        <p className='fw-bold mb-1'>{mc.dateCreated}</p>
                                        <p className='text-muted mb-0'>{mc.username}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p className='fw-normal mb-1'>{mc.email}</p>
                            </td>
                            <td>
                                <p className='fw-normal mb-1'>{mc.phoneNumber}</p>
                            </td>                     <td>
                                <p className='fw-normal mb-1'>{mc.dateOfBirth}</p>
                            </td>
                            <td>
                                <p className='fw-normal mb-1'>{mc.isMale ? "Male" : "Female"}</p>
                            </td>
                            <td>
                                <MDBBadge color={mc.isDisabled ? 'danger' : 'success'} pill>
                                    {mc.isDisabled ? "Disabled" : "Active"}
                                </MDBBadge>
                            </td>
                            <td>
                                <MDBBtn color='link' rounded size='sm' onClick={() => toggleOpen(acc)}>
                                    Edit
                                </MDBBtn>
                                <MDBBtn color='danger' style={{color:'black'}} rounded size='sm' onClick={() => toggleOpen(acc)}>
                                    X
                                </MDBBtn>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

        </div>
    );
}

export default MedicalRecordList;
