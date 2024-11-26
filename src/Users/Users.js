import {
	Avatar,
	Box,
	Flex,
	Text,
  } from '@chakra-ui/react';
  import React, { useEffect, useState } from 'react';
  import avatar11 from 'assets/img/avatars/avatar11.png';
  import Card from 'components/Card/Card'; // Assuming Card component is imported
  
  // Environment variable for the API URL
  const API_URL = process.env.REACT_APP_API_URL;
  
  function Profile() {
	const [userData, setUserData] = useState([]);  // Initialize as an array
	const [loading, setLoading] = useState(true);
  
	useEffect(() => {
	  // Fetch user profile data from the backend API
	  console.log(API_URL);
	  fetch(`${API_URL}/users/`)
		.then(response => response.json())
		.then(data => {
		  console.log('Fetched Data:', data);  // Log the fetched data
		  setUserData(data); // Update state with the array of users
		  setLoading(false); // Stop the loading state
		})
		.catch(error => {
		  console.error('Error fetching data:', error);
		  setLoading(false); // Stop loading even if there is an error
		});
	}, []);
  
	// Loading state or error handling
	if (loading) {
	  return <Text>Loading...</Text>;
	}
  
	// If userData is not available, render an error message
	if (!userData || userData.length === 0) {
	  return <Text>No users found.</Text>;
	}
  
	return (
	  <Flex direction="column" mt={{ sm: '25px', md: '0px' }}>
		{userData.map((user, index) => (
		  <Box
			key={index}
			mb={{ sm: '24px', md: '50px', xl: '20px' }}
			borderRadius="15px"
			px="0px"
			display="flex"
			flexDirection="column"
			justifyContent="center"
			align="center">
			{/* Header */}
			<Card
			  direction={{ sm: 'column', md: 'row' }}
			  mx="auto"
			  maxH="330px"
			  w={{ sm: '90%', xl: '100%' }}
			  justifyContent={{ sm: 'center', md: 'space-between' }}
			  align="center"
			  p="24px"
			  borderRadius="20px"
			  mt="100px">
			  <Flex align="center" direction={{ sm: 'column', md: 'row' }}>
				<Flex
				  align="center"
				  mb={{ sm: '10px', md: '0px' }}
				  direction={{ sm: 'column', md: 'row' }}
				  w={{ sm: '100%' }}
				  textAlign={{ sm: 'center', md: 'start' }}>
				  <Avatar
					me={{ md: '22px' }}
					src={avatar11}
					w="80px"
					h="80px"
					borderRadius="15px">
				  </Avatar>
				  <Flex direction="column" maxWidth="100%" my={{ sm: '14px' }}>
					{/* Dynamically display data for each user */}
					<Text fontSize={{ sm: 'lg', lg: 'xl' }} color="#fff" fontWeight="bold" ms={{ sm: '8px', md: '0px' }}>
					  {user.user_name} {/* Display Username */}
					</Text>
					<Text fontSize={{ sm: 'sm', md: 'md' }} color="#fff">
						{user?.employee?.department?.name ?? 'None'} {/* Display Role */}
					</Text>
					<Text fontSize={{ sm: 'sm', md: 'md' }} color="gray.400">
					  {user?.employee?.employee_number ?? 'None'} {/* Display Employee Number */}
					</Text>
				  </Flex>
				</Flex>
  
				{/* Box with white border */}
				<Box
				  border="2px solid white"
				  borderRadius="10px"
				  p="10px"
				  mx={{ sm: '0', md: '20px' }}
				  w={{ sm: '100%', md: '100%' }}
				  h="80px"
				  display="flex"
				  alignItems="center"
				  justifyContent="center">
				  <Text fontSize="md" color="white">
					Additional Info: {user.additionalInfo} {/* Display Additional Info */}
				  </Text>
				</Box>
			  </Flex>
			</Card>
		  </Box>
		))}
	  </Flex>
	);
  }
  
  export default Profile;
  