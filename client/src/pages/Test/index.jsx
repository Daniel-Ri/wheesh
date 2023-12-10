import QRCode from 'qrcode';
import { Html5QrcodeScanner } from 'html5-qrcode';

import { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import classes from './style.module.scss';

const Test = () => {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scanResult, setScanResult] = useState(null);

  const generateQrCode = async () => {
    try {
      const response = await QRCode.toDataURL(text);
      setImageUrl(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
      rememberLastUsedCamera: true,
    });

    const handleSuccess = (result) => {
      scanner.clear();
      setScanResult(result);
    };

    const handleError = (error) => {
      console.warn(error);
    };

    scanner.render(handleSuccess, handleError);
  }, []);

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <h1>Test</h1>
        </header>

        <div className={classes.sections}>
          <div className={classes.section}>
            <TextField label="Enter Text Here" onChange={(e) => setText(e.target.value)} />
            <Button variant="contained" color="primary" onClick={generateQrCode}>
              Generate
            </Button>
            {imageUrl && (
              <a href={imageUrl} download>
                <img src={imageUrl} alt="" />
              </a>
            )}
          </div>
          <div className={classes.section}>
            {scanResult ? (
              <div>
                Success: <a href={`http://${scanResult}`}>{scanResult}</a>
              </div>
            ) : (
              <div id="reader" />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Test;
