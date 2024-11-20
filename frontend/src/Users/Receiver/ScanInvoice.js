import React, { useState, useRef } from 'react';
import { Button, Table, Tbody, Tr, Td, TableContainer, Thead, Th, Box, Flex, Image } from '@chakra-ui/react';

const ScanInvoice = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [extractedData, setExtractedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [captured, setCaptured] = useState(false); // Track if an image is captured
  const [scanned, setScanned] = useState(false); // Track if the scan button was clicked

  const handleCameraStart = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
  };

  // Capture the image from the video stream
  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      const imageUrl = canvas.toDataURL('image/png');
      setImageData(imageUrl); // Set the captured image to the state
      setCaptured(true); // Update captured state
    }
  };

  // Call OCR.space API to analyze the captured image
  const handleScan = async () => {
    if (imageData) {
      setLoading(true);
      const apiKey = 'YOUR_OCR_SPACE_API_KEY'; // Replace with your actual API key

      try {
        const response = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            apikey: apiKey,
            base64Image: imageData.split(',')[1], // Removing the data URL prefix
            language: 'eng', // You can specify other languages here as well
          }),
        });

        const result = await response.json();

        if (result && result.ParsedResults) {
          const parsedText = result.ParsedResults[0].ParsedText;
          const lines = parsedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

          // Assuming the OCR output contains product details in a structured format
          const productData = lines.map((line) => {
            const parts = line.split(' '); // Adjust this based on the format of the OCR output
            return {
              productId: parts[0], // Assuming first element is product code
              productName: parts.slice(1, -1).join(' '), // Product name could be multiple words
              quantity: parts[parts.length - 1], // Last element is quantity
            };
          });

          setExtractedData(productData);
          setScanned(true); // Update scanned state after scan
        }
      } catch (error) {
        console.error('Error scanning invoice:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Reset state to start capturing the image again
  const handleRecapture = () => {
    setCaptured(false);
    setImageData(null); // Clear captured image
    setExtractedData([]); // Clear extracted data
    setScanned(false); // Reset scanned state
    handleCameraStart(); // Restart the camera
  };

  return (
    <Box p={5}>
      <Flex direction="row" justify="space-between" align="center">
        {/* Left side: Camera or Captured Image */}
        <Box width="48%">
          {captured ? (
            // If imageData is set, show the captured image instead of camera
            <>
              <Image src={imageData} alt="Captured Invoice" width="100%" height="auto" />
              <Button onClick={handleRecapture} width="100%" mb={4}>Recapture</Button>
            </>
          ) : (
            // Show camera if imageData is not set
            <>
              <video ref={videoRef} width="100%" height="auto" style={{ marginBottom: '20px' }} />
              <Button onClick={handleCameraStart} width="100%" mb={4}>Start Camera</Button>
              <Button onClick={handleCapture} width="100%" mb={4}>Capture Image</Button>
            </>
          )}
          <Button onClick={handleScan} width="100%" isLoading={loading} disabled={!imageData}>
            Scan Invoice
          </Button>
        </Box>

        {/* Right side: Table (appears after scan) */}
        <Box width="48%">
          {scanned && extractedData.length > 0 && (
            <TableContainer>
              <Table variant="striped" colorScheme="teal">
                <Thead>
                  <Tr>
                    <Th>Product Code</Th>
                    <Th>Product Name</Th>
                    <Th>Quantity</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {extractedData.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.productId}</Td>
                      <Td>{item.productName}</Td>
                      <Td>{item.quantity}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Flex>

      {/* Hidden canvas to capture image from video */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Box>
  );
};

export default ScanInvoice;
