/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { Html5QrcodeScanner } from 'html5-qrcode';

import { createStructuredSelector } from 'reselect';
import { Autocomplete, Button, FormControl, MenuItem, Select, TextField } from '@mui/material';
import toast from 'react-hot-toast';
import classes from './style.module.scss';
import { getAllStations, setValidateResult, validateTicketOnArrival, validateTicketOnDeparture } from './actions';
import { selectStations, selectValidateResult } from './selectors';

const Gate = ({ stations, validateResult }) => {
  const dispatch = useDispatch();

  const [direction, setDirection] = useState('depart');
  const [station, setStation] = useState(null);
  const [isScan, setIsScan] = useState(false);
  const [isScannerRendering, setIsScannerRendering] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Use a ref for isScan
  const isScanRef = useRef(isScan);
  isScanRef.current = isScan;

  const defaultProps = {
    options: stations,
    getOptionLabel: (option) => option.name,
  };

  const handleSuccessValidate = () => {
    toast.success('Success validate QR');
  };

  const handleErrorValidate = (errorMsg) => {
    toast.error(errorMsg);
  };

  useEffect(() => {
    dispatch(getAllStations());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let scanner;

    const clearScanner = () => {
      if (scanner) {
        scanner.clear();
        setIsScannerRendering(false);
        setIsScan(false);
      }
    };

    if (isScan) {
      if (isScannerRendering) return;

      scanner = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 450,
          height: 450,
        },
        fps: 5,
        rememberLastUsedCamera: true,
      });

      const handleSuccess = (result) => {
        clearScanner();
        dispatch(setValidateResult(null));
        setScanResult(result);
      };

      const handleError = (error) => {
        console.warn(error);

        if (!isScanRef.current) {
          clearScanner();
        }
      };

      scanner.render(handleSuccess, handleError);
      setIsScannerRendering(true);
    } else {
      clearScanner();
    }

    return () => {
      clearScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScan]);

  useEffect(() => {
    if (direction && station) {
      setIsScan(true);
    } else {
      setIsScan(false);
    }
    setScanResult(null);
    dispatch(setValidateResult(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, station, setDirection, setStation]);

  useEffect(() => {
    if (isScan || !scanResult || !station) return;

    let jsonScan;
    try {
      jsonScan = JSON.parse(scanResult);
      if (!jsonScan.id || !jsonScan.secret) {
        throw Error('Invalid QR Ticket');
      }
    } catch {
      toast.error('Invalid QR Ticket');
      return;
    }

    const formattedInputs = {
      orderedSeatId: jsonScan.id,
      secret: jsonScan.secret,
    };
    if (direction === 'depart') {
      formattedInputs.departureStationId = station.id;
      dispatch(validateTicketOnDeparture(formattedInputs, handleSuccessValidate, handleErrorValidate));
    } else {
      formattedInputs.arrivalStationId = station.id;
      dispatch(validateTicketOnArrival(formattedInputs, handleSuccessValidate, handleErrorValidate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScan, scanResult]);

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <h1>Gate</h1>
        </header>
        <section>
          <div className={classes.row}>
            <div className={classes.input}>
              <label>Direction</label>
              <FormControl variant="standard">
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                >
                  <MenuItem value="depart">Departure</MenuItem>
                  <MenuItem value="arrive">Arrival</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className={classes.input}>
              <label>Station</label>
              <Autocomplete
                {...defaultProps}
                id="controlled-demo"
                value={station}
                onChange={(event, newValue) => {
                  setStation(newValue);
                }}
                renderInput={(params) => <TextField {...params} placeholder="Select station" variant="standard" />}
              />
            </div>
          </div>

          {isScan && (
            <div className={classes.rowReader}>
              <div id="reader" />
            </div>
          )}
        </section>

        {!isScan && station && scanResult && (
          <div className={classes.result}>
            {validateResult && (
              <div className={classes.validate}>
                {direction === 'depart' ? (
                  <div className={classes.message}>
                    Have a nice journey to {validateResult.Order.Schedule.arrivalStation.name}, {validateResult.name}
                  </div>
                ) : (
                  <div className={classes.message}>
                    Hope you had a safe journey from {validateResult.Order.Schedule.departureStation.name},{' '}
                    {validateResult.name}
                  </div>
                )}
              </div>
            )}
            <Button variant="contained" onClick={() => setIsScan(true)}>
              Scan Again
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

Gate.propTypes = {
  stations: PropTypes.array,
  validateResult: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  stations: selectStations,
  validateResult: selectValidateResult,
});

export default connect(mapStateToProps)(Gate);
