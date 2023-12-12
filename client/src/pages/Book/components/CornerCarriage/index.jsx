import classes from './style.module.scss';

const CornerCarriage = () => {
  const firstSeats = ['1A', '1C', '1F', '2A', '2C', '2F', '3A', '3C', '3F'];
  const businessSeats = [
    // eslint-disable-next-line prettier/prettier
    '4A', '4C', '4D', '4F', '5A', '5C', '5D', '5F', '6A', '6C', '6D', '6F', '7A', '7C', '7D', '7F', '8A', '8C', '8D', '8F',
    // eslint-disable-next-line prettier/prettier
    '9A', '9C', '9D', '9F', '10A', '10C', '10D', '10F'
  ];

  return (
    <div className={classes.cornerCarriage}>
      <div className={classes.firstSection}>
        <div className={classes.aisleFirst}>
          <div>AISLE</div>
          <div>AISLE</div>
        </div>
        {firstSeats.map((seat) => (
          <div key={seat} className={classes.seat}>
            <div className={classes.chair}>{seat}</div>
          </div>
        ))}
      </div>
      <hr />
      <div className={classes.businessSection}>
        <div className={classes.aisleBusiness}>
          <div>AISLE</div>
          <div>AISLE</div>
        </div>
        {businessSeats.map((seat) => (
          <div key={seat} className={classes.seat}>
            <div className={classes.chair}>{seat}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CornerCarriage;
