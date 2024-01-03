import { Button, Container, TextField, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSelector } from 'react-redux';

const DocumentVerificationScreen = () => {

  const token = useSelector((state) => state.auth.token);
  console.log(token);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:3000/api/admin/uploadDocument', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully');
        // Add any additional logic or state updates upon successful upload
      } else {
        console.error('Error uploading file:', response.statusText);
        // Handle error cases
      }
    } catch (error) {
      console.error('Error uploading file:', error.message);
      // Handle error cases
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
          Complete your profile
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
              onClick={handleUploadClick}
            >
              <CloudUploadIcon style={{ fontSize: "3rem", color: "#7CD6AB" }} />
              <Typography variant="body2" style={{ color: "grey" }}>
                Click or drag file to this area to upload
              </Typography>
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .pdf"
                ref={fileInputRef}
                style={{ display: "none" }}
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
                type="submit"
                style={{
                  backgroundColor: "#7CD6AB",
                  color: "#121318",
                  margin: "0",
                }}
                onClick={handleFileChange}
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
              >
                Submit
              </Button>
        </form>
      </Container>
    </>
  );
};

export default DocumentVerificationScreen;
