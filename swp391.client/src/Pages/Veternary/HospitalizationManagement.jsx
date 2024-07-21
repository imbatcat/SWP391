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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Avatar,
  CircularProgress,
  Typography,
  Autocomplete,
} from '@mui/material';
import SideNavForStaff from '../../Component/SideNavForStaff/SideNavForStaff';
import refreshPage from '../../Helpers/RefreshPage';
import { toast } from 'react-toastify';
import { useUser } from '../../Context/UserContext';
import { MDBInput } from 'mdb-react-ui-kit';

const columns = [
  { id: 'no', label: 'No', minWidth: 50 },
  { id: 'petId', label: 'Pet ID', minWidth: 170 },
  { id: 'petName', label: 'Pet Name', minWidth: 170 },
  { id: 'dischargeDate', label: 'Discharge date', minWidth: 170 },
  { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' },
];

function HospitalizationManagement() {
  const [user, setUser] = useUser();
  const [cageList, setCageList] = useState([]);
  const [filteredHospitalizationManagement, setFilteredCageList] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCage, setSelectedCage] = useState();
  const [petCurrentCondition, setPetCurrentCondition] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setSelectedCage((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const toggleOpen = (cage = null) => {
    setSelectedCage(cage);
    if (cage) {
      setPetCurrentCondition(cage.petCurrentCondition);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
    if (value === '') {
      setFilteredCageList(cageList);
    } else {
      setFilteredCageList(
        cageList.filter(
          (cage) =>
            cage.petId.toLowerCase().includes(value) ||
            cage.petName.toLowerCase().includes(value)
        )
      );
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(user.id);
        const appResponse = await fetch(
          `https://localhost:7206/api/admission-record-management/admission-records/hospitalized-management/${user.id}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        if (!appResponse.ok) {
          throw new Error('Error fetching pet data');
        }
        const data = await appResponse.json();
        setCageList(data);
        setFilteredCageList(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  async function updateDischargeDate(e) {
    if (!selectedCage.dischargeDate) {
      toast.error('Enter a date');
      return;
    }

    const obj = {
      dischargeDate: selectedCage.dischargeDate,
    };
    e.preventDefault();
    const sendApi = async () => {
      const appResponse = await fetch(
        `https://localhost:7206/api/admission-record-management/admission-records/${selectedCage.admissionId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj),
        }
      );
      if (!appResponse.ok) {
        throw new Error("There's something wrong");
      }
      toast.success('Changes saved');
      refreshPage();
    };

    toast
      .promise(
        sendApi().catch((err) => {
          console.log(err);
          throw new Error(err.message);
        }),
        {
          pending: 'Updating discharge date...',
          success: 'Date updated!',
          error: 'Failed to update discharge date!',
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div>
        <SideNavForStaff
          searchInput={searchInput}
          handleSearchInputChange={handleSearchInputChange}
        />
      </div>
      <div>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 640 }}>
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
                {filteredHospitalizationManagement
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((cage, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={cage.petId}
                      >
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>
                          <Grid container alignItems="center">
                            <Grid item>
                              <Avatar
                                src={
                                  cage.imgUrl && typeof cage.imgUrl !== 'string'
                                    ? URL.createObjectURL(cage.imgUrl)
                                    : 'https://mdbootstrap.com/img/new/avatars/8.jpg'
                                }
                                alt=""
                                style={{ width: '45px', height: '45px' }}
                              />
                            </Grid>
                            <Grid item>
                              <Typography>{cage.petId}</Typography>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell>
                          <Typography>{cage.petName || 'N / A'}</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography>{cage.dischargeDate}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Grid container justifyContent="center" spacing={2}>
                            <Grid item>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => toggleOpen(cage)}
                              >
                                Change discharge date
                              </Button>
                            </Grid>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredHospitalizationManagement.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {selectedCage && (
          <Dialog
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Edit pet's discharge date</DialogTitle>
            <DialogContent>
              <form>
                <Grid item xs={12}>
                  <MDBInput
                    name="dischargeDate"
                    type="date"
                    value={selectedCage.dischargeDate}
                    min={selectedCage.admissionDate}
                    onChange={(e) => handleDateChange(e)}
                  ></MDBInput>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => toggleOpen()} color="primary">
                Close
              </Button>
              <Button onClick={(e) => updateDischargeDate(e)} color="primary">
                Save changes
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </div>
  );
}

export default HospitalizationManagement;
