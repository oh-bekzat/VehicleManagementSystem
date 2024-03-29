// AdminTasks.js
import React, { useState, useEffect } from 'react';
import './DriverHome.css';
import axios from 'axios';

import { Link } from 'react-router-dom';

const AdminTasks = ({}) => {

// user_id, maintenance_description, maintenance_date, maintenance_cost, images
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
    // Fetch data from the localhost:3001/get-routes endpoint
        const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/tasks');
            setAssignedTasks(response.data.allTasks);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };
    fetchData();
    }, []);

  // Function to handle task selection
  const handleTaskSelection = (task) => {
    setSelectedTask(task);
  };

  // Function to handle assigning the task
  const handleAssignTask = () => {
    // Implement your logic for assigning the task
    console.log('Task assigned:', selectedTask);
  };

  const sortedTasks = [...assignedTasks].sort((a, b) => {
    if (a.task_type === 'maintenance' && b.status !== 'fuelling') {
      return -1;
    } else if (b.status === 'fuelling' && a.status !== 'maintenance') {
      return 1;
    } else {
      return 0;
    }
  });

  const secondSortedTasks = [...sortedTasks].sort((a, b) => {
    if (a.status === 'assigned' && b.status !== 'assigned') {
      return -1;
    } else if (b.status === 'assigned' && a.status !== 'assigned') {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <div className="driver-home-page-button">
      <Link to="/admin/tasks/addmaintening">
        <button className="button-124" style={{margin: '20px', width: 'fit-content'}}>Add Maintenance Task</button>
      </Link>
      <Link to="/admin/tasks/addfueling">
        <button className="button-124" style={{margin: '20px', width: 'fit-content'}}>Add Fueling Task</button>
      </Link>
      <div className="driver-home-page">
      <div className="task-list">
        <ul>
          {secondSortedTasks.map((task) => (
            <li key={task.id} onClick={() => handleTaskSelection(task)}>
              <div>
                <div className='body-11-bold'>{task.task_type} task {task.task_id}</div>
              </div>
              <div>
                <span className='label-11-bold' style={{ marginLeft: '20px' }}>Type </span> <span className='label-11'>{task.task_type}</span>
              </div>
              <div>
                <span className='label-11-bold' style={{ marginLeft: '20px' }}>Date: </span> <span className='label-11'>{task.date.split('T')[0]}</span>
              </div>
              <div>
                <span className='label-11-bold' style={{ marginLeft: '20px' }}>Assigned Person ID: </span> <span className='label-11'>{task.assignee_id}</span>
            </div>
            <div>
                <span className='label-11-bold' style={{ marginLeft: '20px' }}>Status: </span> <span className='label-11'>{task.status}</span>
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
            <div className='body-24-bold'>{selectedTask.task_type} task {selectedTask.task_id}</div>
          </div>
            <div>
                <span className='body-14-bold'>Date: </span> <span className='body-14'>{selectedTask.date.split('T')[0]}</span>
            </div>
            <div>
                <span className='body-14-bold'>Time: </span> <span className='body-14'>{selectedTask.date.split('T')[1].split('.')[0]}</span>
            </div>
            <div>
                <span className='body-14-bold'>Vehicle: </span> <span className='body-14'>{selectedTask.vehicle_id}</span>
            </div>
            
            <div>
                <span className='body-14-bold'>Status: </span> <span className='body-14'>{selectedTask.status}</span>
            </div>
            <div>
                <span className='body-14-bold'>Assigned Person: </span> <span className='body-14'>{selectedTask.assignee_id}</span>
            </div>
            <div>
                <span className='body-14-bold'>Description: </span> <span className='body-14'>{selectedTask.description}</span>
            </div>
            {selectedTask.status === 'awaiting' && (
        <button onClick={handleAssignTask}>Assign</button>
      )}
          </>
        ) : (
          <div className='body-24'>Select a route to view details.</div>
        )}
      </div>
    </div>
    </div>
  );
};

export default AdminTasks;
