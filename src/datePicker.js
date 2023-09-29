import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import './datepicker.css';

function CalendarButton() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="calendar-button-container">
      <button className="sidebar-button" onClick={toggleCalendar}>
        <span><FontAwesomeIcon icon={faCalendar} /></span>
        {selectedDate ? (
          <span className="selected-date">{selectedDate.toDateString()}</span>
        ) : (
          <span className="placeholder">Select a date</span>
        )}
      </button>

      {showCalendar && (
        <div className="calendar-container">
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>
      )}
    </div>
  );
}

export default CalendarButton;
