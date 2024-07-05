import React, { useState } from 'react';
import QRCodeScanner from '../../Component/QRCodeScanner/QRCodeScanner';

const AppointmentQRCode = () => {
    const [appointmentId, setAppointmentId] = useState('');
    const [qrCodeImage, setQrCodeImage] = useState('');
    const [error, setError] = useState('');
    const [scanning, setScanning] = useState(false);

    const fetchQRCode = async () => {
        try {
            const response = await fetch(`https://localhost:7206/api/appointment-management/qr-code?appointmentId=${appointmentId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'text/plain',
                },
            });
            if (response.ok) {
                const data = await response.text();
                setQrCodeImage(data);
                setError('');
            } else {
                setError('Failed to fetch QR Code. Please check the Appointment ID and try again.');
                setQrCodeImage('');
            }
        } catch (error) {
            setError('Error fetching QR Code. Please try again later.');
            setQrCodeImage('');
        }
    };

    const handleScan = data => {
        if (data) {
            console.log(data)
            setAppointmentId(data);
            setScanning(false);
        }
    };

    return (
        <div>
            <h1>Fetch QR Code</h1>
            <input
                type="text"
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                placeholder="Enter Appointment ID"
            />
            <button onClick={fetchQRCode}>Fetch QR Code</button>
            <button onClick={() => setScanning(!scanning)}>
                {scanning ? 'Stop Scanning' : 'Scan QR Code'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {qrCodeImage && (
                <div>
                    <h2>QR Code</h2>
                    <img src={qrCodeImage} alt="QR Code" />
                </div>
            )}
            {scanning && <QRCodeScanner onScan={handleScan}/>}
        </div>
    );
};

export default AppointmentQRCode;
