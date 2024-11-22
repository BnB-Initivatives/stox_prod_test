import React, { useState, useRef } from 'react';
import {
  Button,
  Box,
  Flex,
  Image,
  Input,
} from '@chakra-ui/react';
import axios from 'axios';

const ScanInvoice = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isUsingBackCamera, setIsUsingBackCamera] = useState(false); // Track camera type

  // Start camera with the selected device
  const handleCameraStart = async (useBackCamera = false) => {
    try {
      const constraints = {
        video: {
          facingMode: useBackCamera ? { exact: 'environment' } : 'user', // Toggle between front and back camera
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  // Capture image from the video stream
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or Canvas element not available.');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Unable to get canvas context.');
      return;
    }

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);

    const imageUrl = canvas.toDataURL('image/png');
    setImageData(imageUrl); // Set captured image data for further processing
    setScanned(false);
  };

  // Toggle between front and back cameras
  const toggleCamera = () => {
    setIsUsingBackCamera((prev) => !prev); // Toggle the camera type
    handleCameraStart(!isUsingBackCamera); // Restart the camera with the new type
  };

  return (
    <Box p={5}>
      <Flex direction="row" justify="space-between" align="center">
        <Box width="48%">
          {imageData ? (
            <>
              <Image src={imageData} alt="Captured Invoice" width="100%" height="auto" />
              <Button onClick={() => setImageData(null)} width="100%" mb={4}>Recapture</Button>
            </>
          ) : (
            <>
              <video ref={videoRef} width="100%" height="auto" style={{ marginBottom: '20px' }} />
              <Flex justify="space-between" mt={2}>
                <Button onClick={() => handleCameraStart(isUsingBackCamera)} width="48%">
                  Start Camera
                </Button>
                <Button onClick={toggleCamera} width="48%">
                  Use {isUsingBackCamera ? 'Front' : 'Back'} Camera
                </Button>
              </Flex>
              <Button onClick={handleCapture} width="100%" mb={4}>
                Capture Image
              </Button>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default ScanInvoice;
