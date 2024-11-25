import React, { useState } from 'react';
import { Button, Input, Box, Text } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function LoginEmployee() {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleLogin = async () => {
    try {
      // Example API call to authenticate employee
      const response = await axios.post('http://localhost:8000/login', {
        employee_number: employeeNumber,
        password: password,
      });

      if (response.data && response.data.employee_id) {
        // Storing employee ID in localStorage
        localStorage.setItem('employeeId', response.data.employee_id);
        // Redirect to welcome page after successful login
        history.push('/welcome'); // Assuming '/welcome' is the route to the WelcomePage
      } else {
        setError('Invalid employee number or password');
      }
    } catch (err) {
      setError('Error during login');
    }
  };

  return (
    <Box textAlign="center" p="20px" maxW="500px" mx="auto">
      <Text fontSize="3xl" mb="20px">Employee Login</Text>
      <Input
        placeholder="Employee Number"
        value={employeeNumber}
        onChange={(e) => setEmployeeNumber(e.target.value)}
        mb="10px"
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        mb="10px"
      />
      {error && <Text color="red.500">{error}</Text>}
      <Button colorScheme="blue" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
}

export default LoginEmployee;
