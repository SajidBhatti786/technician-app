import React, { useState } from "react";
import axios from "axios";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  Paper,
  Typography,
} from "@mui/material";

import data from "./data";
import ShowData from "./ShowData";

const AddressToCoordinatesConverter = () => {
  const [zipcode, setZipcode] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [error, setError] = useState("");

  const handleZipcodeChange = (e) => {
    setZipcode(e.target.value);
  };

  const convertAddressToCoordinates = async () => {
    if (zipcode.trim() === "") {
      setError("Please enter a ZIP code.");
      return;
    }

    try {
      const filteredData = await Promise.all(
        data.map(async (record) => {
          try {
            const addressResponse = await axios.get(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                record.zipCode
              )}.json`,
              {
                params: {
                  access_token:
                    "pk.eyJ1Ijoic2FqaWRiaGF0dGkiLCJhIjoiY2xwM3ByaGRtMDdvYzJxcW42OTZxZjZkOSJ9.Im5oL2o9QnjA3t2mYdgj8A",
                  limit: 1,
                },
              }
            );

            const zipcodeResponse = await axios.get(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                zipcode
              )}.json`,
              {
                params: {
                  access_token:
                    "pk.eyJ1Ijoic2FqaWRiaGF0dGkiLCJhIjoiY2xwM3ByaGRtMDdvYzJxcW42OTZxZjZkOSJ9.Im5oL2o9QnjA3t2mYdgj8A",
                  limit: 1,
                },
              }
            );

            if (
              addressResponse.data.features &&
              addressResponse.data.features.length > 0 &&
              zipcodeResponse.data.features &&
              zipcodeResponse.data.features.length > 0
            ) {
              const addressCoords =
                addressResponse.data.features[0].geometry.coordinates;
              const zipcodeCoords =
                zipcodeResponse.data.features[0].geometry.coordinates;

              const distance = calculateDistance(
                addressCoords[1],
                addressCoords[0],
                zipcodeCoords[1],
                zipcodeCoords[0]
              );

              if (distance <= 48280) {
                const distanceInMiles = (distance * 0.000621371).toFixed(3);

                // Append distance in miles to the record
                const recordWithDistance = { ...record, distanceInMiles };

                return recordWithDistance;
              }
            }
          } catch (error) {
            console.error("Error fetching coordinates:", error);
          }

          return null;
        })
      );

      const validFilteredData = filteredData.filter(
        (record) => record !== null
      );
      setFilteredRecords(validFilteredData);
      setError(validFilteredData.length === 0 ? "No records found." : "");
    } catch (error) {
      console.error("Error:", error);
      setError("Error fetching data. Please try again.");
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  return (
    <div>
      <h1>Search Technician Under 30 miles of your provided zipCode!</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          maxWidth: 400,
          margin: "0 auto",
          marginTop: 20,
        }}
      >
        <input
          type="text"
          placeholder="Enter ZIP code"
          value={zipcode}
          onChange={handleZipcodeChange}
          style={{
            padding: "10px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px",
            width: "70%",
          }}
        />
        <button
          onClick={convertAddressToCoordinates}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {filteredRecords.length > 0 ? (
        <ShowData filteredRecords={filteredRecords} />
      ) : (
        <Typography variant="body1">
          {error ? "Error occurred. Please try again." : "No records found."}
        </Typography>
      )}
    </div>
  );
};

export default AddressToCoordinatesConverter;
