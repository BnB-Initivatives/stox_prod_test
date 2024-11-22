import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Spinner } from '@chakra-ui/react';

// API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

function Employees() {
  const [employees, setEmployees] = useState([]); // Stores the list of employees
  const [loading, setLoading] = useState(true); // Loading state
  const [searchTerm, setSearchTerm] = useState(''); // Stores the search term
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal controls for create/update
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure(); // Modal for delete
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure(); // Modal for create new employee
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Stores selected employee for update
  const [deleteId, setDeleteId] = useState(null); // Employee ID to delete
  const [newEmployee, setNewEmployee] = useState({
    employee_number: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    department_id: '',
  }); // New employee data
  const toast = useToast();

  const onCreateOpenHandler = () => {
    setNewEmployee({
      employee_number: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      department_id: '',
    });
    onCreateOpen();
  };
  
  // Fetch employees list
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    fetch(`${API_URL}/employees/`)
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching employee data:', error);
        setLoading(false);
      });
  };

  // Handle Create or Update Employee
  const handleEmployeeSubmit = () => {
    if (!newEmployee.first_name || !newEmployee.last_name) {
      toast({
        title: 'Error',
        description: 'First and Last name are required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const method = selectedEmployee ? 'PUT' : 'POST';
    const url = selectedEmployee
      ? `${API_URL}/employees/${selectedEmployee.employee_id}`
      : `${API_URL}/employees/`;

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedEmployee || newEmployee), // Use newEmployee for create
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: 'Success',
            description: selectedEmployee ? 'Employee updated successfully.' : 'Employee created successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          fetchEmployees();
          selectedEmployee ? onClose() : onCreateClose(); // Close the respective modal
        } else {
          throw new Error('Failed to submit employee data');
        }
      })
      .catch((error) => {
        console.error('Error submitting employee data:', error);
        toast({
          title: 'Error',
          description: 'Failed to submit employee data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Handle delete confirmation
  const handleDeleteEmployee = () => {
    fetch(`${API_URL}/employees/${deleteId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Employee deleted successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          fetchEmployees();
          onDeleteClose(); // Close delete modal
        } else {
          throw new Error('Failed to delete employee');
        }
      })
      .catch((error) => {
        console.error('Error deleting employee:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete employee.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
        <Text ml={4} color="white">
          Loading employees...
        </Text>
      </Flex>
    );
  }

  return (
    <Box mt="50px" p={6} color="white">
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">Employees List</Heading>
        <Button colorScheme="teal" onClick={onCreateOpenHandler}>
          Create New Employee
        </Button>
      </Flex>

      {/* Search Box */}
      <Box mb={4} w="100%" maxW="500px" mx="auto">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name"
          bg="white"
          color="black"
          top="-50px"
          left="100px"
          w="150"
          mb={4}
        />
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr color="white">
            <Th color="white">Employee ID</Th>
            <Th color="white">Employee Number</Th>
            <Th color="white">First Name</Th>
            <Th color="white">Middle Name</Th>
            <Th color="white">Last Name</Th>
            <Th color="white">Department</Th>
            <Th color="white">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredEmployees.map((employee) => (
            <Tr key={employee.employee_id}>
              <Td>{employee.employee_id}</Td>
              <Td>{employee.employee_number}</Td>
              <Td>{employee.first_name}</Td>
              <Td>{employee.middle_name || 'N/A'}</Td>
              <Td>{employee.last_name}</Td>
              <Td>{employee.department?.name || 'N/A'}</Td>
              <Td>
                <IconButton
                  icon={<FiEdit />}
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    setSelectedEmployee(employee);
                    onOpen(); // Open modal for editing
                  }}
                  aria-label="Edit Employee"
                  mr={4}
                />
                <IconButton
                  icon={<FiTrash2 />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => {
                    setDeleteId(employee.employee_id);
                    onDeleteOpen(); // Open delete confirmation modal
                  }}
                  aria-label="Delete Employee"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Create New Employee Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Employee</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Employee Number"
              mb={4}
              value={newEmployee.employee_number}
              onChange={(e) => setNewEmployee({ ...newEmployee, employee_number: e.target.value })}
            />
            <Input
              placeholder="First Name"
              mb={4}
              value={newEmployee.first_name}
              onChange={(e) => setNewEmployee({ ...newEmployee, first_name: e.target.value })}
            />
            <Input
              placeholder="Middle Name"
              mb={4}
              value={newEmployee.middle_name}
              onChange={(e) => setNewEmployee({ ...newEmployee, middle_name: e.target.value })}
            />
            <Input
              placeholder="Last Name"
              mb={4}
              value={newEmployee.last_name}
              onChange={(e) => setNewEmployee({ ...newEmployee, last_name: e.target.value })}
            />
            <Input
              placeholder="Department ID"
              mb={4}
              value={newEmployee.department_id}
              onChange={(e) => setNewEmployee({ ...newEmployee, department_id: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleEmployeeSubmit}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onCreateClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update Employee Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Employee</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Employee Number"
              mb={4}
              value={selectedEmployee?.employee_number}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, employee_number: e.target.value })}
            />
            <Input
              placeholder="First Name"
              mb={4}
              value={selectedEmployee?.first_name}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, first_name: e.target.value })}
            />
            <Input
              placeholder="Middle Name"
              mb={4}
              value={selectedEmployee?.middle_name}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, middle_name: e.target.value })}
            />
            <Input
              placeholder="Last Name"
              mb={4}
              value={selectedEmployee?.last_name}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, last_name: e.target.value })}
            />
            <Input
              placeholder="Department ID"
              mb={4}
              value={selectedEmployee?.department_id}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, department_id: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleEmployeeSubmit}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Employee</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to delete this employee?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleDeleteEmployee}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onDeleteClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Employees;
