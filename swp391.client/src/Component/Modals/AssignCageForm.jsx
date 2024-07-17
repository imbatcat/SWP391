import {
  MDBBadge,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBCardFooter,
} from 'mdb-react-ui-kit';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import ReactToPrint from 'react-to-print';

function AssignCageForm({ mRecId, petData, ownerData, vetData, toggleOpen }) {
  const [cages, setCages] = useState([]);
  const [selectedCage, setSelectedCage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc'); // State to track sorting order
  const [admissionForm, setAdmissionForm] = useState({
    dischargeDate: new Date().toISOString().split('T')[0],
    petCurrentCondition: '',
    isDischarged: false,
    petId: petData.petId,
    cageId: '',
    medicalRecordId: mRecId,
    veterinarianId: vetData.accountId,
  });

  const toggleModal = () => setModalOpen(!modalOpen);
  const componentRef = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          'https://localhost:7206/api/cage-management/cages',
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
        const data = await response.json();
        setCages(data);
        console.log(data);
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchData();
  }, []);

  const calculatePetAge = (petDOB) => {
    const birthDate = new Date(petDOB);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} Year${years !== 1 ? 's' : ''} ${months} Month${
      months !== 1 ? 's' : ''
    } and ${days} Day${days !== 1 ? 's' : ''}`;
  };

  const handleAddCage = (cage) => {
    setSelectedCage(cage);
  };

  const handleRemoveCage = () => {
    setSelectedCage(null);
  };

  const handleSubmitService = async () => {
    const assignToCage = async () => {
      const reqBody = {
        cageNumber: selectedCage.cageNumber,
        isOccupied: true,
      };
      console.log(JSON.stringify(reqBody));
      const urls = [
        `https://localhost:7206/api/cage-management/cages/${selectedCage.cageId}`,
        `https://localhost:7206/api/admission-record-management/admission-records`,
      ];
      const reqBodyAdmission = admissionForm;
      console.log(vetData);
      reqBodyAdmission.cageId = selectedCage.cageId;
      console.log(reqBodyAdmission);
      const [cageResponse, admissionResponse] = await Promise.all([
        fetch(urls[0], {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(reqBody),
        }),
        fetch(urls[1], {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(reqBodyAdmission),
        }),
      ]);
    };

    toast.promise(
      assignToCage().catch((err) => {
        console.error(err);
        throw new Error(err);
      }),
      {
        pending: 'Submitting your request...',
        success: 'Request submitted successfully!',
        error: "There's someting wrong",
      }
    );
  };

  const isCageSelected = (cageId) => {
    return selectedCage && selectedCage.cageId === cageId;
  };

  const calculateTotalPrice = () => {
    return selectedCage ? selectedCage.servicePrice : 0;
  };

  const handleSort = () => {
    const sortedCages = [...cages].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.isOccupied - b.isOccupied;
      } else {
        return b.isOccupied - a.isOccupied;
      }
    });
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setCages(sortedCages);
  };

  return (
    <div ref={componentRef}>
      <style>
        {`
                    @media print {
                        body {
                            margin: 0;
                        }
                        .no-print {
                            display: none !important;
                        }
                        .print-container {
                            width: 100vw;
                            height: 100vh;
                            padding: 0;
                            margin: 0;
                        }
                        .print-container .mdb-card {
                            border: none;
                            margin: 0;
                            padding: 0;
                        }
                    }
                `}
      </style>
      <MDBCard
        className="print-container"
        style={{
          minHeight: '60vw',
          minWidth: '100%',
          maxWidth: '100vw',
          margin: 'auto',
        }}
      >
        <MDBCardHeader style={{ textAlign: 'center', fontSize: '3vw' }}>
          Medical Service
        </MDBCardHeader>
        <MDBCardBody style={{ height: '5' }} scrollable>
          <MDBRow style={{ marginLeft: '15px', marginRight: '15px' }}>
            <MDBCol sm="6">
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle style={{ textAlign: 'center' }}>
                    Owner Information
                  </MDBCardTitle>
                  <MDBCardText>
                    <div style={{ textAlign: 'center' }}>
                      <p className="fw-bold mb-1">{ownerData.fullName}</p>
                      <p className="text-muted mb-0">{ownerData.phoneNumber}</p>
                    </div>
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
              <br />
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle style={{ textAlign: 'center' }}>
                    Veterinarian Information
                  </MDBCardTitle>
                  <MDBCardText>
                    <div style={{ textAlign: 'center' }}>
                      <p className="fw-bold mb-1">{vetData.fullName}</p>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: '1rem' }}
                      >
                        {vetData.position}
                      </p>
                    </div>
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol sm="6">
              <MDBCard style={{ minHeight: '100%' }}>
                <MDBCardBody>
                  <MDBCardTitle style={{ textAlign: 'center' }}>
                    Pet Information
                  </MDBCardTitle>
                  <MDBCardText>
                    <div style={{ textAlign: 'center' }}>
                      <p className="fw-bold mb-1">{petData.petName}</p>
                      <p className="text-muted mb-0">{petData.petAge}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <MDBBadge
                        color={petData.isCat ? 'warning' : 'primary'}
                        pill
                      >
                        {petData.isCat ? 'Cat' : 'Dog'}
                      </MDBBadge>
                      <MDBBadge
                        color={petData.isMale ? 'primary' : 'danger'}
                        pill
                      >
                        {petData.isMale ? 'Male' : 'Female'}
                      </MDBBadge>
                    </div>
                    <p className="text-muted mb-0">
                      - Pet Age: {calculatePetAge(petData.petAge)}{' '}
                    </p>
                    <p className="text-muted mb-0">
                      - Pet Breed: {petData.petBreed}{' '}
                    </p>
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
          <br />

          <MDBRow style={{ marginLeft: '15px', marginRight: '15px' }}>
            <MDBCard>
              <MDBCardHeader>
                <MDBRow>
                  <MDBCol sm="9">Medical Service Information</MDBCol>
                  <MDBCol sm="3" className="no-print">
                    <MDBBtn
                      style={{ fontSize: '0.65rem' }}
                      onClick={toggleModal}
                    >
                      Cage List
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBCardHeader>
              <MDBCardBody>
                <MDBCardText>
                  <MDBTable style={{ minWidth: '100%' }} align="middle">
                    <MDBTableBody>
                      {selectedCage && (
                        <tr key={selectedCage.cageId}>
                          <td>
                            <div className="ms-3">
                              <p className="fw-bold mb-1">
                                The pet will be assigned to cage number{' '}
                                {selectedCage.cageNumber}
                              </p>
                            </div>
                          </td>
                          <td>
                            <p className="fw-normal mb-1">
                              {selectedCage.servicePrice}
                            </p>
                          </td>
                          <td>
                            <MDBBtn
                              className="no-print"
                              color="danger"
                              onClick={handleRemoveCage}
                            >
                              x
                            </MDBBtn>
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td
                          colSpan="2"
                          style={{ textAlign: 'right', fontWeight: 'bold' }}
                        >
                          Total Price:
                        </td>
                        <td colSpan="2" style={{ fontWeight: 'bold' }}>
                          {calculateTotalPrice()}
                        </td>
                      </tr>
                    </MDBTableBody>
                  </MDBTable>
                </MDBCardText>
                <MDBBtn
                  className="no-print"
                  type="submit"
                  onClick={() => handleSubmitService()}
                >
                  Submit
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBRow>
        </MDBCardBody>
        <MDBCardFooter>
          <ReactToPrint
            trigger={() => {
              return <MDBBtn className="no-print">Print</MDBBtn>;
            }}
            content={() => componentRef.current}
            documentTitle="Pet-ternary"
            pageStyle="@media print { body { margin: 0; } .print-container { width: 100vw; height: 100vh; } }"
          />
        </MDBCardFooter>
      </MDBCard>

      <MDBModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tabIndex="-1"
      >
        <MDBModalDialog scrollable style={{ minWidth: 'fit-content' }}>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Select Cages</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBTable style={{ minWidth: '100%' }} align="middle">
                <MDBTableHead>
                  <tr>
                    <th scope="col">Cage Number</th>
                    <th
                      scope="col"
                      onClick={handleSort}
                      style={{ cursor: 'pointer' }}
                    >
                      Status {sortOrder === 'asc' ? '▲' : '▼'}
                    </th>
                    <th scope="col">Action</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {cages.map((cage) => (
                    <tr key={cage.id}>
                      <td>
                        <div className="ms-3">
                          <p className="fw-bold mb-1">{cage.cageNumber}</p>
                        </div>
                      </td>
                      <td>
                        <MDBBadge
                          color={cage.isOccupied ? 'warning' : 'secondary'}
                          pill
                        >
                          {cage.isOccupied ? 'Occupied' : 'Unoccupied'}
                        </MDBBadge>
                      </td>
                      <td>
                        <MDBBtn
                          color={
                            cage.isOccupied
                              ? 'warning'
                              : isCageSelected(cage.cageId)
                              ? 'danger'
                              : 'secondary'
                          }
                          style={{ color: 'black' }}
                          rounded
                          size="sm"
                          onClick={() => handleAddCage(cage)}
                          disabled={
                            isCageSelected(cage.cageId) || cage.isOccupied
                          }
                        >
                          {isCageSelected(cage.cageId)
                            ? 'Selected'
                            : cage.isOccupied
                            ? 'Already Occupied'
                            : 'Select'}
                        </MDBBtn>
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleModal}>
                Close
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}

export default AssignCageForm;
