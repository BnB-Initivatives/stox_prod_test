import React, { useState, useRef } from 'react';
import {
  Button,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Thead,
  Th,
  Box,
  Flex,
  Image,
  Input,
  useBreakpointValue,
} from '@chakra-ui/react';
import axios from 'axios';

const OCR_API_URL = 'https://api.ocr.space/parse/image'; // OCR.space API URL
const API_KEY = 'K82628486988957'; // Replace with your OCR.space API key

const ScanInvoice = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [extractedData, setExtractedData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [editedData, setEditedData] = useState([]); // Hold edited data
  const [submitLoading, setSubmitLoading] = useState(false); // For the submit button loading
  const [isFrontCamera, setIsFrontCamera] = useState(true); // Front/back camera toggle
  const cameraRef = useRef(null);
  const API_URL = "http://localhost:8000/invoices/";

  // Responsive values
  const flexDirection = useBreakpointValue({ base: 'column', md: 'row' });
  const boxWidth = useBreakpointValue({ base: '100%', md: '48%' });
  const videoHeight = useBreakpointValue({ base: '200px', md: '300px' });
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const tableFontSize = useBreakpointValue({ base: 'sm', md: 'md' });

  

  // Start camera
  const handleCameraStart = () => {
    const constraints = {
      video: {
        facingMode: isFrontCamera ? 'user' : 'environment',
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
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

  // Capture image from the video stream
  const handleCapture = async () => {

    if (cameraRef.current) {
      const image = await cameraRef.current.takePhoto();
      setImageData(image);
    }
    
    if (!videoRef.current) {
      console.error('Video element not available.');
      return;
    }

    if (!canvasRef.current) {
      console.error('Canvas element not available.');
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
  
  // Function to parse OCR output
  const parseOcrOutput = (parsedText) => {
    const lines = parsedText.split('\n').map((line) => line.trim()).filter((line) => line);
    const descriptionStart = lines.indexOf('DESCRIPTION');
    const idStart = lines.indexOf('ID');
    const qtStart = lines.indexOf('QT.');

    if (descriptionStart === -1 || idStart === -1 || qtStart === -1) {
      console.error('Missing one or more headers (DESCRIPTION, ID, QT.)');
      return [];
    }

    const descriptions = lines.slice(descriptionStart + 1, idStart);
    const ids = lines.slice(idStart + 1, qtStart);
    const quantities = lines.slice(qtStart + 1);

    const data = [];
    const maxLength = Math.max(descriptions.length, ids.length, quantities.length);

    for (let i = 0; i < maxLength; i++) {
      data.push({
        description: descriptions[i] || '',
        id: ids[i] || '',
        quantity: quantities[i] || '0',
      });
    }

    return data;
  };

  // Handle the scanning process
  const scanInvoice = async (imageData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('apikey', API_KEY);
      formData.append('base64Image', imageData);
      formData.append('ocrEngine', '2');

      const response = await axios.post(OCR_API_URL, formData);
      const result = response.data;

      if (result.IsErroredOnProcessing) {
        setErrorMessage('Error processing the image.');
        return;
      }

      const parsedText = result.ParsedResults[0].ParsedText;
      const parsedData = parseOcrOutput(parsedText);
      setExtractedData(parsedData);
      setEditedData(parsedData); // Initialize edited data
    } catch (error) {
      console.error('Error scanning invoice:', error);
      setErrorMessage('Error during scanning. Please try again.');
    } finally {
      setLoading(false);
      setScanned(true);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  // Handle input change for editable cells
  const handleInputChange = (index, field, value) => {
    const updatedData = [...editedData];
    updatedData[index][field] = value;
    setEditedData(updatedData);
  };

  // Save changes made in edit mode
  const saveChanges = () => {
    setExtractedData(editedData);
    setIsEditing(false);
  };

  // Calculate total quantity
  const getTotalItems = () => {
    return editedData.length; // Number of rows (items) in the table
  };

  // Reset the scanning state and start over
  const handleRecapture = () => {
    setImageData(null);
    setExtractedData([]);
    setScanned(false);
    setErrorMessage(null);
    setIsEditing(false);
    setEditedData([]);
    handleCameraStart(); // Restart the camera
  };
    // Toggle camera mode
    const handleToggleCamera = () => {
      setIsFrontCamera((prev) => !prev);
      handleCameraStart();
    };
  // Submit the data to backend
  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const date = new Date();
      const payload = {
        invoice_number: `INV_${date.getTime()}`,
        vendor_name: 'Vendor 1', // Replace with actual vendor name
        scanned_by: 1, // Replace with actual scanned by user ID
        scanned_invoice_items: editedData.map((item) => ({
          item_code: item.id,
          quantity: parseInt(item.quantity, 10) || 0,
        })),
      };

      console.log("Payload being sent:", payload);
      console.log(`${API_URL}`);
      const response = await axios.post(`${API_URL}`, payload);

      console.log("Response from backend:", response);

      if (response.status === 201) { // Assuming 201 Created is the success status
        alert('Invoice submitted successfully!');
        // Optionally, reset the form after successful submission
        handleRecapture();
      } else {
        console.error("Unexpected response:", response);
        alert('Error submitting the invoice.');
      }
    } catch (error) {
      console.error("Error during invoice submission:", error.response?.data || error.message);
      alert('Error during submission.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box p={5}>
     <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
     <Box width={{ base: '100%', md: '48%' }} mb={{ base: 5, md: 0 }}>
          {imageData ? (
            <>
              <Image src={imageData} alt="Captured Invoice" width="100%" height="auto" mb={4} borderRadius="md" />
              <Button onClick={handleRecapture} width="100%" mb={4} size={buttonSize}>
                Recapture
              </Button>
            </>
          ) : (
            <>
              <video
                ref={videoRef}
                width="100%"
                height={videoHeight}
                style={{ marginBottom: '20px', borderRadius: 'md', objectFit: 'cover' }}
              />
              <Flex justify="space-between" mb={4}>
                <Button onClick={handleCameraStart} width="48%" size={buttonSize}>
                  Start Camera
                </Button>
                <Button onClick={handleCapture} width="48%" size={buttonSize}>
                  Capture Image
                </Button>              
                </Flex>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </>
          )}
          <Button onClick={handleToggleCamera} width="100%" mb={4}>
            Toggle Camera ({isFrontCamera ? 'Front' : 'Back'})
          </Button>
          <Button
            onClick={() => scanInvoice(imageData)}
            width="100%"
            isLoading={loading}
            disabled={!imageData}
            size={buttonSize}
            colorScheme="teal"
          >
            Scan Invoice
          </Button>
        </Box>

        {/* Right Section: Extracted Data and Actions */}
        <Box width={boxWidth}>
          {errorMessage && <Box color="red.500" mb={4}>{errorMessage}</Box>}

          {extractedData.length > 0 && (
            <Box>
              <TableContainer overflowX="auto">
                <Table variant="striped" colorScheme="teal" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Description</Th>
                      <Th>ID</Th>
                      <Th>Quantity</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {editedData.map((row, index) => (
                      <Tr key={index}>
                        <Td fontSize={tableFontSize}>
                          {isEditing ? (
                            <Input
                              value={row.description}
                              onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                              size="sm"
                            />
                          ) : (
                            row.description
                          )}
                        </Td>
                        <Td fontSize={tableFontSize}>
                          {isEditing ? (
                            <Input
                              value={row.id}
                              onChange={(e) => handleInputChange(index, 'id', e.target.value)}
                              size="sm"
                            />
                          ) : (
                            row.id
                          )}
                        </Td>
                        <Td fontSize={tableFontSize}>
                          {isEditing ? (
                            <Input
                              value={row.quantity}
                              onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                              size="sm"
                            />
                          ) : (
                            row.quantity
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              {isEditing ? (
                <Flex justify="space-between" mt={4}>
                  <Button onClick={saveChanges} size={buttonSize}>
                    Save Changes
                  </Button>
                  <Button onClick={toggleEdit} size={buttonSize}>
                    Cancel
                  </Button>
                </Flex>
              ) : (
                <Button onClick={toggleEdit} mt={4} size={buttonSize}>
                  Edit
                </Button>
              )}
              <Box mt={4}>
                <Button
                  onClick={handleSubmit}
                  isLoading={submitLoading}
                  loadingText="Submitting"
                  width="100%"
                  colorScheme="blue"
                  size={buttonSize}
                >
                  Submit Invoice
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default ScanInvoice;
