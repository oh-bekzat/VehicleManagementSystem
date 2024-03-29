// AdminRoutes.js
import React, { useState, useEffect } from 'react';
import './AdminRoutes.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import AssignDriverModal from './AdminRoutesPopUp';

const AdminManagesRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [isAssignDriverModalOpen, setAssignDriverModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState('');

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/routes');
        setRoutes(response.data.routes);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users/drivers');
        setDrivers(response.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };
    
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/vehicles');
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
    fetchRoutes();
    fetchDrivers();
  }, []);

  const handleAssignRoute = (route) => {
    setSelectedRoute(route);
    setAssignDriverModalOpen(true);
  };

  const handleDriverSelect = (driverId) => {
    setSelectedDriverId(driverId);
  };
  const handleCarSelect = (carId) => {
    setSelectedCar(carId);
  };
  const handleAssignDriver = async() => {
    setAssignDriverModalOpen(false);
    try {
      // Check if selectedRoute is defined before using it
      if (selectedRoute) {
        // Your logic to assign driver to route
        const response = await axios.put(`http://localhost:3001/routes/assign/${selectedRoute}`, {
          admin_id: 1,
          driver_id: selectedDriverId,
          license_plate: selectedCar,
        });
  
        console.log('Assigning driver', selectedDriverId, 'to route', selectedRoute.route_id);
        console.log('Server response:', response.data);
  
        // Additional logic if needed after successful assignment
      } else {
        console.log('Assigning driver', selectedDriverId, 'to route', selectedRoute.route_id);
        console.error('Selected route is undefined.');
      }
  
      // Close the modal
      setAssignDriverModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error assigning driver:', error);
      // Handle error response or set an appropriate state to show an error message
    }
  };  

  const sortRoutes = (a, b) => {
    // Define the order of statuses: 'awaiting', 'assigned', 'started', 'finished'
    const statusOrder = ['awaiting', 'assigned', 'started', 'completed'];

    // Get the index of the status in the order array
    const statusIndexA = statusOrder.indexOf(a.status);
    const statusIndexB = statusOrder.indexOf(b.status);
    console.log(routes)

    // Compare based on the status index
    return statusIndexA - statusIndexB;
  };

  const sortedRoutes = [...routes].sort(sortRoutes);

  return (
    <div className="manage-routes-page">
      <h2>Manage Routes</h2>
      <table className="route-table">
        <thead>
          <tr>
            <th>Route ID</th>
            <th>Client ID</th>
            <th>Assigned Driver ID</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Start Time</th>
            <th>Finish Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedRoutes.map((route) => (
            <tr key={route.route_id}>
              <td>{route.route_id}</td>
              <td>{route.client_id}</td>
              <td>{route.driver_id}</td>
              <td>{route.start_point}</td>
              <td>{route.finish_point}</td>
              <td>{route.start_time}</td>
              <td>{route.finish_time}</td>
              <td>{route.status}</td>
              <td>
                {route.status === 'awaiting' && (
                    <button
                      className="assign-button"
                      onClick={() => handleAssignRoute(route.route_id)}
                    >
                      Assign Driver
                    </button>
                )}
                {route.status === 'assigned' && (
                  <div className='body-14'>
                    Waiting for a driver to confirm
                  </div>
                )}
                {route.status === 'started' && (
                  <div className='body-14'>
                    Waiting for a driver to finish
                  </div>
                )}
                {route.status === 'completed' && route.rate === null && (
                  <div className='body-14'>
                    Waiting for a client to rate
                  </div>
                )}
                {route.status === 'completed' && route.rate != null && (
                  <div className='body-14'>
                    Rating: {route.rate}
                  </div>
                )}
                {/* Add additional conditions for other status values */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Assign Driver Modal */}
      <AssignDriverModal
          isOpen={isAssignDriverModalOpen}
          onRequestClose={() => setAssignDriverModalOpen(false)}
          onDriverSelect={handleDriverSelect}
          drivers={drivers}
          onCarSelect={handleCarSelect}
          cars={cars}
          onAssignDriver={handleAssignDriver}
          selectedRoute={selectedRoute}
        />
      {isAssignDriverModalOpen && (
        <button onClick={handleAssignDriver}>Confirm Assign Driver</button>
      )}
    </div>
  );
};

export default AdminManagesRoutes;
