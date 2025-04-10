import React, { useContext } from "react";
import { Box, Card, CardContent, Typography, Button, Avatar } from "@mui/material";
import { MSTStoreContext } from "mst/store";
import { observer } from "mobx-react";
 // Using a shirt icon from Material-UI

 const TrademarkCard = ({ trademark }) => {
    return (
      <div
        style={{
          width: "300px",
          margin: "16px",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "white",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
           
          }}
        >
          <Avatar
                    src={require("/src/assets/avtar.png" )}// Placeholder image, replace with actual
                    variant="square"
                    sx={{ width: 200, height: 200, borderRadius: 2 }}
                  />
        </div>
  
        {/* Status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        
          }}
        >
          <span
            style={{
              color: "red",
              fontSize: "1.5rem",
              lineHeight: 0,
              marginRight: "8px",
            }}
          >
            •
          </span>
          <span
            style={{
              color: "red",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            {trademark.status} on {trademark.registrationDate}
          </span>
        </div>
  
        {/* Details */}
        <div
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          {trademark.mark}
        </div>
        <div
          style={{
            fontSize: "0.875rem",
            color: "gray",
            marginBottom: "8px",
          }}
        >
          {trademark.owner}
        </div>
        <div
          style={{
            fontSize: "0.875rem",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          {trademark.serial} - {trademark.date}
        </div>
  
        {/* Class/Description */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          
          <span style={{ fontWeight: "bold" }}>
            {trademark.classCodes.join(" ")}
          </span>
        </div>
        <div
          style={{
            fontSize: "0.875rem",
            color: "gray",
          }}
        >
          {trademark.classDescription.slice(0,40)}
        </div>
  
        {/* View Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px",
            marginTop: "16px",
          }}
        >
          <button
            style={{
              border: "1px solid blue",
              color: "blue",
              backgroundColor: "transparent",
              padding: "8px 16px",
              borderRadius: "4px",
              width: "80%",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            View
          </button>
        </div>
      </div>
    );
  };

const TrademarkGrid = observer(() => {
  const { applicationStore } = useContext(MSTStoreContext);
  const { searchDetailsStore } = applicationStore;
  const { hits } = searchDetailsStore;

  const trademarks = hits.map((hit, index) => ({
    id: index + 1,
    serial: hit.source.registration_number || "N/A",
    date: new Date(hit.source.filing_date * 1000).toLocaleDateString("en-US"),
    registrationDate: new Date(
      hit.source.registration_date * 1000
    ).toLocaleDateString("en-US"),
    mark: hit.source.mark_identification || "Unknown",
    owner: hit.source.current_owner || "Unknown",
    classCodes: hit.source.class_codes || [],
    classDescription:
      hit.source.mark_description_description?.join(", ") || "N/A",
    status:
      hit.source.status_type.charAt(0).toUpperCase() +
      hit.source.status_type.slice(1),
    markImage: hit.source.mark_image || null, // Add a field for the logo image if available
  }));

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: 2,
        backgroundColor: "#f5f5f5",
      }}
    >
      {trademarks.map((trademark) => (
        <TrademarkCard key={trademark.id} trademark={trademark} />
      ))}
    </Box>
  );
});

export default TrademarkGrid;