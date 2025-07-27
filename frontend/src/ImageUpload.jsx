import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Container,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
} from "@mui/material";
import Clear from "@mui/icons-material/Clear";
import axios from "axios";

import image from "./bg.png";

export const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let confidence = 0;

  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      try {
        let res = await axios.post(import.meta.env.VITE_API_URL, formData);
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) return;
    setIsLoading(true);
    sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#be6a77", boxShadow: "none" }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
             Potato Disease Classification
          </Typography>
         
        </Toolbar>
      </AppBar>

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "93vh",
          mt: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Grid container justifyContent="center" spacing={2} sx={{ maxWidth: 600 }}>
          <Grid item xs={12}>
            <Card
              sx={{
                maxWidth: 400,
                height: 500,
                mx: "auto",
                backgroundColor: "transparent",
                boxShadow: 3,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 1,
              }}
            >
              {image && preview && (
                <CardActionArea>
                  <CardMedia
                    component="img"
                    image={preview}
                    alt="Potato Leaf"
                    sx={{ height: 400, objectFit: "contain" }}
                  />
                </CardActionArea>
              )}

              {!image && (
                <CardContent sx={{ textAlign: "center" }}>
                  <input
                    accept="image/*"
                    id="contained-button-file"
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => onSelectFile(e.target.files)}
                  />
                  <label htmlFor="contained-button-file">
                    <Button variant="contained" color="primary" component="span">
                      Upload Image
                    </Button>
                  </label>
                  <Typography sx={{ mt: 2 }}>
                    Click the button above to choose a potato leaf image
                  </Typography>
                </CardContent>
              )}

              {data && (
                <CardContent sx={{ width: "100%", mt: 2 }}>
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="results table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Label</TableCell>
                          <TableCell align="right">Confidence</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{data.class}</TableCell>
                          <TableCell align="right">{confidence}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              )}

              {isLoading && (
                <CardContent sx={{ textAlign: "center", mt: 2 }}>
                  <CircularProgress color="secondary" />
                  <Typography sx={{ mt: 1 }}>Processing</Typography>
                </CardContent>
              )}
            </Card>
          </Grid>

          {data && (
            <Grid item xs={12} sx={{ maxWidth: 400, mx: "auto" }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={clearData}
                startIcon={<Clear />}
              >
                Clear
              </Button>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};
