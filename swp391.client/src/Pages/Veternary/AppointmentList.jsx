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
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { Link } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function AppointmentList() {
  const [user, setUser] = useUser();
  const [appointments, setAppointments] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('appointmentDate');
  const [tabValue, setTabValue] = useState('all');
  const [expandedAccordion, setExpandedAccordion] = useState(false);

  async function fetchData() {
    try {
      const response = await fetch(`https://localhost:7206/api/appointment-management/vets/get-all`, {
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
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    filterAppointments();
  }, [tabValue, appointments]);

  const filterAppointments = () => {
    if (tabValue === 'myAppointments') {
      setFilteredAppointments(appointments.filter(app => app.veterinarianId === user.id));
    } else {
      setFilteredAppointments(appointments);
    }
  };

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
      filterAppointments();
    } else {
      setFilteredAppointments(filteredAppointments.filter(app =>
        (app.ownerName && app.ownerName.toLowerCase().includes(value)) ||
        (app.ownerNumber && app.ownerNumber.toLowerCase().includes(value)) ||
        (app.appointmentDate && app.appointmentDate.toLowerCase().includes(value)) ||
        (app.timeSlot && app.timeSlot.toLowerCase().includes(value)) ||
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

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
    setExpandedAccordion(false);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
    if (isExpanded) {
      let filteredList = appointments;
      if (panel === 'waiting') {
        filteredList = appointments.filter(app => app.isCheckIn && !app.isCheckUp && app.veterinarianId === user.id);
      } else if (panel === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filteredList = appointments.filter(app => app.appointmentDate === today && app.veterinarianId === user.id);
      } else {
        filteredList = appointments.filter(app => app.veterinarianId === user.id);
      }
      setFilteredAppointments(filteredList);
    } else {
      filterAppointments();
    }
  };

  const pageCount = Math.ceil(filteredAppointments.length / rowsPerPage);

  if (isLoading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div>
      <SideNavForVet searchInput={searchInput} handleSearchInputChange={handleSearchInputChange} />
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
            <Tab value="all" label="All" />
            <Tab value="myAppointments" label="My Appointments" />
          </Tabs>
        </Box>
        {tabValue === 'myAppointments' && (
          <Box>
            <Accordion expanded={expandedAccordion === 'waiting'} onChange={handleAccordionChange('waiting')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="waiting-content"
                id="waiting-header"
              >
                <Typography>Waiting (Check-in Appointments)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderTable()}
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expandedAccordion === 'today'} onChange={handleAccordionChange('today')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="today-content"
                id="today-header"
              >
                <Typography>Today (Active Appointments for Today)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderTable()}
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expandedAccordion === 'showAll'} onChange={handleAccordionChange('showAll')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="showAll-content"
                id="showAll-header"
              >
                <Typography>Show All</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderTable()}
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
        {tabValue !== 'myAppointments' && renderTable()}
      </Paper>
    </div>
  );

  function renderTable() {
    return (
      <>
        <TableContainer sx={{ maxHeight: 500 }}>
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
                <TableCell>Medical Record</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAppointments.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((app, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={app.appointmentId}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
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
                  <TableCell>
                    <Link to='/vet/MedicalRecord' state={app}>
                      <MDBBtn color='danger'>View Detail</MDBBtn>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="center" m={2}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            color="secondary"
          />
        </Box>
        <br/>
      </>
    );
  }
}

export default AppointmentList;
