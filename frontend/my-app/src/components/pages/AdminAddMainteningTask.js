import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const AdminAddMainteningTask = () => {
  const [licensePlate, setLicencePlate] = useState('');
  const [date, setDate] = useState('');
  const [maintainId, setMaintainId] = useState('');
  const [maintainers, setMaintainers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const admin_id = "1";

  const [description, setDescription] = useState('');

  useEffect(() => {
    // Fetch maintenance persons from the database
    axios.get('http://localhost:3001/users/maintenance')
      .then(response => setMaintainers(response.data))
      .catch(error => console.error('Error fetching maintainers:', error));

    // Fetch vehicles from the database
    axios.get('http://localhost:3001/vehicles')
      .then(response => setVehicles(response.data))
      .catch(error => console.error('Error fetching vehicles:', error));
  }, []);

  const handleAssign = () => {
    // Call the provided onAssignmaintainer function with the selected maintainer
    // onAssignmaintainer();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Retrieve user_id from localStorage
     // const date =  olddate.split('T')[0];

      // Create request data
      const requestData = {
        admin_id: admin_id,
        assignee_id: maintainId,
        vehicle_id: licensePlate,
        date: date,
        task_type: 'maintenance',
        description: description
      };

      console.log("request data", requestData)

      // Make a POST request
      const response = await axios.post('http://localhost:3001/tasks', requestData);

      console.log('Route request successful:', response.data);
      // Handle the response data as needed

      // Clear the form inputs after submission
      setLicencePlate('');
      setDate('');
      setMaintainId('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting route request:', error);
      // Handle the error as needed
    }
  };

  const handleMaintenSelect = (mId) => {
    setMaintainId(mId);
    console.log(mId);
  };

  return (
    <div className="request-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="licensePlate">License Plate:</label>
        <select
          id="licensePlate"
          name="licensePlate"
          value={licensePlate}
          onChange={(e) => setLicencePlate(e.target.value)}
          required
        >
          <option key="default" value="">
            Select a License Plate
          </option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
              {vehicle.license_plate}
            </option>
          ))}
        </select>

        <label htmlFor="date">Date  :</label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        /> 

        <label>Choose a maintenance person:</label>
        <select onChange={(e) => handleMaintenSelect(e.target.value)}>
          <option key="default" value="">
            Select a Maintenance person
          </option>
          {maintainers.map((maintainer) => (
            <option key={maintainer.user_id} value={maintainer.user_id}>
              {maintainer.firstname} {maintainer.lastname}
            </option>
          ))}
        </select>

        <label htmlFor="description">Description :</label>
        <input
          type="text"
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        /> 

        <button type="submit" onClick={handleAssign}>Assign</button>
      </form>
    </div>
  );
};

export default AdminAddMainteningTask;


