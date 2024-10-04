// src/MapComponent.jsx

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';  // Import Leaflet's CSS

// Import Leaflet to fix marker icons
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {Star} from '@mui/icons-material'
import './mapcomponents.css'
import axios from 'axios'
import {format} from 'timeago.js'
import { set } from 'mongoose';
import Register from '../register/Register';
import Login from '../login/Login';

// Fix default marker icon issue in React-Leaflet
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapEvents({ onDoubleClick }) {
  useMapEvents({
    dblclick(e) {
      onDoubleClick(e.latlng); // Pass the latitude and longitude of the double-click
    }
  });
  return null; // This component does not render anything
}

function MapComponent() {
  const myStorage=window.localStorage;
  const [currentUser,setCurrentUser] = useState(myStorage.getItem("user"))
  const [pins, setPins] = useState([]);
  const [currentUsername, setCurrentUsername] = useState(currentUser);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState({});
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [star, setStar] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/pins/pin");
        console.log(res.data);
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  };

  const handleDoubleClick = (latlng) => {
    console.log("Double-clicked at:", latlng);
    const { lat, lng } = latlng;

    setNewPlace({
      lat,
      long: lng,
    }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("http://localhost:5001/api/pins/", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null)
  }


  return (
    <MapContainer className='map-container' center={[20.5937, 78.9629]} zoom={5} style={{ height: "1000px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapEvents onDoubleClick={handleDoubleClick} />

      <>
      {Array.isArray(pins) && pins.length > 0 ? (
  pins.map((p) => {
    const lat = Number(p.lat);
    const long = Number(p.long);
    
    
    if (isNaN(lat) || isNaN(long)) {
      console.error(`Invalid coordinates for pin with ID ${p._id}: ${lat} ${long}`);
      return null; 
    }

            return (
              <Marker
                position={[lat, long]}
                key={p._id}
                eventHandlers={{
                  click: () => handleMarkerClick(p._id),
                }}
              >
                {p._id === currentPlaceId && (
                  <Popup
                    closeButton={true}
                    closeOnClick={false}
                    anchor="left"
                    onClose={() => setCurrentPlaceId(null)}
                  >
                    <div className="cards">
                      <label>Place</label>
                      <h4 className="place">{p.title}</h4>
                      <label>Review</label>
                      <p className="desc">{p.desc}</p>
                      <label>Rating</label>
                      <div className="stars">
                        {Array(p.rating)
                          .fill(null)
                          .map((_, idx) => (
                            <Star className="star" key={idx} />
                          ))}
                      </div>
                      <label>Information</label>
                      <span className="username">
                        Created by <b>{p.username}</b>
                      </span>
                      <span className="date">{format(p.createAt)}</span>
                    </div>
                  </Popup>
                )}
              </Marker>
            );
          })
        ) : (
          <p>No pins available</p>
        )}

{newPlace && newPlace.lat && newPlace.long && (
  <Marker position={[newPlace.lat, newPlace.long]}>
    <Popup onClose={() => setNewPlace(null)}>
      <div>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            placeholder="Enter a title"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Description</label>
          <textarea
            placeholder="Say something about this place."
            onChange={(e) => setDesc(e.target.value)}
          />
          <label>Rating</label>
          <select onChange={(e) => setStar(e.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <button type="submit" className="submitButton">
            Add Pin
          </button>
        </form>
      </div>
    </Popup>
  </Marker>
)}
</>
     

      {currentUser ? (
        <button className='button logout' onClick={handleLogout}>Log out</button>
      ) :(
          <div className="buttons">
            <div className="button login" onClick={()=>setShowLogin(true)}>Login</div>
            <div className="button register" onClick={()=>setShowRegister(true)}>Register</div>
          </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}
         
    </MapContainer>
  );
}
export default MapComponent;
