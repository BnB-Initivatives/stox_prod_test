import React, { useState } from 'react';
import {
  Box,
  Flex,
  Avatar,
  Text,
  Heading,
  Stack,
  Divider,
  Button,
  Icon,
  Input,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { AiOutlineArrowLeft, AiOutlineEdit, AiOutlineCheck } from 'react-icons/ai';

export default function Profile() {
  const history = useHistory();

  // User data and editable states
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    employeeId: '100101',
    department: 'Human Resources',
  });

  const [editableField, setEditableField] = useState(null);

  // Handlers for editing fields
  const handleEditClick = (field) => {
    setEditableField(field); // Set the field being edited
  };

  const handleInputChange = (e, field) => {
    setUser((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSaveClick = () => {
    setEditableField(null); // Exit edit mode
  };

  const handleGoBack = () => {
    history.push('./Dashboard');
  };

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      h="100vh"
      w="100%"
      p={4}
      position="relative"
      mt={5}
    >
      {/* Back Icon */}
      <Box
        position="absolute"
        top="20px"
        left="16px"
        cursor="pointer"
        onClick={handleGoBack}
      >
        <Icon as={AiOutlineArrowLeft} boxSize={6} color="white" />
      </Box>

        {/* My Profile Heading */}
      <Heading as="h2" size="lg" textAlign="center" mb={6} color="white">
        My Profile
      </Heading>

      {/* User Avatar */}
      <Avatar size="xl" src="https://via.placeholder.com/150" mb={4} />

      {/* User Name */}
      <Heading as="h1" size="lg" textAlign="center" mb={2} color="white">
        {user.firstName} {user.lastName}
      </Heading>

      {/* User Details */}
      <Stack spacing={4} w="100%" maxW="400px" mt={6}>
        {/* First Name */}
        <Box>
          <Flex justify="space-between" align="center">
            <Text fontSize="md" fontWeight="bold" color="white" w="40%">
              First Name
            </Text>
            <Flex align="center" w="60%">
              {editableField === 'firstName' ? (
                <Input
                  value={user.firstName}
                  onChange={(e) => handleInputChange(e, 'firstName')}
                  size="sm"
                  mr={2}
                  color="gray.300"
                  bg="transparent"
                  _placeholder={{ color: 'gray.400' }}
                  _focus={{ borderColor: 'teal.500' }}
                />
              ) : (
                <Text fontSize="sm" color="gray.300" flex="1">
                  {user.firstName}
                </Text>
              )}
              <Icon
                as={editableField === 'firstName' ? AiOutlineCheck : AiOutlineEdit}
                boxSize={5}
                color="teal.500"
                cursor="pointer"
                onClick={
                  editableField === 'firstName'
                    ? handleSaveClick
                    : () => handleEditClick('firstName')
                }
              />
            </Flex>
          </Flex>
        </Box>
        <Divider borderColor="white" />

        {/* Last Name */}
        <Box>
          <Flex justify="space-between" align="center">
            <Text fontSize="md" fontWeight="bold" color="white" w="40%">
              Last Name
            </Text>
            <Flex align="center" w="60%">
              {editableField === 'lastName' ? (
                <Input
                  value={user.lastName}
                  onChange={(e) => handleInputChange(e, 'lastName')}
                  size="sm"
                  mr={2}
                  color="gray.300"
                  bg="transparent"
                  _placeholder={{ color: 'gray.400' }}
                  _focus={{ borderColor: 'teal.500' }}
                />
              ) : (
                <Text fontSize="sm" color="gray.300" flex="1">
                  {user.lastName}
                </Text>
              )}
              <Icon
                as={editableField === 'lastName' ? AiOutlineCheck : AiOutlineEdit}
                boxSize={5}
                color="teal.500"
                cursor="pointer"
                onClick={
                  editableField === 'lastName'
                    ? handleSaveClick
                    : () => handleEditClick('lastName')
                }
              />
            </Flex>
          </Flex>
        </Box>
        <Divider borderColor="white" my={4} />

        {/* Employee ID */}
        <Box>
          <Flex justify="space-between" align="center">
            <Text fontSize="md" fontWeight="bold" color="white" w="40%">
              Employee ID
            </Text>
            <Flex align="center" w="60%">
              {editableField === 'employeeId' ? (
                <Input
                  value={user.employeeId}
                  onChange={(e) => handleInputChange(e, 'employeeId')}
                  size="sm"
                  mr={2}
                  color="gray.300"
                  bg="transparent"
                  _placeholder={{ color: 'gray.400' }}
                  _focus={{ borderColor: 'teal.500' }}
                />
              ) : (
                <Text fontSize="sm" color="gray.300" flex="1">
                  {user.employeeId}
                </Text>
              )}
              <Icon
                as={editableField === 'employeeId' ? AiOutlineCheck : AiOutlineEdit}
                boxSize={5}
                color="teal.500"
                cursor="pointer"
                onClick={
                  editableField === 'employeeId'
                    ? handleSaveClick
                    : () => handleEditClick('employeeId')
                }
              />
            </Flex>
          </Flex>
        </Box>
        <Divider borderColor="white" my={4} />

        {/* Department */}
        <Box>
          <Flex justify="space-between" align="center">
            <Text fontSize="md" fontWeight="bold" color="white" w="40%">
              Department
            </Text>
            <Flex align="center" w="60%">
              {editableField === 'department' ? (
                <Input
                  value={user.department}
                  onChange={(e) => handleInputChange(e, 'department')}
                  size="sm"
                  mr={2}
                  color="gray.300"
                  bg="transparent"
                  _placeholder={{ color: 'gray.400' }}
                  _focus={{ borderColor: 'teal.500' }}
                />
              ) : (
                <Text fontSize="sm" color="gray.300" flex="1">
                  {user.department}
                </Text>
              )}
              <Icon
                as={editableField === 'department' ? AiOutlineCheck : AiOutlineEdit}
                boxSize={5}
                color="teal.500"
                cursor="pointer"
                onClick={
                  editableField === 'department'
                    ? handleSaveClick
                    : () => handleEditClick('department')
                }
              />
            </Flex>
          </Flex>
        </Box>
        <Divider borderColor="white" />
      </Stack>

      {/* Logout Button */}
      <Button
        mt={6}
        colorScheme="teal"
        size="lg"
        w="100%"
        maxW="400px"
        onClick={() => history.push('/')} // Replace with logout functionality
      >
        Logout
      </Button>
    </Flex>
  );
}