import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
function ShowData({ filteredRecords }) {
  console.log(filteredRecords);
  const columns = [
    {
      field: "id",
      headerName: "Id",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "zipCode",
      headerName: "zipCode",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
    },
    {
      field: "distanceInMiles",
      headerName: "Distance In Miles",
      flex: 1,
    },
  ];
  return (
    <>
      {filteredRecords.length > 0 && (
        <DataGrid
          rows={filteredRecords}
          checkboxSelection
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          style={{
            marginTop: "2rem",
          }}
        />
      )}
    </>
  );
}

export default ShowData;
