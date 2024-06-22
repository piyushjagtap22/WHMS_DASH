import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import ApexGraphPrint from './ApexGraphPrint';
import Fab from '@material-ui/core/Fab';
import PrintIcon from '@material-ui/icons/Print';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const GraphByDate = () => {
  const { state: data } = useLocation();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const classes = useStyles();

  return (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      <div>
        <ApexGraphPrint
          name='shivanshu'
          data={data.data1}
          timestamp={data.data2}
          max={90}
          zoomEnabled={true}
          ref={componentRef}
        />
      </div>
        
      <div style={{ width: '77%', marginTop: '20px' }}>
        <Fab color="primary" aria-label="add" className={classes.fab} onClick={handlePrint}>
          <PrintIcon />
        </Fab>
      </div>
    </div>
  );
};

export default GraphByDate;
