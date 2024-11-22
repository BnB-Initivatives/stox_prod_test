import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Select,
  useColorModeValue,
  Icon,
  Avatar,
} from '@chakra-ui/react';
import { AiOutlineCamera } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import Card from 'components/Card/Card.js';
import logo from "../../assets/img/Logo.png";

export default function Dashboard() {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [vendors, setVendors] = useState([]); // State to store vendors
  const videoRef = useRef(null);
  const currentDate = new Date().toLocaleDateString();
  const textColor = useColorModeValue('white', 'gray.200');

  const history = useHistory();

  const invoiceNumberRegex = /^[a-zA-Z0-9\s]*$/;

  const handleInvoiceNumberChange = (e) => {
    const value = e.target.value;
    if (invoiceNumberRegex.test(value)) {
      setInvoiceNumber(value);
    }
  };

  const isCameraButtonDisabled = !invoiceNumberRegex.test(invoiceNumber);

  useEffect(() => {
    // Fetch vendors from the backend API
    const fetchVendors = async () => {
      try {
        const response = await fetch('http://localhost:8000/vendors/');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setVendors(data); // Update the state with the fetched vendors
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchVendors();
  }, []); // Empty dependency array to run only on mount

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      h="100vh"
      w="100%"
      pt={{ base: '50px', md: '0' }}
      position="relative"
    >
      {/* Profile Icon at Top Right */}
      <Box position="absolute" top="10px" right="20px" cursor="pointer">
        <Avatar
          size="sm"
          onClick={() => history.push('./profile')} // Navigate to Profile Page
        />
      </Box>

      {/* Logo at the top center */}
      <Box
		position="absolute"
		top="0px"
		left="50%"
		transform="translateX(-50%)"
		zIndex="1"
		color="white" // Adjust text color as needed
		>
		<Text fontSize="lg" fontWeight="bold">
			Welcome To StoX!
		</Text>
		</Box>
      {/* Logo at Center */}
      <Box
        position="absolute"
        top="0px"
        left="5%"
        transform="translateX(-50%)"
        zIndex="1"
      >
        <img
          src={logo} // Replace with your logo URL
          alt="Logo"
          style={{
            maxWidth: '30px',
            height: '30px',
          }}
        />
      </Box>

      {/* Centered Card */}
      <Card
        p="20px"
        borderRadius="20px"
        width={{ base: '90%', md: '60%', lg: '40%' }}
        textAlign="center"
        background="none"
        boxShadow="none"
      >
        {/* Current Date Display */}
        <Flex direction="column" alignItems="center" mb="16px">
          <Text fontSize="xl" fontWeight="bold" color={textColor} mb="8px">
            Current Date
          </Text>
          <Text fontSize="lg" color={textColor}>
            {currentDate}
          </Text>
        </Flex>

        {/* Dropdown Combo Box */}
        <Flex direction="column" mb="16px">
  <Text fontSize="md" fontWeight="bold" color={textColor} mb="8px">
    Select a vendor
  </Text>
  <Select
    placeholder="Choose option"
    bg="transparent"
    color={textColor}
    zIndex="2"
    border="1px solid"
    borderColor={textColor}
    _focus={{ borderColor: 'teal.500' }}
    sx={{
      // Styles for the dropdown list
      '& option': {
        backgroundColor: 'white', // Dropdown items background
        color: 'black',           // Dropdown items text color
      },
      '& option:checked': {
        backgroundColor: 'white', // Selected item background color
        color: 'black',           // Selected item text color
      }
    }}
  >
    {vendors.map((vendor) => (
      <option key={vendor.vendor_id} value={vendor.vendor_id}>
        {vendor.name}
      </option>
    ))}
  </Select>
</Flex>



        {/* Invoice Number Field */}
        <Flex direction="column" mb="16px">
          <Text fontSize="md" fontWeight="bold" color={textColor} mb="8px">
            Invoice Number
          </Text>
          <Input
            type="text"
            value={invoiceNumber}
            onChange={handleInvoiceNumberChange}
            placeholder="Enter invoice number (letters and numbers only)"
            bg="transparent"
            color={textColor}
            border="1px solid"
            borderColor={textColor}
          />
        </Flex>

        {/* Camera Button */}
        <Button
          colorScheme="teal"
          leftIcon={<Icon as={AiOutlineCamera} />}
          onClick={() => history.push('/Receiver/Scaninvoice')}
          disabled={isCameraButtonDisabled}
        >
          Open Camera
        </Button>
      </Card>
    </Flex>
  );
}
