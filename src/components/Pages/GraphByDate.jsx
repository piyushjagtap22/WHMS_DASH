import React, { useEffect ,useRef } from 'react'
import { useLocation } from 'react-router-dom';
// import ApexGraph from './ApexGraph';
import { useReactToPrint } from 'react-to-print';
import ApexGraphPrint from './ApexGraphPrint';

const GraphByDate = () => {
    const { state: data } = useLocation();
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

    console.log("graphbydate", data);
  return (
    <div>
      <ApexGraphPrint
            name="shivanshu"
            data={data.data1}
            timestamp={data.data2}
            max={90}
            zoomEnabled={true}
            ref={componentRef}
          />
           <button onClick={handlePrint}>Print this out!</button>
    </div>
  )
}

export default GraphByDate
