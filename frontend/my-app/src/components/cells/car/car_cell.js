
import React, { useState, useEffect } from 'react';
import './car_cell.js'
import { Link } from 'react-router-dom';
import axios from 'axios';

const CarCell = ({ car, page, isAuctioned }) => {
  const [carDetails, setCarDetails] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [finishTime, setFinishTime] = useState('');

  useEffect(() => {
    // Fetch data from the database to check if the car is in the auction
    const fetchData = async () => {
      try {
        // Replace this with your actual fetch logic
        const response = await axios.get(`http://localhost:3001/auction/${car.license_plate}`);
        setCarDetails(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (isAuctioned) {
      console.log('I am auctioned')
      fetchData()
    }
  }, [car.license_plate]);

  const handleAddToAuction = async () => {
    console.log(car)
  };
  

  const generateReport = async (vehicleId) => {
    if (page === 'auction'){
      return
    }
    try {
      // Your API endpoint URL
      const apiUrl = `http://localhost:3001/reports/${vehicleId}`

      // Example data to send in the request body
      const requestData = {
        start_time: startTime,
        finish_time: finishTime,
      }

      // Make an Axios POST request
      const response = await axios.post(apiUrl, requestData, { responseType: 'arraybuffer' });

      // Log the response or handle it as needed
      const blob = new Blob([response.data], { type: 'application/pdf' });

    // Create a data URL from the Blob
    const url = URL.createObjectURL(blob);

    // Open the PDF in a new window
    window.open(url, '_blank');
  } catch (error) {
    console.error('Error generating report:', error);
  }
  }

  return (
    <div className="car-details">
      {page === 'auction' && isAuctioned && carDetails.photos && (
        <div style={{width:'300px'}}>
          {carDetails.photos.map((photo, index) => (
            <img key={index} src={photo.photo_url} style={{width:'300px'}} alt={`Photo ${index + 1}`} />
          ))}
        </div>)}
        {page != 'auction' && (
         <div className="car-image">
         <img src={car.vehicle_image} alt={`${car.make} ${car.model}`} />
       </div>)}
      <div className="car-info-container">
        <div className='car-name'>
          <div className="body-20-bold">{`${car.make} ${car.model} ${car.manufacture_year}`}</div>
        </div>
        <div className='car-container'>
          <div className="car-info">
            
            <div className="car-property">
              <div>
                <span className="label-14-bold">License Plate:</span>{' '}
                <span className="label-14">{car.license_plate}</span>
              </div>
              <div>
                <span className="label-14-bold">Make:</span>{' '}
                <span className="label-14">{car.make}</span>
              </div>
              <div>
                <span className="label-14-bold">Model:</span>{' '}
                <span className="label-14">{car.model}</span>
              </div>
              <div>
                <span className="label-14-bold">Manufacture Year:</span>{' '}
                <span className="label-14">{car.manufacture_year}</span>
              </div>
            
            </div>
           </div>
          <div className="car-info">
            <div className="car-property">
              {/* Display additional car properties here */}
              <div>
                <span className="label-14-bold">Fuel Volume:</span>{' '}
                <span className="label-14">{car.fuel_volume}</span>
              </div>
              <div>
                <span className="label-14-bold">Tank Volume:</span>{' '}
                <span className="label-14">{car.tank_volume}</span>
              </div>
              <div>
                <span className="label-14-bold">Mileage:</span>{' '}
                <span className="label-14">{car.mileage}</span>
              </div>
              <div>
                <span className="label-14-bold">Capacity:</span>{' '}
                <span className="label-14">{car.capacity} passengers</span>
              </div>
              <div>
                <span className="label-14-bold">Last fueled date:</span>{' '}
                <span className="label-14">{car.last_fueled_date}</span>
              </div>
              <div>
                <span className="label-14-bold">Last maintained date:</span>{' '}
                <span className="label-14">{car.last_maintained_date}</span>
              </div>
            </div>
         </div>
         {page === 'auction' && isAuctioned && carDetails.auctions &&(
          <div className='car-info'><div className="car-property">
          {/* Display additional car properties here */}
          <div>
            <span className="label-14-bold">Vehicle cost:</span>{' '}
            <span className="label-14">{carDetails.auctions.vehicle_cost}</span>
          </div>
          <div>
            <span className="label-14-bold">Description:</span>{' '}
            <span className="label-14">{carDetails.auctions.description}</span>
          </div>
          <div>
            <span className="label-14-bold">Contact:</span>{' '}
            <span className="label-14">+7 718 256 74 83</span>
          </div>
        </div></div>
         )}
         {page != 'auction' && (
          <div>
            {!isAuctioned ? (
              <>
                <Link to={`/admin/vehicles/auction/${car.license_plate}`}>
                  <button className="button-124">Add to Auction</button>
                </Link>
                <label>Start time:</label>
                <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                <label>Finish time:</label>
                <input type="datetime-local" value={finishTime} onChange={(e) => setFinishTime(e.target.value)} />
                <button className="button-124" onClick={() => generateReport(car.license_plate)}>
                  Generate report
                </button>
              </>
            ) : (
              <>
                <div className='body-20-bold' style={{paddingBottom:'15px'}}>Vehicle is in auction</div>
                <label>Start time:</label>
                <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                <label>Finish time:</label>
                <input type="datetime-local" value={finishTime} onChange={(e) => setFinishTime(e.target.value)} />
                <button className="button-124" onClick={() => generateReport(car.license_plate)}>
                  Generate report
                </button>
              </>
            )}
          </div>
         )}
        </div>
      </div>
    </div>
  );
};

export default CarCell;
