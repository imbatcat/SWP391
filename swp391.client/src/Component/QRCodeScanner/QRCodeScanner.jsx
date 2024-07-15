import React from 'react';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle } from 'mdb-react-ui-kit';
import QrScanner from 'react-qr-scanner';

const QRCodeScannerModal = ({ scannerModal, toggleOpen, handleScan, handleError }) => {
    
    return (
        <MDBModal staticBackdrop tabIndex='-1' open={scannerModal} >
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Scan QR Code</MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <QrScanner
                            delay={300}
                            onError={handleError}
                            onScan={handleScan}
                            style={{ width: '100%' }}
                        />
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={toggleOpen}>Close Scanner</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
    );
};

export default QRCodeScannerModal;
