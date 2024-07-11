import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Grid,
  Avatar,
  Typography,
} from '@mui/material';
import SideNavForStaff from '../../Component/SideNavForStaff/SideNavForStaff';
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import "react-datepicker/dist/react-datepicker.css";
import refreshPage from '../../Helpers/RefreshPage';
import { AiOutlineConsoleSql } from 'react-icons/ai';

const columns = [
  { id: 'appointmentId', label: 'Appointment ID', minWidth: 170 },
  { id: 'customerName', label: 'Owner Name', minWidth: 170 },
  { id: 'petName', label: 'Pet Name', minWidth: 170 },
  { id: 'vetName', label: 'Veterinarian', minWidth: 170 },
  { id: 'status', label: 'Status', minWidth: 170 },
  { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' },
];

export default function AppointmentCheckin() {
  const [appointmentList, setAppointmentList] = useState([]);
  const [filteredAppointmentList, setFilteredAppointmentList] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [convertedDate, setConvertedDate] = useState(() => {
    const currentDate = new Date();
    return {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
    };
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [buffer, setBuffer] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const date = `${convertedDate.year}-${convertedDate.month}-${convertedDate.day}`;
    const fetchData = async () => {
      const response = await fetch(`https://localhost:7206/api/appointment-management/dates/${date}/time-slots/0/appointments/staff?isGetAllTimeSlot=true`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.status !== 200) throw new Error() 
      const data = await fetchData.json();
      setAppointmentList(data);
      setFilteredAppointmentList(data);
    }

    try {
      toast.promise(
        fetchData(),
        {
          pending: 'Loading appointments...',
          success: 'Appointments loaded successfully!',
          error: 'Failed to load appointments.'
        }
      );
    } catch (err) {
      console.log(err);
    }
  }, [convertedDate]);

  const handleDateChange = (date) => {
    setStartDate(date);
    const parsedDate = new Date(date);
    setConvertedDate({
      year: parsedDate.getFullYear(),
      month: parsedDate.getMonth() + 1,
      day: parsedDate.getDate()
    });
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
    if (value === '') {
      setFilteredAppointmentList(appointmentList);
    } else {
      setFilteredAppointmentList(appointmentList.filter(app =>
        app.appointmentId.toLowerCase().includes(value) ||
        app.customerName.toLowerCase().includes(value)
      ));
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  async function checkinAppointment(app) {
    if (isProcessing) {
      setBuffer((prevBuffer) => [...prevBuffer, app]);
      return;
    }

    setIsProcessing(true);

    const fetchData = async () => {
      const response = await fetch(`https://localhost:7206/api/appointment-management/appointments/${app.appointmentId}/check-in`, {
        method: 'POST',
        credentials: 'include',
      });
    
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setAppointmentList([]);
      refreshPage();
      return response.json();
    }

    toast.promise(
      fetchData().catch(err => {
          console.log(err); 
          setIsProcessing(false); 
          if (buffer.length > 0) {
            var nextForm = buffer.shift()
            setBuffer([]); 
            checkinAppointment(nextForm); 
          }
      }),
      {
          pending: 'Checking in...',
          success: 'Checked in!',
          error: 'There is something wrong',
      }
  ).finally(() => {
      setIsProcessing(false); 
  });
  }
  return (
    <>
      <SideNavForStaff searchInput={searchInput} handleSearchInputChange={handleSearchInputChange} />
      <DatePicker
        selected={startDate}
        onChange={(date) => handleDateChange(date)}
      />
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointmentList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((app) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={app.appointmentId}>
                      {columns.map((column) => {
                        const value = app[column.id];
                        if (column.id === 'actions') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Button variant="contained" color="primary" onClick={() => checkinAppointment(app)}>Checkin</Button>
                            </TableCell>
                          );
                        }
                        if (column.id === 'customerName') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Grid container alignItems="center">
                                <Grid item>
                                  <Avatar
                                    src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                                    alt=''
                                    style={{ width: '45px', height: '45px' }}
                                  />
                                </Grid>
                                <Grid item>
                                  <Typography className='fw-bold mb-1'>{app.customerName}</Typography>
                                  <Typography className='text-muted mb-0'>{app.phoneNumber}</Typography>
                                </Grid>
                              </Grid>
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredAppointmentList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
