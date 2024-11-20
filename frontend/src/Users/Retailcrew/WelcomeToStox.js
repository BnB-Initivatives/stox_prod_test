import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import logo from '../../assets/img/Logo.png'; // Import logo
import barcodeIcon from '../../assets/img/barcode1.jpg'; // Import barcode image
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import axios from 'axios';

function WelcomePage() {
  const history = useHistory();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle error state

  // Fetch employee data from backend or localStorage
  useEffect(() => {
    const fetchEmployeeData = async () => {
      const employeeId = localStorage.getItem('employeeId'); // Retrieve employee ID from localStorage
      if (employeeId) {
        try {
          // Make a GET request to fetch employee details by ID
          const response = await axios.get(`http://localhost:8000/employees/${employeeId}`);
          if (response.data) {
            setEmployee(response.data); // Set employee data to state
            setLoading(false); // Set loading to false once data is fetched
          }
        } catch (error) {
          console.error('Error fetching employee data:', error);
          setError('Error fetching employee data');
          setLoading(false); // Set loading to false after error
        }
      } else {
        setError('No employee ID found in localStorage');
        setLoading(false); // Set loading to false if no employee ID is found
      }
    };

    fetchEmployeeData();
  }, []);

  return (
    <Flex direction="row" h="100vh" w="100%" align="center" justify="center" p="20px" wrap="wrap" position="relative">
      {/* Add CSS directly in the file */}
      <style>{`
        @keyframes scan {
          0% {
            top: -50px;
          }
          50% {
            top: 50%;
          }
          100% {
            top: 100%;
          }
        }
      `}</style>

      {/* Back button at the top-left */}
      <Box position="absolute" top="20px" left="20px" height="10" zIndex="10">
        <Button colorScheme="blue" onClick={() => history.goBack()} size="md">
          Back
        </Button>
      </Box>

      {/* Top-right image (logo) and employee info */}
      <Box
        position="absolute"
        top="20px"
        right="20px"
        zIndex="10"
        color="white"
        display="flex"
        alignItems="center" // Align logo and text horizontally
      >
        <Box mr="10px" textAlign="right">
          {loading ? (
            <Text fontSize="lg" fontWeight="bold">Loading...</Text>
          ) : error ? (
            <Text fontSize="lg" fontWeight="bold" color="red">{error}</Text>
          ) : (
            <>
              <Text fontSize="lg" fontWeight="bold">{employee.first_name} {employee.last_name}</Text>
              <Text fontSize="lg" fontWeight="bold">Employee ID: {employee.employee_number}</Text>
            </>
          )}
        </Box>

        <img src={logo} alt="Logo" style={{ width: '60px', height: '60px' }} />
      </Box>

      {/* Left side: Welcome text and lookup button */}
      <Box
        w={{ base: "100%", md: "50%" }} // Width changes based on screen size
        h={{ base: "auto", md: "100%" }} // Adjust height for smaller screens
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p="20px"
        position="relative"
      >
        <Box
          p="40px"
          borderRadius="12px"
          boxShadow="lg"
          textAlign="center"
          mb="20px"
          w="100%"
          maxW="500px"
          position="relative"
          top="10px"
        >
          <Text fontSize="5xl" fontWeight="bold" mb="20px" color="white">Welcome to StoX!</Text>
          <Text fontSize="5xl" color="white" mb="20px">Scan your item to get started.</Text>
          <Button
            colorScheme="blue"
            size="lg"
            width="300px"
            height="50px"
            leftIcon={<SearchIcon />}
            onClick={() => history.push('/Retailcrew/ProductCard')} // Trigger navigate to ProductCard
            p="20px"
            mb="10px"
          >
            Lookup Items
          </Button>
        </Box>
      </Box>

      {/* Right side: Camera access */}
      <Box
        w={{ base: "100%", md: "50%", lg: "40%" }}
        h={{ base: "100%", md: "55%", lg: "47%" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        p="20px"
        position="relative"
      >
        <Box
          position="absolute"
          bottom="20px"
          left="50%"
          transform="translateX(-50%)"
          cursor="pointer"
          onClick={() => history.push('/Retailcrew/camera')} // Trigger navigate to CameraPage
        >
          <Box
            position="relative"
            width="500px"
            height="300px"
            backgroundImage={`url(${barcodeIcon})`}
            backgroundSize="cover"
            borderRadius="10px"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
          >
            {/* Red Line Animation */}
            <Box
              position="absolute"
              top="-50px"
              left="0"
              width="100%"
              height="5px"
              backgroundColor="red"
              animation="scan 2s infinite linear"
            />
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}

export default WelcomePage;
