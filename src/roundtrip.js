import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Roundtrip.css';
import { useEffect } from 'react';
// import useRoundTrip from './useRoundTrip';
function Roundtrip() {
  const [startDate,setStartDate] = useState(null);
  const [endDate,setEndDate] = useState(null);
  // const { fetchRoundRoutes,recommendedRoutes} = useRoundTrip();

  
  const [dayOfWeek, setDayOfWeek] = useState(null); // Store the day of the week
  // useEffect(() => {
  //   // This code will run when the component mounts
  //   window.location.reload(); // Refresh the page
  // }, []);
 
  
   
  const handleStartDateChange = (date) => {
    // Extract the day of the week as an integer (0-6)
    const dayOfWeek = date.getDay();
    setStartDate(dayOfWeek);
    setDayOfWeek(dayOfWeek);
    sessionStorage.setItem('startdate',dayOfWeek);
    // Now, you can use the 'dayOfWeek' variable as needed in your logic
    // console.log(`Selected day of the week: ${dayOfWeek}`);
    console.log(dayOfWeek)
  };
  
  const handleEndDateChange = (date) => {
    // Extract the day of the week as an integer (0-6)
    const dayOfWeek2 = date.getDay();
    setEndDate(date);
    setDayOfWeek(dayOfWeek);
    sessionStorage.setItem('enddate',dayOfWeek2)
    // Now, you can use the 'dayOfWeek' variable as needed in your logic
    // console.log(`Selected day of the week: ${dayOfWeek}`);
    console.log(dayOfWeek2)
  };
  return (

    <div className="date-picker-container">
     <div className="date-picker-wrapper">

      <div >
        
        <DatePicker className="fromdate"
        placeholderText="Enter starting date"
        selected={startDate} onChange={handleStartDateChange} />
      </div>
      <div >
        
        <DatePicker className="todate"
        placeholderText="Enter return date"
          selected={endDate} onChange={handleEndDateChange} />
      </div>
      </div>
    </div>
  );
}
export default Roundtrip;
