import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [id, setId] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch employees from the API
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/employees');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Add a new employee
  const handleSave = async (e) => {
    e.preventDefault();
    let error = '';

    if (firstName === '') error += 'First name is required\n';
    if (lastName === '') error += 'Last name is required\n';
    if (age <= 0) error += 'Age is required\n';

    if (error) {
      alert(error);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, age }),
      });

      if (response.ok) {
        fetchEmployees();
        handleClear();
      } else {
        alert('Failed to save employee');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  // Edit an existing employee
  const handleEdit = (id) => {
    const employee = data.find((item) => item.id === id);
    if (employee) {
      setIsUpdate(true);
      setId(id);
      setFirstName(employee.firstName);
      setLastName(employee.lastName);
      setAge(employee.age);
    }
  };

  // Update an employee
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, age }),
      });

      if (response.ok) {
        fetchEmployees();
        handleClear();
      } else {
        alert('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  // Delete an employee
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this item?')) {
      try {
        const response = await fetch(`http://localhost:5000/employees/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchEmployees();
        } else {
          alert('Failed to delete employee');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  // Clear the form
  const handleClear = () => {
    setIsUpdate(false);
    setId('');
    setFirstName('');
    setLastName('');
    setAge('');
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px', padding: '10px' }}>
        <div>
          <label>First Name:</label>
          <input
            value={firstName}
            type="text"
            placeholder="Enter First Name"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            value={lastName}
            type="text"
            placeholder="Enter Last Name"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            value={age}
            type="text"
            placeholder="Enter Your Age"
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div>
          {!isUpdate ? (
            <button onClick={handleSave}>Save</button>
          ) : (
            <button onClick={handleUpdate}>Update</button>
          )}
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>

      <div className="container flex">
        <h3>React CRUD</h3>
        <table>
          <thead>
            <tr>
              <td>Sr No</td>
              <td>ID</td>
              <td>First Name</td>
              <td>Last Name</td>
              <td>Age</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.id}</td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.age}</td>
                <td>
                  <button onClick={() => handleEdit(item.id)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
