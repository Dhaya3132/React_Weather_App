import './App.css'
import { useEffect, useState } from 'react';
import SearchIcon from './assets/search.png'
import RainIcon from './assets/rain.png';
import Humidity from './assets/humidity.png';
import Wind from './assets/wind.png';

import clearIcon from './assets/clear.png';
import cloudIcon from './assets/clouds.png'
import drizzleIcon from './assets/drizzle.png'
import rainIcon from './assets/rain.png';
import snowIcon from './assets/snow.png';

const WeatherDetails = ({ icons, temp, city, country, lat, long, humidity, wind }) => {
  return (
    <>
      <div className='Weatherimage'>
        <img src={icons} alt="WeatherIcon" />
      </div>
      <div className='temp'>{temp}C</div>
      <div className='Location'>{city}</div>
      <div className='Country'>{country}</div>
      <div className='cord'>
        <div>
          <span className='lat'>Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='long'>Longitude</span>
          <span>{long}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={Humidity} alt="Humidity" />
          <div className='data'>
            <div className='humidity-percent'>{humidity}%</div>
            <div>Humidity</div>
          </div>
        </div>

        <div className='element'>
          <img src={Wind} alt="wind" />
          <div className='data'>
            <div className='wind-percent'>{wind} km/h</div>
            <div>Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
}


function App() {

  const [text, setText] = useState('London');

  const [icons, setIcons] = useState(RainIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState('London');
  const [country, setCountry] = useState('GB');
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [wind, setWind] = useState(0);
  const [humidity, setHumidity] = useState(0);

  const [errors, seterror] = useState();

  const [loading, setloading] = useState(false);
  const [cityNotFound, setCityNotFount] = useState(false);

  const weatherIconsobj = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon
  }


  const search = async () => {
    setloading(true);

    let Url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=f957da4ecc2e9e6f16151391120c0fcd&units=Metric`;
    try {
      let response = await fetch(Url);
      let response_data = await response.json();
      if (response_data.cod === "404") {
        console.log('City Not found');
        setCityNotFount(true);
        setloading(false);
        return;
      }

      setHumidity(response_data.main.humidity);
      setWind(response_data.wind.speed);
      setTemp(Math.floor(response_data.main.temp));
      setCity(response_data.name);
      setCountry(response_data.sys.country);
      setLat(response_data.coord.lat);
      setLong(response_data.coord.lon);
      const weathercode = response_data.weather[0].icon;
      setIcons(weatherIconsobj[weathercode] || clearIcon);
      setCityNotFount(false);

      console.log(response_data);
    }
    catch (error) {
      console.log("An error occured", error.message);
      seterror('failed to fetch data');
    }
    finally {
      setloading(false);
    }
  }

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDowns = (e) => {
    console.log('Enter');
    if (e.key === "Enter") {
      search();
    }
  }

  useEffect(() => {
    search();
  }, [])
  return (
    <>
      <div className="container">
        {/* input container */}
        <div className="input-container">
          <input type="text" placeholder='Search City' value={text} onChange={handleCity} onKeyDown={handleKeyDowns} className='cityInput' />
          <div className='search-btn' onClick={() => search()}>
            <img src={SearchIcon} alt="SearchIcon" />
          </div>
        </div>

        {loading && <div className='Loading_Message'>Loading...</div>}
        {errors && <div className='error_message'>{errors}</div>}
        {cityNotFound && <div className='city_not_fount'>City Not Found</div>}

        {!loading && !cityNotFound && <WeatherDetails icons={icons} temp={temp} city={city} country={country} lat={lat} long={long}
          humidity={humidity} wind={wind}
        />
        }

      </div>
    </>
  )
}
export default App
