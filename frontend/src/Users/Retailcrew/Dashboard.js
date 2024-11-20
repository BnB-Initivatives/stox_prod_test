import React, { useState } from 'react';
import { Box, Button, Flex, Text, Input, Grid, IconButton, useToast } from '@chakra-ui/react';
import { withRouter } from 'react-router-dom';
import { DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';

function Dashboard({ history }) {
  const [employeeNumber, setemployeeNumber] = useState('');
  const toast = useToast();

  // Handle input change, allow only digits
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setemployeeNumber(value); // Update state if input is valid (only digits)
    }
  };

  // Handle numeric keypad button click
  const handleButtonClick = (num) => {
    setemployeeNumber((prev) => prev + num); // Append the clicked number to Employee ID
  };

  // Handle delete button click to clear the input
  const handleDeleteClick = () => {
    setemployeeNumber(''); // Clear the Employee ID
  };

  // Handle backspace button click to remove the last digit
  const handleBackspaceClick = () => {
    setemployeeNumber((prev) => prev.slice(0, -1)); // Remove the last character from Employee ID
  };

  // Validate Employee ID with backend
  const handleSubmit = async () => {
    try {
      if (!employeeNumber) {
        toast({
          title: 'Error',
          description: 'Employee ID cannot be empty.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Fetch employees from the API
      const response = await axios.get(`http://localhost:8000/employees/number/${employeeNumber}`);
      if (response.status === 200) {
        console.log('Employee validated successfully:', response.data);
        const employeeExists = response.data;
        toast({
          title: 'Welcome',
          description: 'Employee validated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        history.push('./WelcomeToStox'); // Redirect to the welcome page
      } else {
        toast({
          title: 'Error',
          description: 'Invalid Employee ID.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error validating employee:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while validating the Employee ID.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      h="100vh"
      w="100%"
      position="relative"
    >
      <Box p="40px" borderRadius="12px" boxShadow="lg" maxW="400px" w="100%" bg="white">
        <Text fontSize="3xl" color="#333" fontWeight="bold" textAlign="center" mb="20px">
          Employee Login
        </Text>

        <Input
          placeholder="Enter your Employee ID"
          value={employeeNumber}
          onChange={handleInputChange}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          width="90%"
          height="50px"
          fontSize="lg"
          border="1px solid #ccc"
          borderRadius="8px"
          p="10px"
          mb="20px"
        />

        <Grid templateColumns="repeat(3, 1fr)" gap={4} w="90%" mb="20px">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              colorScheme="blue"
              fontSize="lg"
              height="50px"
              onClick={() => handleButtonClick(num.toString())}
            >
              {num}
            </Button>
          ))}

          <Button
            key="0"
            colorScheme="blue"
            fontSize="lg"
            height="50px"
            onClick={() => handleButtonClick('0')}
          >
            0
          </Button>

          <IconButton
            icon={<DeleteIcon />}
            colorScheme="red"
            fontSize="lg"
            height="50px"
            onClick={handleDeleteClick}
            aria-label="Delete"
          />

          <IconButton
            icon={<Text fontSize="2xl" color="black">←</Text>}
            fontSize="lg"
            height="50px"
            onClick={handleBackspaceClick}
            aria-label="Backspace"
          />
        </Grid>

        <Button
          colorScheme="blue"
          width="90%"
          height="50px"
          fontSize="lg"
          borderRadius="8px"
          p="10px"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </Flex>
  );
}

export default withRouter(Dashboard);
