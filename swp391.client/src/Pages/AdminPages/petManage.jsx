import { useState, useEffect } from 'react';
import { MDBBadge, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import SideNav from '../../Component/SideNav/SideNav';

function AdminPet() {
  const [pets, setPets] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredPets, setFilteredPets] = useState([]);

  useEffect(() => {
    async function fetchData() {
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
      <MDBTable align='middle'>
        <MDBTableHead>
          <tr>
            <th scope='col'>Name</th>
            <th scope='col'>Owner Name</th>
            <th scope='col'>Species</th>
            <th scope='col'>Date of Birth</th>
            <th scope='col'>Description & Vaccination</th>
            <th scope='col'>Gender</th>
            <th scope='col'>Status</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {filteredPets.map((pet) => (
            <tr key={pet.id}>
              <td>
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
              </td>
              <td>
              <p className='fw-bold mb-1'>{pet.ownerName}</p>
              <p className='text-muted mb-0'>{pet.ownerNumber}</p>
              </td>
              <td>
                <p className='fw-normal mb-1'>{pet.isCat ? "Cat" : "Dog"}</p>
              </td>
              <td>
                <p className='fw-normal mb-1'>{pet.petAge}</p>
              </td>
              <td>
                <p className='fw-bold mb-1'>{pet.description}</p>
                <p className='text-muted mb-0'>{pet.vaccinationHistory}</p>
              </td>
              <td>
                <p className='fw-normal mb-1'>{pet.isMale ? "Male" : "Female"}</p>
              </td>
              <td>
                <MDBBadge color={pet.isDisabled ? 'danger' : 'success'} pill>
                  {pet.isDisabled ? "Disabled" : "Active"}
                </MDBBadge>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
    </div>
  );
}

export default AdminPet;
