import React, { useState, useEffect } from 'react';
import './FuelingHistory.css';
import axios from 'axios';

const MaintenHistory = ({maintenance_id}) => {
  // const [assignedTasks, setAssignedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const maintenanceId = localStorage.getItem("maintenance_id");


  const [assignedTasks, setAssignedTasks] = useState([
    { id: 1, title: 'Maintenance Task 1', details: 'Details for Task 1', vehicleId: "A125FH", maintenance_date : '11.02.2023', maintenance_cost:"12000 kzt", maintenance_point:'СТО PRO' },
    { id: 2, title: 'Maintenance Task 2', details: 'Details for Task 2', vehicleId: "S776JKN", maintenance_date : '21.11.2023', maintenance_cost:"7500 kzt", maintenance_point:'CTO 777'}
  ]);

  // useEffect(() => {
  //   // Fetch data from the localhost:3001/get-routes endpoint
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:3001/fuelling/${fuelingId}`);
  //       console.log(response.data);
  //       setAssignedTasks(response.data.routes);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // Function to handle task selection
  const handleTaskSelection = (task) => {
    setSelectedTask(task);
  };

  return (
    <div className="fueling-history">
      <div className="task-list">
        <ul>
          {Array.isArray(assignedTasks) && assignedTasks.map((task) => (
            <li key={task.id} onClick={() => handleTaskSelection(task)}>
              <div>
                <div className='body-20-bold'>Maintenance Task {task.fuelingId}</div>
              </div>
              <div>
                <span className='label-11-bold' style={{ marginLeft: '20px' }}>Licence Plate: </span> <span className='label-11'>{task.vehicleId}</span>
              </div>
              <div>
              <span className='label-11-bold' style={{ marginLeft: '20px' }}>Maintenance Date: </span> <span className='label-11'>{task.maintenance_date}</span>
              </div>
              <div>
              <span className='label-11-bold' style={{ marginLeft: '20px' }}>Maintenance Cost: </span> <span className='label-11'>{task.maintenance_cost}</span>
              </div>
              <div>
              <span className='label-11-bold' style={{ marginLeft: '20px' }}>Maintenance Point: </span> <span className='label-11'>{task.maintenance_point}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Section - Detailed Information */}
      <div className="task-details">
        {selectedTask ? (
            <>
          <div>
            <div className='body-24-bold'>Maintenance Task {selectedTask.fuelingId}</div>
          </div>
            <div>
                <span className='body-14-bold'>Licence Plate: </span> <span className='body-14'>{selectedTask.vehicleId}</span>
            </div>
            <div>
                <span className='body-14-bold'>Maintenance Date:  </span> <span className='body-14'>{selectedTask.maintenance_date}</span>
            </div>
            <div>
                <span className='body-14-bold'>Maintenance Cost: </span> <span className='body-14'>{selectedTask.maintenance_cost}</span>
            </div>
            <div>
                <span className='body-14-bold'>Maintenance Point: </span> <span className='body-14'>{selectedTask.maintenance_point}</span>
            </div>
          </>
        ) : (
          <div className='body-24'>Select a maintenance task to view details.</div>
        )}
      </div>
    </div>
  );
};

export default MaintenHistory