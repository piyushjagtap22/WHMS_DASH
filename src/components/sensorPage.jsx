// // import React, { useState, useEffect } from 'react';
// // import * as Realm from 'realm-web';

// // const app = new Realm.App({ id: 'sensor_realtimedb-ujgdc' });

// // const sensorPage = () => {
// //   // Set state variables
// //   const [user, setUser] = useState();
// //   const [events, setEvents] = useState([]); // This useEffect hook will run only once when the page is loaded

// //   useEffect(() => {
// //     const login = async () => {
// //       // Authenticate anonymously
// //       const user = await app.logIn(Realm.Credentials.anonymous());
// //       setUser(user); // Connect to the database

// //       const mongodb = app.currentUser.mongoClient('mongodb-atlas');
// //       const collection = mongodb.db('test').collection('someCollection'); // Everytime a change happens in the stream, add it to the list of events

// //       for await (const change of collection.watch()) {
// //         setEvents((events) => [...events, change]);
// //       }
// //     };
// //     login();
// //   }, []);

// //   // Return the JSX that will generate HTML for the page
// //   return (
// //     <div className='App'>
// //       Sensor Data
// //       {!!user && (
// //         <div className='App-header'>
// //                    <h1>Connected as user ${user.id}</h1>
// //
// //           <div>
// //                        <p>Latest events:</p>
// //
// //             <table>
// //
// //               <thead>
// //
// //                 <tr>
// //                   <td>Operation</td>
// //                   <td>Document Key</td>
// //                   <td>Full Document</td>
// //                 </tr>
// //
// //               </thead>
// //
// //               <tbody>
// //
// //                 {/* {events.map((e, i) => (
// //                   <tr key={i}>
// //                     <td>{e.operationType}</td>
// //                     <td>{e.documentKey._id.toString()}</td>
// //                     <td>{JSON.stringify(e.fullDocument)}</td>
// //                   </tr>
// //                 ))} */}
// //                 <tr key='someKey'>
// //                   <td>Document Key</td>
// //                   <td>Document key id to string</td>
// //                   {events.map((e, i) => (
// //                     <td>{JSON.stringify(e.fullDocument)}</td> // Here i want change
// //                   ))}
// //                 </tr>
// //
// //               </tbody>
// //
// //             </table>
// //
// //           </div>
// //
// //         </div>
// //       )}
// //
// //     </div>
// //   );
// // };

// // export default sensorPage;

// import React, { useState, useEffect } from 'react';
// import * as Realm from 'realm-web';

// const app = new Realm.App({ id: 'sensor_realtimedb-ujgdc' });

// const SensorPage = () => {
//   const [user, setUser] = useState();
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     const login = async () => {
//       try {
//         const user = await app.logIn(Realm.Credentials.anonymous());
//         setUser(user);

//         const mongodb = app.currentUser.mongoClient('mongodb-atlas');
//         const collection = mongodb.db('test').collection('someCollection');

//         for await (const change of collection.watch()) {
//           setEvents((prevEvents) => {
//             // Find the index of the changed document in the events array
//             const index = prevEvents.findIndex(
//               (e) =>
//                 e.documentKey._id.toString() ===
//                 change.documentKey._id.toString()
//             );

//             // If the document is found, update the specific cell content
//             if (index !== -1) {
//               const updatedEvents = [...prevEvents];
//               updatedEvents[index] = change;
//               return updatedEvents;
//             } else {
//               return [...prevEvents, change];
//             }
//           });
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };

//     login();
//   }, []);

//   return (
//     <div className='App'>
//       Sensor Data
//       {!!user && (
//         <div className='App-header'>
//           <h1>Connected as user {user.id}</h1>
//           <div>
//             <p>Latest events:</p>
//             <table>
//               <thead>
//                 <tr>
//                   <td>Operation</td>
//                   <td>Document Key</td>
//                   <td>Full Document</td>
//                 </tr>
//               </thead>
//               <tbody>
//                 {events.map((e, i) => (
//                   <tr key={i}>
//                     <td>{e.operationType}</td>
//                     <td>{e.documentKey._id.toString()}</td>
//                     <td>{JSON.stringify(e.fullDocument)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SensorPage;
import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';

const app = new Realm.App({ id: 'sensor_realtimedb-ujgdc' });

const SensorPage = () => {
  const [user, setUser] = useState();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const login = async () => {
      try {
        const user = await app.logIn(Realm.Credentials.anonymous());
        setUser(user);

        const mongodb = app.currentUser.mongoClient('mongodb-atlas');
        const collection = mongodb.db('test').collection('someCollection');

        // Set up a change stream with a filter on the sensor_id field
        const pipeline = [
          {
            $match: {
              'fullDocument.sensor_id': '233', // Change 'sensor_id' to the actual field name
            },
          },
        ];
        const x = [
          {
            $match: {
              operationType: {
                $in: ['update'],
              },
              'fullDocument.sensor_id': '233',
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
      Sensor Data
      {!!user && (
        <div className='App-header'>
          <h1>Connected as user {user.id}</h1>
          <div>
            <p>Latest events:</p>
            <table>
              <thead>
                <tr>
                  <td>Operation</td>
                  <td>Document Key</td>
                  <td>Full Document</td>
                </tr>
              </thead>
              <tbody>
                {events.map((e, i) => (
                  <tr key={i}>
                    <td>{e.operationType}</td>
                    <td>{e.documentKey._id.toString()}</td>
                    <td>{JSON.stringify(e.fullDocument)}</td>
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
