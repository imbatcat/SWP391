import { useState, useEffect } from 'react';
import { MDBBadge, MDBBtn } from 'mdb-react-ui-kit';
import SideNavForVet from '../../Component/SideNavForVet/SideNavForVet';
import { useUser } from '../../Context/UserContext';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';

function  MedicalRecordList() {
  const [user, setUser] = useUser();
  const [appointments, setAppointments] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('appointmentDate');

  async function fetchData(vetId) {
    try {
      const response = await fetch(`https://localhost:7206/api/appointment-management/vets/${vetId}/appointments`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      setAppointments(data);
      setFilteredAppointments(data);
      setIsLoading(false);
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      fetchData(user.id);
    }
    console.log(user.id);
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>; // Loading state
  }

  const getBadgeColor = (app) => {
    if (app.isCancel) {
      return 'danger'; // red
    }
    if (app.isCheckUp) {
      return 'success'; // green
    }
    if (app.isCheckIn) {
      return 'warning'; // yellow
    }
    return 'secondary'; // default color
  }

  const handleSearchInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
    if (value === '') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(appointments.filter(app =>
        (app.ownerName && app.ownerName.toLowerCase().includes(value)) ||
        (app.ownerNumber && app.ownerNumber.toLowerCase().includes(value)) ||
        (app.appointmentDate && app.appointmentDate.toLowerCase().includes(value)) ||
        (app.timeSlot && app.timeSlot.toLowerCase().includes(value))||
        (app.appointmentId && app.appointmentId.toLowerCase().includes(value))
      ));
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortComparator = (a, b, orderBy) => {
    if (orderBy === 'appointmentDate') {
      const dateA = new Date(`${a.appointmentDate} `);
      const dateB = new Date(`${b.appointmentDate}`);
      return dateA - dateB;
    }
    return a[orderBy].localeCompare(b[orderBy]);
  };

  const sortedAppointments = filteredAppointments.slice().sort((a, b) => {
    const orderModifier = order === 'asc' ? 1 : -1;
    return orderModifier * sortComparator(a, b, orderBy);
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <SideNavForVet searchInput={searchInput} handleSearchInputChange={handleSearchInputChange} />
      <Paper sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: 640 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Name & Phone</TableCell>
                <TableCell>Pet Name</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'appointmentDate'}
                    direction={orderBy === 'appointmentDate' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'appointmentDate')}
                  >
                    Date & Timeslot
                  </TableSortLabel>
                </TableCell>
                <TableCell>Veterinarian</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Booking Price</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAppointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((app, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={app.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <div className='d-flex align-items-center'>
                      <img
                        src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                        alt=''
                        style={{ width: '45px', height: '45px' }}
                        className='rounded-circle'
                      />
                      <div className='ms-3'>
                        <p className='fw-bold mb-1'>{app.ownerName}</p>
                        <p className='text-muted mb-0'>{app.ownerNumber}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className='fw-normal mb-1'>{app.petName}</p>
                  </TableCell>
                  <TableCell>
                    <p className='fw-bold mb-1'>{app.appointmentDate}</p>
                    <p className='text-muted mb-0'>{app.timeSlot}</p>
                  </TableCell>
                  <TableCell>
                    <p className='fw-normal mb-1'>{app.veterinarianName}</p>
                  </TableCell>
                  <TableCell>
                    <MDBBadge color={getBadgeColor(app)} pill>
                      {app.isCancel ? "Cancelled" : app.isCheckUp ? "Checked Up" : app.isCheckIn ? "Checked In" : "Active"}
                    </MDBBadge>
                  </TableCell>
                  <TableCell>
                    <p className='fw-bold mb-1'>{app.bookingPrice}</p>
                    <p className='text-muted mb-0'>{app.appointmentType}</p>
                  </TableCell>
                  <TableCell>
                    <p className='fw-normal mb-1'>{app.appointmentNotes}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredAppointments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default MedicalRecordList;
