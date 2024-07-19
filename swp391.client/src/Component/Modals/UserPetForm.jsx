import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MDBBadge, MDBIcon } from 'mdb-react-ui-kit';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ height: '400px', overflowY: 'auto' }} // Set a height and make it scrollable
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const UserPetForm = ({ selectedPet, admissionRecords }) => {
  const [value, setValue] = useState(0);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchMedicalRecords = async (petId) => {
    try {
      const response = await fetch(
        `https://localhost:7206/api/medical-record-management/pets/${petId}/medical-records`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Error fetching medical records');
      }

      const data = await response.json();
      setMedicalRecords(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords(selectedPet.petId);
  }, [selectedPet.petId]);

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', height: '100%' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="Pet Detail" />
        <Tab label="Pet Status" />
        <Tab label="Medical Record" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <p className="Pet-detail">Age: {selectedPet.petAge}</p>
        <p className="Pet-detail">
          Vaccination: {selectedPet.vaccinationHistory}
        </p>
        <p className="Pet-detail">
          Gender: {selectedPet.isMale ? 'Male' : 'Female'}
        </p>
        <p className="Pet-detail">Description: {selectedPet.description}</p>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {admissionRecords.length > 0 ? (
          admissionRecords.map((status, index) => (
            <Accordion sx={{ minWidth: 500 }} key={status.admissionId}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography>
                  Admission Date: {status.admissionDate}
                  <MDBBadge
                    color={
                      status.petCurrentCondition === 'Finished Dinner'
                        ? 'warning'
                        : status.petCurrentCondition === 'Finished Lunch'
                        ? 'warning'
                        : status.petCurrentCondition === 'Sleeping'
                        ? 'primary'
                        : status.petCurrentCondition === 'Is discharged'
                        ? 'success'
                        : 'secondary'
                    }
                    pill
                  >
                    {status.petCurrentCondition === 'Finished Dinner' ? (
                      <>
                        Finished Dinner <MDBIcon fas icon="utensils" />
                      </>
                    ) : status.petCurrentCondition === 'Finished Lunch' ? (
                      <>
                        Finished Lunch <MDBIcon fas icon="utensils" />
                      </>
                    ) : status.petCurrentCondition === 'Sleeping' ? (
                      <>
                        Sleeping <MDBIcon fas icon="bed" />
                      </>
                    ) : status.petCurrentCondition === 'Is discharged' ? (
                      <>
                        Đã Khỏe <MDBIcon fas icon="paw" />
                      </>
                    ) : (
                      status.petCurrentCondition
                    )}
                  </MDBBadge>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Admission ID: {status.admissionId}</Typography>
                <Typography>Condition: {status.petCurrentCondition}</Typography>
                <Typography>
                  Discharge Date: {status.dischargeDate || 'N/A'}
                </Typography>
                {/* Add more details as needed */}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <p>The pet is not hospitalized</p>
        )}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {isLoading ? (
          <p>Loading...</p>
        ) : medicalRecords.length > 0 ? (
          medicalRecords.map((record, index) => (
            <Accordion sx={{ minWidth: 500 }} key={record.medicalRecordId}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography>Date Created: {record.dateCreated}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Medical Record ID: {record.medicalRecordId}
                </Typography>
                <Typography>Pet Weight: {record.petWeight}</Typography>
                <Typography>Appointment ID: {record.appointmentId}</Typography>
                {/* Add more details as needed */}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <p>No medical records found</p>
        )}
      </TabPanel>
    </Box>
  );
};

export default UserPetForm;
