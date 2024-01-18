import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import { useNavigate } from 'react-router-dom';
import {
  getDeviceIds
  // docById
} from '../../src/slices/adminApiSlice';
import { useDispatch, useSelector } from 'react-redux';

const app = new Realm.App({ id: 'application-0-vdlpx' });

const SensorPage = () => {
  const navigate = useNavigate();
  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );
  const [user, setUser] = useState();
  const [rowdata, setData] = useState([]);
  var devices = []
  // setDeviceList((prevDeviceList) => [...prevDeviceList, newDevice]);
  const [events, setEvents] = useState([]);
  const handleRowClick = (data) => {
    alert("Going on default page with",data)
    navigate(`/Default`, { state: {
      data:data
    } }); // Pass the row data as a prop
  }
   // Function to handle real-time updates
  const handleRealTimeUpdate = (updatedObject) => {
    setData((prevData) => {
      const updatedData = prevData.map((obj) => {
        console.log("Fata")
        if (obj._id === updatedObject._id) {
          // If the _id matches, update xSensor and ySensor values
         
          return {
            ...obj,
            xSensor: {
              ...obj.xSensor,
              value: updatedObject.xSensor.value,
            },
            ySensor: {
              ...obj.ySensor,
              value: updatedObject.ySensor.value,
            },
          };
        }
        return obj;
      });

      return updatedData;
    });
  };


  useEffect(() => {
    const login = async () => {
      try {
        console.log(setEvents.length)
        if(setEvents.length <= 1){
        // const token="eyJhbGciOiJSUzI1NiIsImtpZCI6IjdjZjdmODcyNzA5MWU0Yzc3YWE5OTVkYjYwNzQzYjdkZDJiYjcwYjUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQURNSU4iLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vd2htcy1hdXRoLTdlZDRiIiwiYXVkIjoid2htcy1hdXRoLTdlZDRiIiwiYXV0aF90aW1lIjoxNzA1NDI5ODQ2LCJ1c2VyX2lkIjoicUFDbFFEVU9ZdE15MjZ5VHRzMHlncXFBQzZvMSIsInN1YiI6InFBQ2xRRFVPWXRNeTI2eVR0czB5Z3FxQUM2bzEiLCJpYXQiOjE3MDU0Mjk4NDYsImV4cCI6MTcwNTQzMzQ0NiwiZW1haWwiOiJhd2FzdGhpLmFyeWEwNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfbnVtYmVyIjoiKzkxOTcxMzM3NjYxNiIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYXdhc3RoaS5hcnlhMDRAZ21haWwuY29tIl0sInBob25lIjpbIis5MTk3MTMzNzY2MTYiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Ou2WVNCjpgw36LYKOGKlf9VGpvlXaoxSfLQlXalsCKAzRG-uIn5xDzYaiNUKR3dZy9S66ZNEdGm36BQnRqm67wZjxbJukD-t-2fchPQPfttshEqO5_kxvKcq8NTYJzamEBysbGZca2cr2ajce_4e__EhVCv_Fn5JSUWUQf8YrfLsnYp41qkFBVD5oCf5SlVdgA0R8UCGzUokYTZSBRkleWrS4UysEjQhcIMaAEA8iaGaFdwTVO1nPVIoKy74r9ZBoaualbEn3eKfOhXLTK86BzdsGzX4krMSsTEfk5EjN47XFKov2fVhpceUTt0xnnMxYPemBQEJ1ggDtyw6wRADTg"
        
        const response = await getDeviceIds(token);
        if (response.status === 200) {
          console.log("Chalao");
          console.log("Device id data response",response.data)
          setEvents(response.data.deviceDocuments);
          const bunnySet = new Set(response.data.devices.flat());
          const bunnyList = [...bunnySet];
          // Now, bunnyList contains unique values from the nested arrays
          devices = bunnyList
        }
        }
        // setEvents(response.data.deviceDocuments)
        console.log("list of devices--> Outside",devices)
        const user = await app.logIn(Realm.Credentials.anonymous());
        setUser(user);
        const mongodb = app.currentUser.mongoClient('mongodb-atlas');
        // const collection = mongodb.db('test').collection('someCollection');
        // const collection = mongodb.db('test').collection('devic/es');
        const collection = mongodb.db('test').collection('devices');

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
        events.forEach((update) => handleRealTimeUpdate(update));
       
        const changeStream = collection.watch(pipeline);
        console.log(changeStream);
        for await (const change of changeStream) {
          console.log("this is change",change);
         
          console.log("list of devices--> --> Inside",devices)
         
          if (devices.includes(change?.fullDocument?.deviceId)) {
            console.log("has this value proccing to other things");
            setEvents((prevEvents) => {
              // Find the index of the changed document in the events array
              console.log("this is change",change?.fullDocument?.deviceId);
              console.log("this is previous",change?.fullDocument?.deviceId)
          
              
              const index = prevEvents.findIndex(
                
                (e) =>
                  e._id.toString() ===
                  change.documentKey._id.toString()
              );
  
              // If the document is found, update the specific cell content
              if (index !== -1) {
                const updatedEvents = [...prevEvents];
                console.log("first",updatedEvents[index])
                updatedEvents[index].heartSensor = change?.fullDocument.heartSensor;
                updatedEvents[index].xSensor = change?.fullDocument.xSensor;
                updatedEvents[index].ySensor = change?.fullDocument.ySensor;
                // updatedEvents[index] = change.fullDocument;
                console.log("format kharab ni hone diya",updatedEvents[index])
  
                return updatedEvents;
              } else {
                
                return [...prevEvents, change.fullDocument];
              }
            });
          }else{
            console.log("Data is Not Relevant");
          }
          
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
                 
                  <tr key={i} onClick={() => handleRowClick(e)}>
                   
                    {/* <td>{e.operationType}</td> */}
                    {/* <td>{e.documentKey._id.toString()}</td> */}
                    {/* <tr>{e.deviceId}</tr> */}
                    <td>{e?.deviceId}</td>
                    <td>{e?.initialUserData?.name || "------" }</td>
                    <td style={{ color: e?.heartSensor && parseInt(e.heartSensor, 10) > 100 ? 'red' : 'white' }} >{e?.heartSensor || "------"} bpm</td>
                    <td>{e?.xSensor || "------" } </td>
                    <td>{e?.ySensor || "------" } </td>

                    {/* <tr>{JSON.stringify(e)}</tr> */}

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

