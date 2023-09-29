import React, { useEffect, useState } from 'react';
import './flight.css';
import 'react-datepicker/dist/react-datepicker.css';
import { faExchangeAlt, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import './DatePickerCustomStyles.css'; // Import your custom CSS for styling the date picker
import useFetchRoutes from './useFetchRoutes';

function MultiCity() {
  const [departureAirport, setDepartureAirport] = useState('');
  const [destinationAirport, setDestinationAirport] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [showButton, setShowButton] = useState('true');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [Placeholder, setPlaceholder] = useState(''); // Update the placeholder
  const { fetchRoutes, recommendedRoutes } = useFetchRoutes();

  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [departureAirportcode, setDepartureAirportCode] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [destinationCode, setDestinationCode] = useState('');
  const [selectedOption, setSelectedOption] = useState('option1');
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [cities, setCities] = useState([{ from: '', to: '' }, { from: '', to: '' }]); // Initial two sets

  const handleSwitchAirport = () => {
    const temp = departureAirport;
    setDepartureAirport(destinationAirport);
    setDestinationAirport(temp);
  };

  const handleInputMouseEnter = () => {
    let payload = null;

    payload = {
      routes: [
        {
          fromiata: departureAirportcode,
          toiata: destinationCode,
          daynumber: dayOfWeek,
        },
      ],
    };

    if (payload) {
      fetchRoutes(payload);
      setShowButton(false);
      setSearchPerformed(true);
    }
  };

  const handleAutocomplete = (inputField, inputValue) => {
    const payload = {
      prefix: inputValue,
    };

    fetch('http://localhost:8000/search/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
      body: JSON.stringify(payload), // Convert the payload to JSON format
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Handle the autocompletion response data here
        console.log(data);
        const formattedSuggestions = data.map((suggestion) => ({
          city: suggestion.city,
          code: suggestion.code,
          country: suggestion.country,
        }));

        // Update the suggestions state with the received data
        setSuggestions(data);

        // Show the suggestions dropdown
        setShowSuggestions(true);
      })
      .catch((error) => {
        console.error(error);

        // Handle error or clear the suggestions state if needed
        setSuggestions([]);
        setShowSuggestions(false);
      });
  };

  const handleDepartureSuggestionClick = (suggestion) => {
    setDepartureAirportCode(suggestion.code);
    setDepartureAirport(suggestion.city);
    setPlaceholder(suggestion.city);
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };

  const handleDestinationSuggestionClick = (suggestion) => {
    setDestinationCode(suggestion.code);
    setDestinationAirport(suggestion.city);
    setPlaceholder(suggestion.city);
    setShowDestinationSuggestions(false);
  };

  useEffect(() => {
    console.log("selectedSuggestion: ", selectedSuggestion);
    console.log("departureAirportCode: ", departureAirportcode);
    console.log("destinationair---->", destinationAirport);
    setShowDepartureSuggestions(false);
  }, [selectedSuggestion, departureAirportcode, destinationAirport]);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleAddCity = () => {
    if (cities.length < 2) {
      // Ensure there are not more than 2 sets of "From" and "To" inputs
      setCities([...cities, { from: '', to: '' }]);
    }
  };

  const handleDeleteCity = (index) => {
    if (cities.length > 2) {
      // Ensure there are at least 2 sets of "From" and "To" inputs
      const updatedCities = cities.filter((_, i) => i !== index);
      setCities(updatedCities);
    }
  };

  const handleChange = (index, field, value) => {
    const updatedCities = cities.map((city, i) => {
      if (i === index) {
        return { ...city, [field]: value };
      } else if (i === index + 1 && field === 'to') {
        return { ...city, from: value };
      }
      return city;
    });
    if (field === 'from' && index < updatedCities.length - 1) {
      updatedCities[index + 1].to = value;
    }
    setCities(updatedCities);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const dayOfWeek = date.getDay();
    setDayOfWeek(dayOfWeek);
    setShowDatePicker(false);
  };

  const filteredRoutes =
    selectedOption === 'option1' // Assuming 'option1' corresponds to Economy
      ? recommendedRoutes.filter((route) => route.class_economy === 1)
      : selectedOption === 'option2' // Assuming 'option2' corresponds to Business
      ? recommendedRoutes.filter((route) => route.class_business === 1)
      : recommendedRoutes; // If no option is selected, show all routes

  return (
    <div className="page">
      <h2>Flight Routes</h2>
      <div className="container">
        <div className="input-container">
          <div className="input-box">
            <label htmlFor="departureAirport"></label>
            <input
              className="from"
              type="text"
              id="departureAirport"
              placeholder="Flying from"
              data-cy="departureAirport"
              name="departureAirport"
              value={departureAirport}
              onChange={(e) => {
                setDepartureAirport(e.target.value);
                handleAutocomplete('from', e.target.value);
                setShowDepartureSuggestions(true);
              }}
            />
            {showDepartureSuggestions && suggestions.length > 0 && (
              <ul className="suggestion-dropdown">
                {suggestions.slice(0, 8).map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleDepartureSuggestionClick(suggestion)}
                    style={{ listStyleType: 'none', borderBottom: '1px solid #ccc' }}
                  >{`${suggestion.country}, ${suggestion.city}, ${suggestion.code}`}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="input-box">
            <p className="switch" onClick={handleSwitchAirport}>
              <FontAwesomeIcon
                icon={faExchangeAlt}
                onClick={() => {
                  const temp = departureAirport;
                  setDepartureAirport(destinationAirport);
                  setDestinationAirport(temp);
                }}
              />
            </p>
            <label htmlFor="destinationAirport"></label>
            <input
              className="to"
              type="text"
              id="destinationAirport"
              placeholder="Destination"
              value={destinationAirport}
              onClick={() => setShowButton(true)}
              onChange={(e) => {
                setDestinationAirport(e.target.value);
                handleAutocomplete('to', e.target.value);
                setShowDestinationSuggestions(true);
              }}
            />
            {showDestinationSuggestions && suggestions.length > 0 && (
              <ul className="suggestion-dropdown-destination">
                {suggestions.slice(0, 8).map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleDestinationSuggestionClick(suggestion)}
                    style={{ listStyleType: 'none', borderBottom: '1px solid #ccc' }}
                  >{`${suggestion.country}, ${suggestion.city}, ${suggestion.code}`}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="calendar-button-container">
            <button className="calendar-button" onClick={toggleDatePicker}>
              <FontAwesomeIcon icon={faCalendar} />
            </button>
            {showDatePicker && (
              <div className="date-picker-container">
                {<DatePicker selected={selectedDate} onChange={handleDateChange} inline />}
              </div>
            )}
          </div>
        </div>
        
        {/* Add this section for managing the list of cities */}
        <div className="city-list">
          {cities.map((city, index) => (
            <div key={index} className="city-item">
              <input
                type="text"
                placeholder={`City ${index + 1} From`}
                value={city.from}
                onChange={(e) => handleChange(index, 'from', e.target.value)}
              />
              <input
                type="text"
                placeholder={`City ${index + 1} To`}
                value={city.to}
                onChange={(e) => handleChange(index, 'to', e.target.value)}
              />
              {index > 0 && (
                <button type="button" onClick={() => handleDeleteCity(index)}>
                  Delete
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddCity}>
            Add Flight
          </button>
        </div>

        <div className="load">
          {showButton && (
            <button className="search-button" onClick={handleInputMouseEnter}>
              Search Flights
            </button>
          )}
        </div>

        <div className="route-details">
          <div className="header"></div>
          <div className="ticketdiv">
            {filteredRoutes.map((route, index) => (
              <div key={index} className="ticket">
                <div className="card">
                  <div className="card-body">
                    <dl className="row">
                      {Object.entries(route).map(([key, value]) => {
                        if (key === 'class_economy' || key === 'class_business') {
                          const availability =
                            String(value) === '1' || String(value).toLowerCase() === 'yes'
                              ? 'Available'
                              : 'Not Available';
                          return (
                            <React.Fragment key={key}>
                              <dt className="col-sm-4">{key}</dt>
                              <dd className="col-sm-8">{availability}</dd>
                            </React.Fragment>
                          );
                        } else if (key === 'airlineIATA' || key === 'common_duration') {
                          return (
                            <React.Fragment key={key}>
                              <dt className="col-sm-4">{key}</dt>
                              <dd className="col-sm-8">{value}</dd>
                            </React.Fragment>
                          );
                        }
                        return null;
                      })}
                    </dl>
                  </div>
                </div>
              </div>
            ))}
            {searchPerformed && recommendedRoutes.length === 0 && <p>No routes</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiCity;
