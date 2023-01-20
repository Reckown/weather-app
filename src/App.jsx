import './App.css';
import {useEffect, useState} from "react";

function App() {
  // The city we are currently displaying
  const [city, setCity] = useState("");
  // The weather we are currently displaying
  const [weather, setWeather] = useState("");
  // The hint we are currently displaying
  const [hintToDisplay, setHintToDisplay] = useState("");
  // What we have in the searchbar
  const [search, setSearch] = useState('');
  // Loading of the app,
  const [loading, setLoading] = useState(false);

  // Propose une tenue à l'utilisateur :
  const hint = [
    {
      condition : "sunny",
      cloth : "T-shirt & short"
    },
    {
      condition : "cloudy",
      cloth : "Petit pull-over"
    },
    {
      condition : "windy",
      cloth : "Mettre un coupe vent"
    },
    {
      condition : "rainy",
      cloth : "Pensez à votre parapluie "
    },
    {
      condition : "stormy",
      cloth : "Sortez couvert ! "
    },
  ]

  // Call to the geolocation API :
  const callApiGeoloc = async (lat, lon) => {
    const response = await fetch(`https://izudztw6jk.execute-api.eu-west-1.amazonaws.com/Prod/geo?lon=${lon}.aze&lat=${lat}`)
    if (!response.ok) {
      const message = "Erreur lors de l'appel à l'API Geoloc";
      alert(message);
      throw new Error(message);
    }
    const res = await response.json();
    setCity(res.city.toUpperCase());
    return res;
  }

  // Call to the weather API :
  const callWeatherApi = async (city) => {
    const response = await fetch(`https://izudztw6jk.execute-api.eu-west-1.amazonaws.com/Prod/weather/${city}`)
    if(!response.ok) {
      const message = "Erreur lors de l'appel à l'API Weather ";
      alert(message);
      throw new Error(message);
    }
    const res = await response.json();
    setWeather(res);
    setHintToDisplay(hint.find(element => element.condition === res.condition));
    return res;
  }

  // Get the current location of the user :
  const getGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          callApiGeoloc(position.coords.latitude, position.coords.longitude ).then((res) =>
              callWeatherApi(res.city));
              return {lat : position.coords.latitude, lon : position.coords.longitude}
        },
        (error) => {
          console.log(error);
        }
    );
  }

  const searchCity = () => {
    setLoading(true);
    callWeatherApi(search).then(
        (res) => (setCity(res.city.toUpperCase()))
    )
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    // We ask for the user location,
    // If we have access to his location we call the api to have infos
    getGeolocation();
    setLoading(false);
  }, []);

  return (
      <div id='main' className='p-5 d-flex justify-content-center'>
        <div className='w-25'>
          <div className="form-group mb-3">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
              </div>
              <input type="text"
                     className="form-control"
                     placeholder="Rechercher"
                     aria-label="Search"
                     aria-describedby="basic-addon1"
                     value={search}
                     onChange={e => setSearch(e.target.value)}
              >
              </input>
              <button className="btn btn-secondary" onClick={searchCity}>{loading ? <>Loading..</> : <>Search</>}</button>
            </div>
          </div>

          <div><b>{city}</b> • FRANCE</div>
          <hr></hr>

          <div>
            <h1 className='fw-bold'>{weather.temperature} ° C </h1>
            <h4 className='fw-light'>{weather.condition} &nbsp;&nbsp;
              {weather.condition === "stormy" ? <i className="fa-solid fa-poo-storm"></i> : ""}
              {weather.condition === "cloudy" ? <i className="fa-solid fa-cloud"></i> : ""}
              {weather.condition === "windy" ? <i className="fa-solid fa-wind"></i> : ""}
              {weather.condition === "rainy" ? <i className="fa-solid fa-cloud-rain"></i> : ""}
              {weather.condition === "sunny" ?  <i className="fa-solid fa-sun"></i> : ""}

            </h4>
          </div>
          <hr></hr>

          <div>{hintToDisplay.cloth}</div>
        </div>
      </div>
  );
}

export default App;
