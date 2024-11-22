import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { FiEdit, FiDelete , FiTrash2} from 'react-icons/fi';

// Environment variable for the API URL
const API_URL = process.env.REACT_APP_API_URL;

function Dashboard() {
  const [departments, setDepartments] = useState([]); // Stores the list of departments
  const [loading, setLoading] = useState(true); // Loading state
  const { isOpen, onOpen, onClose } = useDisclosure(); // For create modal control
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure(); // For delete confirmation modal control
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure(); // For update modal control
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' }); // State for new department form
  const [deleteId, setDeleteId] = useState(''); // State for department_id to delete
  const [updateDepartment, setUpdateDepartment] = useState({ id: '', name: '', description: '' }); // State for updating department
  const toast = useToast();

  // Fetch departments list
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    setLoading(true);
    fetch(`${API_URL}/departments/`)
      .then((response) => response.json())
      .then((data) => {
        setDepartments(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching department data:', error);
        setLoading(false);
      });
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment((prev) => ({ ...prev, [name]: value }));
  };

  // Handle create department
  const handleCreateDepartment = () => {
    if (!newDepartment.name || !newDepartment.description) {
      toast({
        title: 'Error',
        description: 'Name and Description are required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    fetch(`${API_URL}/departments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDepartment),
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Department created successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          setNewDepartment({ name: '', description: '' }); // Reset the form
          fetchDepartments(); // Refresh the department list
          onClose(); // Close the modal
        } else {
          throw new Error('Failed to create department');
        }
      })
      .catch((error) => {
        console.error('Error creating department:', error);
        toast({
          title: 'Error',
          description: 'Failed to create department.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Handle delete department
  const handleDeleteDepartment = () => {
    if (!deleteId) {
      toast({
        title: 'Error',
        description: 'Department ID is required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    fetch(`${API_URL}/departments/${deleteId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Department deleted successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          setDeleteId(''); // Reset the input
          fetchDepartments(); // Refresh the department list
          onDeleteClose(); // Close the modal
        } else {
          throw new Error('Failed to delete department');
        }
      })
      .catch((error) => {
        console.error('Error deleting department:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete department.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Handle update department
  const handleUpdateDepartment = () => {
    if (!updateDepartment.name || !updateDepartment.description) {
      toast({
        title: 'Error',
        description: 'Name and Description are required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    fetch(`${API_URL}/departments/${updateDepartment.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateDepartment),
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Department updated successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          setUpdateDepartment({ id: '', name: '', description: '' }); // Reset the update form
          fetchDepartments(); // Refresh the department list
          onUpdateClose(); // Close the modal
        } else {
          throw new Error('Failed to update department');
        }
      })
      .catch((error) => {
        console.error('Error updating department:', error);
        toast({
          title: 'Error',
          description: 'Failed to update department.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
        <Text ml={4} color="white">
          Loading departments...
        </Text>
      </Flex>
    );
  }

  if (!departments || departments.length === 0) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Text color="white">No departments found.</Text>
      </Flex>
    );
  }

  return (
    <Box mt="50px" p={6} color="white">
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">Departments List</Heading>
        <Button colorScheme="teal" onClick={onOpen}>
          Create New Department
        </Button>
      </Flex>

      <Table variant="simple" color="white">
        <Thead>
          <Tr>
            <Th color="white">Department ID</Th>
            <Th color="white">Name</Th>
            <Th color="white">Description</Th>
            <Th color="white">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {departments.map((department) => (
            <Tr key={department.department_id}>
              <Td>{department.department_id}</Td>
              <Td>{department.name}</Td>
              <Td>{department.description}</Td>
              <Td>
                <IconButton
                  icon={<FiEdit />}
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    setUpdateDepartment({
                      id: department.department_id,
                      name: department.name,
                      description: department.description,
                    });
                    onUpdateOpen();
                  }}
                  aria-label="Update Department"
                />
                <IconButton
                  icon={<FiTrash2 />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => {
                    setDeleteId(department.department_id); // Set the department ID to delete
                    onDeleteOpen();
                  }}
                  aria-label="Delete Department"
                  ml={4}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Create Department Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter new department details</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Department Name"
              mb={4}
              name="name"
              value={newDepartment.name}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Department Description"
              name="description"
              value={newDepartment.description}
              onChange={handleInputChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleCreateDepartment}>
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Department Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to delete this department?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteDepartment}>
              Yes, Delete
            </Button>
            <Button variant="ghost" onClick={onDeleteClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update Department Modal */}
      <Modal isOpen={isUpdateOpen} onClose={onUpdateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Department</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Department Name"
              mb={4}
              name="name"
              value={updateDepartment.name}
              onChange={(e) =>
                setUpdateDepartment({ ...updateDepartment, name: e.target.value })
              }
            />
            <Input
              placeholder="Department Description"
              name="description"
              value={updateDepartment.description}
              onChange={(e) =>
                setUpdateDepartment({ ...updateDepartment, description: e.target.value })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleUpdateDepartment}>
              Update
            </Button>
            <Button variant="ghost" onClick={onUpdateClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Dashboard;
