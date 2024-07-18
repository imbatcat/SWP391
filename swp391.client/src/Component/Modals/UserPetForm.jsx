import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

const UserPetForm = ({ selectedPet }) => {
    const [value, setValue] = useState(0);
    const [petStatus, setPetStatus] = useState(null);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    console.log(selectedPet.petId)

    useEffect(() => {
        const fetchPetStatus = async () => {
            try {
                const response = await fetch(`https://localhost:7206/api/admission-record-management/pets/${selectedPet.petId}/admission-records`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPetStatus(data);
            } catch (error) {
                console.error('Error fetching pet status:', error);
                setPetStatus(null);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchMedicalRecords = async () => {
            try {
                const response = await fetch(`https://localhost:7206/api/medical-record-management/pets/${selectedPet.petId}/medical-records`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMedicalRecords(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching medical records:', error);
            }
        };

        fetchPetStatus();
        fetchMedicalRecords();
    }, [selectedPet.petId]);

    return (
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
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
                <p className='Pet-detail'>Age: {selectedPet.petAge}</p>
                <p className='Pet-detail'>Vaccination: {selectedPet.vaccinationHistory}</p>
                <p className='Pet-detail'>Gender: {selectedPet.isMale ? 'Male' : 'Female'}</p>
                <p className='Pet-detail'>Description: {selectedPet.description}</p>
            </TabPanel>
            <TabPanel value={value} index={1}>
                {isLoading ? (
                    <p>Loading...</p>
                ) : petStatus ? (
                    <>
                        <p className='Pet-status'>Admission Date: {petStatus.admissionDate}</p>
                        <p className='Pet-status'>Condition: {petStatus.petCurrentCondition}</p>
                        <p className='Pet-status'>Discharge Date: {petStatus.dischargeDate || 'N/A'}</p>
                        {/* Add more pet status details as needed */}
                    </>
                ) : (
                    <p>The pet is not hospitalized</p>
                )}
            </TabPanel>
            <TabPanel value={value} index={2}>
                {medicalRecords.length > 0 ? (
                    medicalRecords.map((record, index) => (
                        <Accordion key={record.medicalRecordId}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${index}-content`}
                                id={`panel${index}-header`}
                            >
                                <Typography>Date Created: {record.dateCreated}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Medical Record ID: {record.medicalRecordId}</Typography>
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
