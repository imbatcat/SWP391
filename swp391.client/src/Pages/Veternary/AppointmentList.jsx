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
} from '@mui/material';
import SideNavForStaff from '../../Component/SideNavForStaff/SideNavForStaff';
import refreshPage from '../../Helpers/RefreshPage';
import { toast } from 'react-toastify';

const columns = [
  { id: 'petId', label: 'Pet ID', minWidth: 170 },
  { id: 'petName', label: 'Pet Name', minWidth: 170 },
  { id: 'petBreed', label: 'Breed', minWidth: 170 },
  { id: 'petAge', label: 'Age', minWidth: 170 },
  { id: 'isOccupied', label: 'Status', minWidth: 170, align: 'center' },
  { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' },
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

  const handleSetPetCurrentCondition = (e) => {
    setPetCurrentCondition(e.target.value);
  };

  const toggleOpen = (cage = null) => {
    setSelectedCage(cage);
    setIsModalOpen(!isModalOpen);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
    if (value === '') {
      setFilteredCageList(cageList);
    } else {
      setFilteredCageList(cageList.filter(cage =>
        cage.petId.toLowerCase().includes(value) ||
        cage.petName.toLowerCase().includes(value)
      ));
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const appResponse = await fetch('https://localhost:7206/api/Cages/PetDetail', {
          method: 'GET',
          credentials: 'include',
        });
        if (!appResponse.ok) {
          throw new Error("Error fetching pet data");
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
      const appResponse = await fetch(`https://localhost:7206/api/DischargePet/${cage.petId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
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
    const obj = {
      'petCurrentCondition': petCurrentCondition
    };
    e.preventDefault();
    try {
      const appResponse = await fetch(`https://localhost:7206/api/Cage/UpdatePetCondition/${cage.petId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
      });
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
    return (<CircularProgress />);
  }

  return (
    <div>
      <SideNavForStaff searchInput={searchInput} handleSearchInputChange={handleSearchInputChange} />
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
              {filteredCageList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((cage) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={cage.petId}>
                      <TableCell>
                        <Grid container alignItems="center">
                          <Grid item>
                            <Avatar
                              src={(cage.imgUrl && cage.imgUrl !== 'string' && URL.createObjectURL(cage.imgUrl)) || 'https://mdbootstrap.com/img/new/avatars/8.jpg'}
                              alt=''
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
                        <Typography>{cage.isOccupied ? 'Occupied' : 'Unoccupied'}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Grid container justifyContent="center" spacing={2}>
                          <Grid item>
                            <Button variant="contained" color="primary" onClick={(e) => dischargePet(e, cage)}>Discharge</Button>
                          </Grid>
                          <Grid item>
                            <Button variant="contained" color="secondary" onClick={() => toggleOpen(cage)}>Update pet</Button>
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
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit pet's current condition</DialogTitle>
          <DialogContent>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current pet condition"
                    value={petCurrentCondition}
                    onChange={handleSetPetCurrentCondition}
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggleOpen()} color="primary">Close</Button>
            <Button onClick={(e) => updatePet(e, selectedCage)} color="primary">Save changes</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default CageList;
