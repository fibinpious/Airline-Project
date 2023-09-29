import { useState } from 'react';

const useFetchRoutes = () => {
  const [recommendedRoutes, setRecommendedRoutes] = useState([]);
  const [day, setDay] = useState('');
  const fetchRoutes = (payload) => {
    fetch('http://localhost:8000/fetch_routes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),

    })

    .then((response) => response.json())

    .then((data) => {
 setRecommendedRoutes(data[0].routes);
      

    })

    .catch((error) => console.error(error));

  };
return { fetchRoutes, recommendedRoutes, day };

};

export default useFetchRoutes;