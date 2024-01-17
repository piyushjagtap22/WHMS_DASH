import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import { useNavigate } from 'react-router-dom';

const app = new Realm.App({ id: 'sensor_realtimedb-ujgdc' });

const SensorPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [events, setEvents] = useState([]);
  const handleRowClick = (adminId,userId) => {
    alert("Going on default page with",adminId,userId)
    navigate(`/Default`, { state: {
      adminId:adminId,
      userId:userId
    } }); // Pass the row data as a prop
  }
  useEffect(() => {
    const login = async () => {
      try {
        const user = await app.logIn(Realm.Credentials.anonymous());
        setUser(user);
        const mongodb = app.currentUser.mongoClient('mongodb-atlas');
        // const collection = mongodb.db('test').collection('someCollection');
        const collection = mongodb.db('test').collection('devices');
        // Set up a change stream with a filter on the sensor_id field
        const pipeline = [
          {
            $match: {
              $or: [
                { 'fullDocument.xSensor.value': 'bunn' },
                { 'fullDocument.ySensor.value': 'bunn' },
                // Add more conditions as needed
              ],
            },
          },
        ];
       
        const changeStream = collection.watch(pipeline);
        console.log(changeStream);
        for await (const change of changeStream) {
          console.log(change);
          setEvents((prevEvents) => {
            // Find the index of the changed document in the events array
            const index = prevEvents.findIndex(
              (e) =>
                e.documentKey._id.toString() ===
                change.documentKey._id.toString()
            );

            // If the document is found, update the specific cell content
            if (index !== -1) {
              const updatedEvents = [...prevEvents];
              updatedEvents[index] = change;
              return updatedEvents;
            } else {
              return [...prevEvents, change];
            }
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    login();
  }, []);

  return (
    <div className='App'>
      {!!user && (
        <div className='App-header'>
          
          <div>
         
            <table>
              <thead>
                <tr>
                  <td>Device</td>
                  {/* <td>User Id</td> */}
                  <td>Admin Id</td>
                  <td>Heart Rate</td>
                  <td>ECG Sensor</td>
                  <td>BP Sensor</td>
                  
                </tr>
              </thead>
              <tbody>
                {events.map((e, i) => (
                 
                  <tr key={i} onClick={() => handleRowClick(e.fullDocument.currentAdminId,e.fullDocument.currentUserId)}>
                   
                    {/* <td>{e.operationType}</td> */}
                    {/* <td>{e.documentKey._id.toString()}</td> */}
                    <td>{e.fullDocument.deviceId}</td>
                    <td>{e.fullDocument.currentAdminId ? e.fullDocument.currentAdminId : "------" }</td>
                    <td>{e.fullDocument.heartSensor.value ?e.fullDocument.heartSensor.value:"------"} bpm</td>
                    <td>{e.fullDocument.xSensor.value ? e.fullDocument.xSensor.value : "------" } </td>
                    <td>{e.fullDocument.ySensor.value ? e.fullDocument.ySensor.value : "------" } </td>

                    {/* <tr>{JSON.stringify(e.fullDocument)}</tr> */}

                  </tr>
                    
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorPage;
