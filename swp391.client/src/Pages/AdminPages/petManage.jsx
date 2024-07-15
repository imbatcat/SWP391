import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Badge,
  LinearProgress,
} from '@mui/material';
import SideNav from '../../Component/SideNav/SideNav';
import CircularProgressWithLabel from '../../Component/CircularProgress/CircularProgressWithLabel';

function AdminPet() {
  const [pets, setPets] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredPets, setFilteredPets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const petResponse = await fetch('https://localhost:7206/api/pet-management/pets', {
          method: 'GET',
          credentials: 'include',
        });
        if (!petResponse.ok) {
          throw new Error("Error fetching pet data");
        }
        const petData = await petResponse.json();

        const accountResponse = await fetch('https://localhost:7206/api/account-management/accounts', {
          method: 'GET',
          credentials: 'include',
        });
        if (!accountResponse.ok) {
          throw new Error("Error fetching account data");
        }
        const accountData = await accountResponse.json();

        // Merge pet data with account data
        const mergedData = petData.map(pet => {
          const owner = accountData.find(account => account.accountId === pet.accountId) || {};
          return { ...pet, ownerName: owner.fullName || 'Unknown', ownerNumber: owner.phoneNumber };
        });

        setPets(mergedData);
        setFilteredPets(mergedData);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSearchInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
    if (value === '') {
      setFilteredPets(pets);
    } else {
      setFilteredPets(pets.filter(pet =>
        pet.petName.toLowerCase().includes(value) ||
        pet.petBreed.toLowerCase().includes(value) ||
        pet.ownerName.toLowerCase().includes(value)
      ));
    }
  };

  return (
    <div>
      <SideNav searchInput={searchInput} handleSearchInputChange={handleSearchInputChange} />
      {isLoading && <LinearProgress />}
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Owner Name</TableCell>
              <TableCell>Species</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Description & Vaccination</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {filteredPets.map((pet) => (
              <TableRow key={pet.id}>
                <TableCell>
                  <div className='d-flex align-items-center'>
                    <img
                      src={pet.imgUrl}
                      alt='pet img'
                      style={{ width: '45px', height: '45px' }}
                      className='rounded-circle'
                    />
                    <div className='ms-3'>
                      <p className='fw-bold mb-1'>{pet.petName}</p>
                      <p className='text-muted mb-0'>{pet.petBreed}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className='fw-bold mb-1'>{pet.ownerName}</p>
                  <p className='text-muted mb-0'>{pet.ownerNumber}</p>
                </TableCell>
                <TableCell>
                  <p className='fw-normal mb-1'>{pet.isCat ? "Cat" : "Dog"}</p>
                </TableCell>
                <TableCell>
                  <p className='fw-normal mb-1'>{pet.petAge}</p>
                </TableCell>
                <TableCell>
                  <p className='fw-bold mb-1'>{pet.description}</p>
                  <p className='text-muted mb-0'>{pet.vaccinationHistory}</p>
                </TableCell>
                <TableCell>
                  <p className='fw-normal mb-1'>{pet.isMale ? "Male" : "Female"}</p>
                </TableCell>
                <TableCell>
                  <Badge color={pet.isDisabled ? 'error' : 'success'}>
                    {pet.isDisabled ? "Disabled" : "Active"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default AdminPet;
