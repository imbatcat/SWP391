import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

const QRCodeScanner = (onScan) => {
    const [scanResult, setScanResult] = useState('');

    const handleScan = data => {
        if (data) {
            console.log(data);
           
            const realData = data.text;
            
            setScanResult(realData);
            onScan(realData);           
        }
    };

    const handleError = err => {
        console.error(err);
    };

    const previewStyle = {
        height: 240,
        width: 320,
    };

    return (
        <div>
            <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={previewStyle}
            />
            {scanResult && (
                <div>
                    <h3>Scanned QR Code:</h3>
                    <p>{scanResult}</p>
                </div>
            )}
        </div>
    );
};

export default QRCodeScanner;
