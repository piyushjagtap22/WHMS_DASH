import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import ApexGraph from './ApexGraph';

const GraphByDate = () => {
    const { state: data } = useLocation();

    console.log("graphbydate", data);
  return (
    <div>
      <ApexGraph
            name="shivanshu"
            data={data.data1}
            timestamp={data.data2}
            max={90}
            zoomEnabled={true}
          />
    </div>
  )
}

export default GraphByDate
