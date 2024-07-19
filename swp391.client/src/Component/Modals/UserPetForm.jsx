import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MDBCol, MDBRow } from 'mdb-react-ui-kit';

const steps = [
  { label: 'Finished Breakfast' },
  { label: 'Use Medicine 1' },
  { label: 'Finished Lunch' },
  { label: 'Use Medicine 2' },
  { label: 'Sleeping' },
  { label: 'Finished Dinner' },
  { label: 'Use Medicine 3' },
  { label: 'Sleeping Again' },
  { label: 'Home' },
];

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

  const getCurrentStep = (condition) => {
    switch (condition) {
      case 'Finished Breakfast':
        return 0;
      case 'Use Medicine 1':
        return 1;
      case 'Finished Lunch':
        return 2;
      case 'Use Medicine 2':
        return 3;
      case 'Sleeping':
        return 4;
      case 'Finished Dinner':
        return 5;
      case 'Use Medicine 3':
        return 6;
      case 'Sleeping Again':
        return 7;
      case 'Is discharged':
        return 8;
      default:
        return -1;
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
          admissionRecords.map((status) => (
            <Accordion sx={{ minWidth: 500 }} key={status.admissionId}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${status.admissionId}-content`}
                id={`panel-${status.admissionId}-header`}
              >
                <Typography>Admission Date: {status.admissionDate}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <MDBRow>
                  <MDBCol size="6">
                    <Typography>Admission ID: {status.admissionId}</Typography>
                    <Typography>
                      Condition: {status.petCurrentCondition}
                    </Typography>
                    <Typography>
                      Discharge Date: {status.dischargeDate || 'N/A'}
                    </Typography>
                  </MDBCol>
                  <MDBCol size="6">
                    <Stepper
                      activeStep={getCurrentStep(status.petCurrentCondition)}
                      orientation="vertical"
                    >
                      {steps.map((step, index) => (
                        <Step key={step.label}>
                          <StepLabel>{step.label}</StepLabel>
                          {index === steps.length - 1 && (
                            <StepContent>
                              <Typography variant="caption">
                                Thank You for using out Service
                              </Typography>
                            </StepContent>
                          )}
                        </Step>
                      ))}
                    </Stepper>
                  </MDBCol>
                </MDBRow>
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
          medicalRecords.map((record) => (
            <Accordion sx={{ minWidth: 500 }} key={record.medicalRecordId}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${record.medicalRecordId}-content`}
                id={`panel-${record.medicalRecordId}-header`}
              >
                <Typography>Date Created: {record.dateCreated}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Medical Record ID: {record.medicalRecordId}
                </Typography>
                <Typography>Pet Weight: {record.petWeight}</Typography>
                <Typography>Appointment ID: {record.appointmentId}</Typography>
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
