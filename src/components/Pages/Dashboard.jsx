

const Dashboard = () => {
  
  console.log('Hello there');
  return (
    <div>
      Hello you are in dashboard
      <h1>User Management</h1>
      <table>
        {/* <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.isAdmin ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={submitHandler()}>
                  {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                </button>
              </td>
            </tr>
          ))}
        </tbody> */}
      </table>
    </div>
  );
};

export default Dashboard;