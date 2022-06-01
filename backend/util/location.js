require("dotenv").config();
const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

async function getCoordinatesForAddress(address) {
  console.log("getCoordinatesForAddress");
  // return {
  //     lat: 40.7484474,
  //     lng: -73.9871516
  // };

  let response;
  try {
    response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${API_KEY}`
    );
  } catch (error) {
    throw new HttpError(
      "Something went wrong, could not get coordinates for provided address."
    );
  }

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    return null;
  }
  
  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordinatesForAddress;
