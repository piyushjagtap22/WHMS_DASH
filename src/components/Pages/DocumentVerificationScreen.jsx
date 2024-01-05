import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Button, Container, TextField, Typography } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSelector } from 'react-redux';

const DocumentVerificationScreen = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const token = useSelector((state) => state.auth.token);
  console.log(token);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Replace 'YOUR_API_ENDPOINT' with the actual endpoint for your uploadDocument API
      const response = await axios.post('http://localhost:3000/api/admin/uploadDocument', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log(response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error.response.data.message);
    }
  };

  return (
    
    <>
      <Container
        maxWidth="sm"
        style={{
          textAlign: "center",
          padding: "50px",
          backgroundColor: "black",
          color: "white",
          marginTop: "3rem",
          borderRadius: "1rem",
        }}
      >
        <Toaster toastOptions={{ duration: 4000 }} />
        <Typography
          variant="h3"
          fontWeight="bold"
          style={{ color: "#7CD6AB" }}
          marginBottom="20px"
        >
          Complete your profile Jehereeli
        </Typography>

        <form
          style={{ width: "70%", margin: "auto", textAlign: "left" }}
        >
          <TextField
            label="Organization*"
            variant="outlined"
            fullWidth
            style={{ margin: "15px 0" }}
            InputLabelProps={{ style: { color: "grey" } }}
            value={""}
          />

          <TextField
            label="Department"
            variant="outlined"
            fullWidth
            style={{ margin: "15px 0" }}
            InputLabelProps={{ style: { color: "grey" } }}
          />

          <Typography variant="subtitle2" style={{ margin: "15px 0", padding: "0px 0px" }}>
            Upload government ID proof
          </Typography>

          <div style={{ border: "1px solid grey", borderRadius: "5px", padding: "20px", marginBottom: "15px" }}>
            <div
              style={{ border: "2px dashed grey" , borderRadius: "5px", padding: "40px 20px", textAlign: "center", marginBottom: "25px", cursor: "pointer" }}
              
            >
              <CloudUploadIcon style={{ fontSize: "3rem", color: "#7CD6AB" }} />
              <Typography variant="body2" style={{ color: "grey" }}>
                Click or drag file to this area to upload
              </Typography>
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .pdf"
                style={{ display: ""}}
                onChange={handleFileChange}
              />
            </div>
            <Typography variant="body2" style={{ color: "grey", marginBottom: "40px" }}>
              Formats accepted are jpg, jpeg, png, and PDF
            </Typography>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                style={{
                  color: "#7CD6AB",
                  borderColor: "#7CD6AB",
                  margin: "0 10px",
                }}
              >
                Cancel
              </Button>
              <Button
                style={{
                  backgroundColor: "#7CD6AB",
                  color: "#121318",
                  margin: "0",
                }}
                onClick={handleUpload}
              >
                Upload
              </Button>
            </div>
          </div>
          <Button
                type="submit"
                style={{
                  backgroundColor: "#7CD6AB",
                  color: "#121318",
                  margin: "20px 0",
                  padding: "0.8rem",
                }}
                fullWidth
                onClick={handleUpload}
              >
                Submit
              </Button>
        </form>
      </Container>
    </>
  );
};

export default DocumentVerificationScreen;