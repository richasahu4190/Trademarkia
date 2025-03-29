import React, { useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Avatar, Tooltip } from "@mui/material";
import { Sync, MoreHoriz } from "@mui/icons-material";
import { MSTStoreContext } from "mst/store";
import { observer } from "mobx-react";

const columns = [
  {
    field: "mark",
    headerName: "Mark",
    headerAlign: "center",
    flex: 1.5,
    renderCell: (params) => (
      <div className="flex justify-center items-center">
        <Avatar
          src="/src/assets/avtar.png" // Placeholder image, replace with actual
          variant="square"
          sx={{ width: 200, height: 300, borderRadius: 2 }}
        />
      </div>
    ),
  },
  {
    field: "details",
    headerName: "Details",
    headerAlign: "left",
    flex: 1,
    renderCell: (params) => (
      <div className="w-full h-full flex flex-col py-1 justify-between">
        <div>
          <div className="font-semibold">{params.row.mark}</div>
          <div className="text-gray-500">{params.row.owner}</div>
        </div>
        <div>
          <div className="font-semibold">{params.row.serial}</div>
          <div className="text-gray-500">{params.row.date}</div>
        </div>
      </div>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    headerAlign: "center",
    flex: 1,
    renderCell: (params) => (
      <div className="w-full h-full flex flex-col justify-between items-center p-2">
        <div className="flex flex-col items-center">
          <div className="text-[#41B65C] font-semibold text-[1rem]">
            ● Live / Registered
          </div>
          <div className="text-gray-500">on {params.row.registrationDate}</div>
        </div>
        <div className="flex font-semibold">
          <Sync fontSize="small" sx={{ mr: 0.5, color: "#EC4A4A" }} />{" "}
          {params.row.expiryDate}
        </div>
      </div>
    ),
  },
  {
    field: "classDescription",
    headerName: "Class/Description",
    flex: 2,
    headerAlign: "left",
    renderCell: (params) => (
      <div className="w-full h-full py-4 flex flex-col justify-between">
        <p className="whitespace-pre-wrap">{params.row.classDescription}</p>
        <Box
          sx={{ display: "flex", alignItems: "center", mt: 1 }}
          className="flex gap-x-2 font-semibold"
        >
          {params.row.classCodes.slice(0, 3).map((code, index) => (
            <Tooltip
              key={index}
              title={`Class ${code}`}
              className="flex flex-row justify-center items-center text-xs "
            >
              <img src={require("assets/flask.png")} className="text-xs" />
              <p>Class {code}</p>
            </Tooltip>
          ))}

          {params.row.classCodes.length > 3 && (
            <Tooltip
              title={params.row.classCodes
                .slice(3)
                .map((code) => `Class ${code}`)
                .join(", ")}
            >
              <MoreHoriz
                fontSize="small"
                className="bg-[#E7E6E6] rounded-full p-1 w-14 h-14"
              />
            </Tooltip>
          )}
        </Box>
      </div>
    ),
  },
];

const TrademarkTable = observer(() => {
  const { applicationStore } = useContext(MSTStoreContext);
  const { searchDetailsStore } = applicationStore;
  const { hits } = searchDetailsStore;

  const rows = hits.map((hit, index) => ({
    id: index + 1,
    serial: hit.source.registration_number || "N/A",
    date: new Date(hit.source.filing_date * 1000).toLocaleDateString("en-US"),
    registrationDate: new Date(
      hit.source.registration_date * 1000
    ).toLocaleDateString("en-US"),
    expiryDate: new Date(hit.source.renewal_date * 1000).toLocaleDateString(
      "en-US"
    ),
    mark: hit.source.mark_identification || "Unknown",
    owner: hit.source.current_owner || "Unknown",
    classCodes: hit.source.class_codes || [],
    classDescription:
      hit.source.mark_description_description?.join(", ").slice(0, 60) || "N/A",
  }));

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        backgroundColor: "white",
        fontFamily: "gilroy",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        disableSelectionOnClick
        rowHeight={140}
        sx={{
          border: "none",
          borderRadius: "10rem",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#fff",
            fontWeight: "bold",
            fontFamily: "gilroy",
          },
          "& .MuiDataGrid-row": {
            minHeight: "120px !important",
            borderBottom: "none",
            fontWeight: 500,
            fontFamily: "gilroy",
          },
          "& .MuiDataGrid-cell": {
            padding: "16px",
            justifyContent: "center",
            borderBottom: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            display: "none",
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
        }}
      />
    </Box>
  );
});

export default TrademarkTable;
