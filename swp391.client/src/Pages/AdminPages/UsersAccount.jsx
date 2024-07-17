import { useState, useEffect } from 'react';
import {
    MDBBadge, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput, MDBModalDialog,
    MDBModalContent, MDBModalTitle, MDBCol, MDBRow, MDBCheckbox
} from 'mdb-react-ui-kit';
import SideNav from '../../Component/SideNav/SideNav';
import AdminLayout from '../../Layouts/AdminLayout';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination
} from '@mui/material';
import { toast } from 'react-toastify';

function UsersAccount() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [basicModal, setBasicModal] = useState(false);
    const [basicModalNew, setBasicModalNew] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('https://localhost:7206/api/account-management/roles/1/accounts', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error("Error fetching data");
                }
                const data = await response.json();
                setAccounts(data);
                setFilteredAccounts(data);
                console.log(data);
            } catch (error) {
                console.error(error.message);
            }
        }

        fetchData();
    }, []);

    const toggleOpen = (account = null) => {
        setSelectedAccount(account);
        setBasicModal(!basicModal);
    };

    const toggleOpenNew = () => setBasicModalNew(!basicModalNew);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedAccount(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchInput(value);
        if (value === '') {
            setFilteredAccounts(accounts);
        } else {
            setFilteredAccounts(accounts.filter(acc =>
                acc.fullName.toLowerCase().includes(value) ||
                acc.phoneNumber.toLowerCase().includes(value) ||
                acc.email.toLowerCase().includes(value) ||
                acc.username.toLowerCase().includes(value)
            ));
        }
    };

    const handleSaveChanges = async () => {
        const requestBody = {
            fullName: selectedAccount.fullName,
            username: selectedAccount.username,
            email: selectedAccount.email,
            phoneNumber: selectedAccount.phoneNumber,
            isMale: selectedAccount.isMale
        };
        try {
            const response = await fetch(`https://localhost:7206/api/account-management/accounts/${selectedAccount.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error('Error updating data');
            }

            const updatedAccount = await response.json();
            setFilteredAccounts(prevAccounts => prevAccounts.map(acc => (acc.id === updatedAccount.id ? updatedAccount : acc)));
            toast.info("Account updated");
            toggleOpen();
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <AdminLayout>
            <div>
                <SideNav searchInput={searchInput} handleSearchInputChange={handleSearchInputChange} />
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 540 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone Number</TableCell>
                                    <TableCell>Date of Birth</TableCell>
                                    <TableCell>Gender</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAccounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((acc) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={acc.id}>
                                        <TableCell>
                                            <div className='d-flex align-items-center'>
                                                <img
                                                    src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                                                    alt=''
                                                    style={{ width: '45px', height: '45px' }}
                                                    className='rounded-circle'
                                                />
                                                <div className='ms-3'>
                                                    <p className='fw-bold mb-1'>{acc.fullName}</p>
                                                    <p className='text-muted mb-0'>{acc.username}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{acc.email}</TableCell>
                                        <TableCell>{acc.phoneNumber}</TableCell>
                                        <TableCell>{acc.dateOfBirth}</TableCell>
                                        <TableCell>{acc.isMale ? "Male" : "Female"}</TableCell>
                                        <TableCell>
                                            <MDBBadge color={acc.isDisabled ? 'danger' : 'success'} pill>
                                                {acc.isDisabled ? "Disabled" : "Active"}
                                            </MDBBadge>
                                        </TableCell>
                                        <TableCell>
                                            <MDBBtn color='danger' style={{ color: 'black' }} rounded size='sm' onClick={() => toggleOpen(acc)}>
                                                X
                                            </MDBBtn>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={filteredAccounts.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>

                {selectedAccount && (
                    <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
                        <MDBModalDialog centered>
                            <MDBModalContent>
                                <MDBModalHeader>
                                    <MDBModalTitle>Edit Account</MDBModalTitle>
                                    <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                                </MDBModalHeader>
                                <MDBModalBody>
                                    <form>
                                        <MDBRow className='mb-4'>
                                            <MDBCol>
                                                <MDBInput
                                                    label="Full Name"
                                                    name="fullName"
                                                    value={selectedAccount.fullName}
                                                    onChange={handleInputChange}
                                                />
                                            </MDBCol>
                                            <MDBCol>
                                                <MDBInput
                                                    label="Username"
                                                    name="username"
                                                    value={selectedAccount.username}
                                                    onChange={handleInputChange}
                                                />
                                            </MDBCol>
                                        </MDBRow>
                                        <MDBRow className='mb-4'>
                                            <MDBCol>
                                                <MDBInput
                                                    label="Email"
                                                    name="email"
                                                    value={selectedAccount.email}
                                                    onChange={handleInputChange}
                                                />
                                            </MDBCol>
                                        </MDBRow>
                                        <MDBRow className='mb-4'>
                                            <MDBCol>
                                                <MDBInput
                                                    label="Phone Number"
                                                    name="phoneNumber"
                                                    value={selectedAccount.phoneNumber}
                                                    onChange={handleInputChange}
                                                />
                                            </MDBCol>
                                            <MDBCol>
                                                <MDBCheckbox
                                                    label="Is male"
                                                    name="isMale"
                                                    checked={selectedAccount.isMale}
                                                    onChange={(e) => setSelectedAccount(prevState => ({
                                                        ...prevState,
                                                        isMale: e.target.checked
                                                    }))}
                                                />
                                            </MDBCol>
                                        </MDBRow>
                                    </form>
                                </MDBModalBody>
                                <MDBModalFooter>
                                    <MDBBtn color='secondary' onClick={toggleOpen}>Close</MDBBtn>
                                    <MDBBtn color='success' style={{ color: 'black' }} onClick={handleSaveChanges}>Save changes</MDBBtn>
                                </MDBModalFooter>
                            </MDBModalContent>
                        </MDBModalDialog>
                    </MDBModal>
                )}
            </div>
        </AdminLayout>
    );
}

export default UsersAccount;
