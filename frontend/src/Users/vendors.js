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
  useDisclosure,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Spinner } from '@chakra-ui/react';

// API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

function Vendors() {
  const [vendors, setVendors] = useState([]); // Stores the list of vendors
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // Stores search query
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal controls for create/update
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure(); // Modal controls for delete confirmation
  const [selectedVendor, setSelectedVendor] = useState(null); // Stores selected vendor for update
  const [vendorToDelete, setVendorToDelete] = useState(null); // Stores vendor to be deleted
  const toast = useToast();

  // Fetch vendors list
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = () => {
    setLoading(true);
    fetch(`${API_URL}/vendors/`)
      .then((response) => response.json())
      .then((data) => {
        setVendors(data);
        console.log('Vendors data:', data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching vendor data:', error);
        setLoading(false);
      });
  };

  // Handle Create or Update Vendor
  const handleVendorSubmit = () => {
    if (!selectedVendor.name || !selectedVendor.description) {
      toast({
        title: 'Error',
        description: 'Name and Description are required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const method = selectedVendor.vendor_id ? 'PUT' : 'POST';
    const url = selectedVendor.vendor_id
      ? `${API_URL}vendors/${selectedVendor.vendor_id}`
      : `${API_URL}vendors/`;

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedVendor),
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: 'Success',
            description: selectedVendor.vendor_id ? 'Vendor updated successfully.' : 'Vendor created successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          fetchVendors();
          onClose(); // Close modal
        } else {
          throw new Error('Failed to submit vendor data');
        }
      })
      .catch((error) => {
        console.error('Error submitting vendor data:', error);
        toast({
          title: 'Error',
          description: 'Failed to submit vendor data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Handle Delete Vendor
  const handleDeleteVendor = () => {
    fetch(`${API_URL}/vendors/${vendorToDelete}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Vendor deleted successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          fetchVendors(); // Re-fetch vendors after deletion
          onDeleteClose(); // Close delete confirmation modal
        } else {
          throw new Error('Failed to delete vendor');
        }
      })
      .catch((error) => {
        console.error('Error deleting vendor:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete vendor.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

// Filter vendors based on search query
let filteredVendors = [];

if (Array.isArray(vendors)) {
  filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
} else {
  console.error("vendors is not an array");
}

// Now you can use filteredVendors here
console.log(filteredVendors);
  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
        <Text ml={4} color="white">
          Loading vendors...
        </Text>
      </Flex>
    );
  }

  return (
    <Box mt="50px" p={6} color="white">
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">Vendors List</Heading>
        <Button colorScheme="teal" onClick={() => { setSelectedVendor(null); onOpen(); }}>
          Create New Vendor
        </Button>
      </Flex>

      {/* Search Input */}
      <Input
        placeholder="Search vendors..."
        value={searchQuery}
        bgColor="white"
        color="black"
        size="md" // Adjust size (options: sm, md, lg, etc.)
        position="relative" // Set the position as relative (you can adjust to absolute or fixed if needed)
        top="-50px" // Adjust vertical position
        left="600px" // Adjust horizontal position
        onChange={(e) => setSearchQuery(e.target.value)}
        mb={4}
        w="250px"
      />


      <Table variant="simple">
        <Thead>
          <Tr color="white">
            <Th color="white">Vendor ID</Th>
            <Th color="white">Name</Th>
            <Th color="white">Description</Th>
            <Th color="white">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredVendors.map((vendor) => (
            <Tr key={vendor.vendor_id}>
              <Td>{vendor.vendor_id}</Td>
              <Td>{vendor.name}</Td>
              <Td>{vendor.description}</Td>
              <Td>
                <IconButton
                  icon={<FiEdit />}
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    setSelectedVendor(vendor);
                    onOpen(); // Open modal for editing
                  }}
                  aria-label="Edit Vendor"
                  mr={4}
                />
                <IconButton
                  icon={<FiTrash2 />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => {
                    setVendorToDelete(vendor.vendor_id); // Set vendor to be deleted
                    onDeleteOpen(); // Open delete confirmation modal
                  }}
                  aria-label="Delete Vendor"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Create/Update Vendor Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedVendor ? 'Update' : 'Create'} Vendor</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Vendor Name"
              mb={4}
              value={selectedVendor?.name || ''}
              onChange={(e) => setSelectedVendor({ ...selectedVendor, name: e.target.value })}
            />
            <Input
              placeholder="Vendor Description"
              mb={4}
              value={selectedVendor?.description || ''}
              onChange={(e) => setSelectedVendor({ ...selectedVendor, description: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleVendorSubmit}>
              {selectedVendor ? 'Update' : 'Create'}
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
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to delete this vendor?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteVendor}>
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

export default Vendors;