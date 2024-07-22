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

const columns = [
  { id: 'no', label: 'No', minWidth: 50 },
  { id: 'petId', label: 'Pet ID', minWidth: 170 },
  { id: 'petName', label: 'Pet Name', minWidth: 170 },
  { id: 'petBreed', label: 'Breed', minWidth: 170 },
  { id: 'petAge', label: 'Date of Birth', minWidth: 170 },
  { id: 'isOccupied', label: 'Status', minWidth: 170, align: 'center' },
  {
    id: 'petCurrentCondition',
    label: 'Current Condition',
    minWidth: 170,
    align: 'center',
  },
  { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' },
];

const conditionOptions = [
  'Finished Breakfast',
  'Use Medicine 1',
  'Finished Lunch',
  'Use Medicine 2',
  'Finished Dinner',
  'Use Medicine 3',
];

function CageList() {
  const [cageList, setCageList] = useState([]);
  const [filteredCageList, setFilteredCageList] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCage, setSelectedCage] = useState();
  const [petCurrentCondition, setPetCurrentCondition] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSetPetCurrentCondition = (event, value) => {
    if (!value) {
      toast.error('Current Condition is required');
    }
    setPetCurrentCondition(value);
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
        cageList.filter((cage) => {
          if (!cage.petId && !cage.petName) return false;
          return (
            (cage.petId && cage.petId.toLowerCase().includes(value)) ||
            (cage.petName && cage.petName.toLowerCase().includes(value))
          );
        })
      );
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const appResponse = await fetch(
          'https://localhost:7206/api/cage-management/cages-pets',
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

  async function dischargePet(e, cage) {
    e.preventDefault();
    try {
      const appResponse = await fetch(
        `https://localhost:7206/api/cage-management/cages/pets/${cage.petId}/discharge-pet`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      // var data = reponse.json();
      if (!appResponse.ok) {
        throw new Error("There's something wrong");
      }
      refreshPage();
      toast.success('Pet successfully discharged!');
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function updatePet(e, cage) {
    if (!petCurrentCondition) {
      toast.error('Current Condition is required');
      return;
    }

    const obj = {
      petCurrentCondition: petCurrentCondition,
    };
    e.preventDefault();
    try {
      const appResponse = await fetch(
        `https://localhost:7206/api/cage-management/cages/pets/${cage.petId}`,
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
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
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
                {filteredCageList
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
                          <Typography>{cage.petBreed || 'N / A'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{cage.petAge || 'N / A'}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography>
                            {cage.isOccupied ? 'Occupied' : 'Unoccupied'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography>{cage.petCurrentCondition}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Grid container justifyContent="center" spacing={2}>
                            <Grid item>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => dischargePet(e, cage)}
                                disabled={!cage.isOccupied}
                              >
                                Discharge
                              </Button>
                            </Grid>
                            <Grid item>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => toggleOpen(cage)}
                                disabled={!cage.isOccupied}
                              >
                                Update pet status
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
            count={filteredCageList.length}
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
            <DialogTitle>Edit pet's current condition</DialogTitle>
            <DialogContent>
              <form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Autocomplete
                      required
                      fullWidth
                      options={conditionOptions}
                      value={petCurrentCondition}
                      onChange={handleSetPetCurrentCondition}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Current pet condition"
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => toggleOpen()} color="primary">
                Close
              </Button>
              <Button
                onClick={(e) => updatePet(e, selectedCage)}
                color="primary"
              >
                Save changes
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </div>
  );
}

export default CageList;
