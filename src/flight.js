import React, { useEffect, useState } from 'react';
import './flight.css';
import 'react-datepicker/dist/react-datepicker.css';
import { faExchangeAlt, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import './DatePickerCustomStyles.css'; // Import your custom CSS for styling the date picker
import Roundtrip from './roundtrip';
import useFetchRoutes  from './useFetchRoutes';
import MultiCity from './multiCity';
import { useHistory } from 'react-router-dom';



function RouteRecommendation() {
  
  const [departureAirport, setDepartureAirport] = useState('');
  const [destinationAirport, setDestinationAirport] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [showButton,setShowButton]=useState('true');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [Placeholder,setPlaceholder]=useState(''); // Update the placeholder
  const { fetchRoutes,recommendedRoutes } = useFetchRoutes();
  // Store the day of the week


  const [tripType, setTripType] = useState(''); // Default to 'oneWay'
  const [showRoundtripComponent, setShowRoundtripComponent] = useState(false); // Add state for conditional rendering
  const[showMulticityComponent,setshowMulticityComponent]=useState('false')//multicity
  const [suggestions, setSuggestions] = useState([]);
const [selectedSuggestion, setSelectedSuggestion] = useState('');
const [departureAirportcode,setDepartureAirportCode]= useState('');
const [showSuggestions, setShowSuggestions] = useState(false);
const [departure, setDeparture] = useState('');
const[destinationCode,setDestinationCode]= useState('');
const [selectedOption, setSelectedOption] = useState('option1'); 
const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
const [autocompletePayload, setAutocompletePayload] = useState({
  from: '',
  to: '',
});



    //   const [recommendedRoutes, setRecommendedRoutes] = useState([]);

//   const handleRecommendRoutes = () => {
//     // Implement logic to fetch recommended routes based on departureAirport and destinationAirport.
//     // You can use an API like AviationStack to get flight route data.

//     // Example API call (replace with your API endpoint):
//     fetch(`https://api.example.com/routes?departure=${departureAirport}&destination=${destinationAirport}`)
//       .then((response) => response.json())
//       .then((data) => setRecommendedRoutes(data.routes))
//       .catch((error) => console.error(error));
//   };

 //switch response
  const handleSwitchAirport = () => {
    const temp = departureAirport;
    setDepartureAirport(destinationAirport);
    setDestinationAirport(temp);
  };
  //onmouseenter
  const handleInputMouseEnter = () => {
    let payload = null;
  
    if (tripType === 'oneWay') {
      payload = {
        routes: [
          {
            fromiata: departureAirportcode,
            toiata: destinationCode,
            daynumber: dayOfWeek,
          },
        ],
      };
    } else if (tripType === 'roundTrip') {
      payload = {
        routes: [
          {
            fromiata: departureAirportcode,
            toiata: destinationCode,
            daynumber: sessionStorage.getItem('startdate'),
          },
          {
            fromiata: destinationCode,
            toiata: departureAirportcode,
            daynumber: sessionStorage.getItem('enddate')
          },
        ],
      };
    } else if (tripType === 'multiCity') {
      payload = {
        routes: [
          {
            fromiata: departureAirportcode,
            toiata: destinationCode,
            daynumber: sessionStorage.getItem('startdate'),
          },
          {
            fromiata: departureAirportcode,
            toiata: departureAirportcode,
            daynumber: sessionStorage.getItem('enddate')
          },
          {
            fromiata: departureAirportcode,
            toiata: destinationCode,
            daynumber: sessionStorage.getItem('enddate')
          },
        ],
      };    }
  
    if (payload) {
      fetchRoutes(payload);
      setShowButton(false);
      setSearchPerformed(true);
    }
  };
  

const handleAutocomplete = (inputField,inputValue) => {
  

  const payload = {
    prefix:inputValue
  }


  
  
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
  // Set the selected suggestion in state
  
  // console.log("$$$$$$$$$$$--city--->",selectedSuggestion);
  setDepartureAirportCode(suggestion.code);

  setDepartureAirport(suggestion.city)
  
  
   setPlaceholder(suggestion.city)  // console.log("suggestion.code---->",departureAirportcode);

  // Update the input text with the selected suggestion
   // Assuming you want to set it in the "from" field

  // Hide the suggestions dropdown
};
const handleSelectChange = (event) => {
  const selectedValue = event.target.value;
  setSelectedOption(selectedValue);
};
const handleDestinationSuggestionClick = (suggestion) => {
  // Set the selected suggestion in state
  
  // console.log("$$$$$$$$$$$--city--->",selectedSuggestion);
  setDestinationCode(suggestion.code);
  setDestinationAirport(suggestion.city)
   setPlaceholder(suggestion.city)  // console.log("suggestion.code---->",departureAirportcode);

  // Update the input text with the selected suggestion
   // Assuming you want to set it in the "from" field

  // Hide the suggestions dropdown
  setShowDestinationSuggestions(false);
};
useEffect(() => {
  // This code will run whenever selectedSuggestion or departureAirportCode changes
  console.log("selectedSuggestion: ", selectedSuggestion);
  console.log("departureAirportCode: ", departureAirportcode);
  console.log("destinationair---->",destinationAirport);
  setShowDepartureSuggestions(false);
  //setShowDestinationSuggestions(false);

}
, [selectedSuggestion, departureAirportcode,destinationAirport]);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Extract the day of the week as an integer (0 for Sunday, 1 for Monday, etc.)
    const dayOfWeek = date.getDay();
    setDayOfWeek(dayOfWeek);
    // Now, you can use the 'dayOfWeek' variable as needed in your logic
    // console.log(`Selected day of the week: ${dayOfWeek}`);
    console.log(dayOfWeek)
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
      {/* List of trip types with radio buttons */}
      <div className="container">
      <div className="trip-type-container">
        
        <label className="trip-type-label">
          <input
            className="trip-type-input"
            type="radio"
            value="oneWay"
            checked={tripType === 'oneWay'}
            onChange={() => {
              setTripType('oneWay');
              setShowRoundtripComponent(false); // Hide the Roundtrip component
              setshowMulticityComponent(false);
            }}
          />
          One Way
        </label>
        <label className="trip-type-label">
          <input
            className="trip-type-input"
            type="radio"
            value="roundTrip"
            checked={tripType === 'roundTrip'}
            onChange={() => {setTripType('roundTrip')
            setshowMulticityComponent(false)
          setShowRoundtripComponent(true);}}
          
          />
          Round Trip
        </label>
        <label className="trip-type-label">
          <input
            className="trip-type-input"
            type="radio"
            value="multiCity"
            checked={tripType === 'multiCity'}
            onChange={() => {setTripType('multiCity')
          setShowRoundtripComponent(false)
          setshowMulticityComponent(true)}}
          />
          Multi City
        </label>
        <select className="class" value={selectedOption} onChange={handleSelectChange}>
        <option value="option1">Economy</option>
        <option value="option2">Business</option>
      </select>

      </div>
      {/* Input fields for From, To, and Date */}
      <div className="input-container" >
        <div className="input-box">
          <label htmlFor="departureAirport"></label>
          <input
            className="from"
            type="text"
            id="departureAirport"
            placeholder="Flying from"
            data-cy='departureAirport'
            name="departureAirport"
            value={departureAirport}
            onChange={(e) => {setDepartureAirport(e.target.value);
              handleAutocomplete('from',e.target.value);
            setShowDepartureSuggestions(true);}
            }
            // onBlur={()=>setShowDepartureSuggestions(false)}
            
          />
         {/* Suggestions dropdown */}
         {showDepartureSuggestions && suggestions.length > 0 && (
  <ul className="suggestion-dropdown">
    {suggestions.slice(0,8).map((suggestion, index) => (
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
            onClick={()=>setShowButton(true)}
            onChange={(e) => {setDestinationAirport(e.target.value);
              handleAutocomplete('to',e.target.value);
              setShowDestinationSuggestions(true)
              }}
              // onBlur={()=>setShowDestinationSuggestions(false)}
          />
                 {/* Suggestions dropdown */}
         {showDestinationSuggestions && suggestions.length > 0 && (
    <ul className="suggestion-dropdown-destination">
    {suggestions.slice(0,8).map((suggestion, index) => (
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

        <div className="load">
        {showButton && (
          <button className="search-button" onClick={handleInputMouseEnter}>
            Search Flights
          </button>
        )}
        </div>
{/* Add this table to display the recommended routes */}
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

{searchPerformed&&recommendedRoutes.length === 0 && (
  <p>No routes</p>
)}
</div>
          </div>
        
      

      {/* Conditional rendering for Roundtrip  and Multicity component */}
      {showRoundtripComponent && <Roundtrip />}

    
      
{/* Display the selected suggestion */}

{console.log(recommendedRoutes)}

    </div>
    
    </div>
  );
}
export default RouteRecommendation;






