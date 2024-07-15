import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';

const VetSelectionTable = ({ vetList, formData, handleChange }) => {
    const [selectedVet, setSelectedVet] = useState(formData.veterinarianAccountId || '');

    const handleVetSelect = (vetAccountId) => {
        console.log(vetAccountId);
        setSelectedVet(vetAccountId);
        handleChange({ target: { name: 'veterinarianAccountId', value: vetAccountId } });
    };

    useEffect(() => {
        setSelectedVet(formData.veterinarianAccountId);
    }, [formData.veterinarianAccountId]);

    return (
        <MDBTable bordered>
            <MDBTableHead>
                <tr>
                    <th>Veterinarian Name</th>
                    <th>Experience</th>
                    <th>Department</th>
                    <th>Current Capacity</th>
                    <th>Select</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>
                {vetList.map((vet, index) => (
                    <tr key={index}>
                        <td>{vet.vetName}</td>
                        <td>{vet.experience}</td>
                        <td>{vet.department}</td>
                        <td>{vet.currentCapacity}</td>
                        <td>
                            <MDBBtn
                                type='button'
                                color={vet.currentCapacity === '6/6' ? 'tertiary' : (selectedVet === vet.vetId ? 'danger' : 'muted')}
                                onClick={() => handleVetSelect(vet.vetId)}
                                disabled={vet.currentCapacity === '6/6'}
                            >
                                {vet.currentCapacity === '6/6' ? 'Full' : (selectedVet === vet.vetId ? 'Selected' : 'Select')}
                            </MDBBtn>
                        </td>
                    </tr>
                ))}
            </MDBTableBody>
        </MDBTable>
    );
};

export default VetSelectionTable;
