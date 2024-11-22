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
  Select,
  useDisclosure,
  useToast,
  IconButton,
  Image,
  Switch,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Spinner } from '@chakra-ui/react';

// API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

function Items() {
  const [items, setItems] = useState([]); // Stores the list of items
  const [loading, setLoading] = useState(true); // Loading state
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal controls for create/update
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure(); // Modal controls for delete confirmation
  const [selectedItem, setSelectedItem] = useState(null); // Stores selected item for update
  const [itemToDelete, setItemToDelete] = useState(null); // Stores item to be deleted
  const toast = useToast();

  // Fetch items list
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoading(true);
    fetch(`${API_URL}/items/`)
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching item data:', error);
        setLoading(false);
      });
  };

  // Handle Create or Update Item
  const handleItemSubmit = () => {
    if (
      !selectedItem.item_code ||
      !selectedItem.name ||
      !selectedItem.category ||
      !selectedItem.vendor_id ||
      !selectedItem.owner_department
    ) {
      toast({
        title: 'Error',
        description: 'Item Code, Name, Category, Vendor ID, and Owner Department are required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const method = selectedItem.item_id ? 'PUT' : 'POST';
    const url = selectedItem.item_id
      ? `${API_URL}/items/${selectedItem.item_id}`
      : `${API_URL}/items/`;

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedItem),
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: 'Success',
            description: selectedItem.item_id ? 'Item updated successfully.' : 'Item created successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          fetchItems();
          onClose(); // Close modal
        } else {
          throw new Error('Failed to submit item data');
        }
      })
      .catch((error) => {
        console.error('Error submitting item data:', error);
        toast({
          title: 'Error',
          description: 'Failed to submit item data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Handle Delete Item
  const handleDeleteItem = () => {
    fetch(`${API_URL}/items/${itemToDelete}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Item deleted successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          fetchItems(); // Re-fetch items after deletion
          onDeleteClose(); // Close delete confirmation modal
        } else {
          throw new Error('Failed to delete item');
        }
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete item.',
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
          Loading items...
        </Text>
      </Flex>
    );
  }

  return (
    <Box mt="50px" p={6} color="white">
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">Items List</Heading>
        <Button colorScheme="teal" onClick={() => { setSelectedItem({}); onOpen(); }}>
          Create New Item
        </Button>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr color="white">
            <Th color="white">Item ID</Th>
            <Th color="white">Item Code</Th>
            <Th color="white">Name</Th>
            <Th color="white">Vendor</Th>
            <Th color="white">Quantity</Th>
            <Th color="white">Threshold Value</Th>
            <Th color="white">Has Barcode</Th>
            <Th color="white">Image</Th>
            <Th color="white">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <Tr key={item.item_id}>
              <Td>{item.item_id}</Td>
              <Td>{item.item_code}</Td>
              <Td>{item.name}</Td>
              <Td>{item.vendor ? item.vendor.name : 'N/A'}</Td>
              <Td>{item.quantity}</Td>
              <Td>{item.low_stock_threshold}</Td>
              <Td>{item.has_barcode ? 'Yes' : 'No'}</Td>
              <Td>
                {item.image_path && (
                  <Image src={item.image_path} alt={item.name} boxSize="50px" objectFit="cover" />
                )}
              </Td>
              <Td>
                <IconButton
                  icon={<FiEdit />}
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item);
                    onOpen(); // Open modal for editing
                  }}
                  aria-label="Edit Item"
                  mr={4}
                />
                <IconButton
                  icon={<FiTrash2 />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => {
                    setItemToDelete(item.item_id); // Set item to be deleted
                    onDeleteOpen(); // Open delete confirmation modal
                  }}
                  aria-label="Delete Item"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Create/Update Item Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedItem?.item_id ? 'Update' : 'Create'} Item</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Item Code"
              mb={4}
              value={selectedItem?.item_code || ''}
              onChange={(e) => setSelectedItem({ ...selectedItem, item_code: e.target.value })}
            />
            <Input
              placeholder="Item Name"
              mb={4}
              value={selectedItem?.name || ''}
              onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
            />
            <Input
              placeholder="Item Description"
              mb={4}
              value={selectedItem?.description || ''}
              onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
            />
            <Select
              placeholder="Select Category"
              mb={4}
              value={selectedItem?.category || ''}
              onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })}
            >
              <option value="1">Category 1</option>
              <option value="2">Category 2</option>
              <option value="3">Category 3</option>
            </Select>
            <Select
              placeholder="Select Vendor"
              mb={4}
              value={selectedItem?.vendor_id || ''}
              onChange={(e) => setSelectedItem({ ...selectedItem, vendor_id: e.target.value })}
            >
              <option value="1">Vendor 1</option>
              <option value="2">Vendor 2</option>
              <option value="3">Vendor 3</option>
            </Select>
            <Select
              placeholder="Select Owner Department"
              mb={4}
              value={selectedItem?.owner_department || ''}
              onChange={(e) => setSelectedItem({ ...selectedItem, owner_department: e.target.value })}
            >
              <option value="1">Department 1</option>
              <option value="2">Department 2</option>
              <option value="3">Department 3</option>
            </Select>
            <Flex mb={4} align="center">
              <Text mr={2}>Has Barcode</Text>
              <Switch
                isChecked={selectedItem?.has_barcode || false}
                onChange={(e) => setSelectedItem({ ...selectedItem, has_barcode: e.target.checked })}
              />
            </Flex>
            <Input
              placeholder="Barcode"
              mb={4}
              value={selectedItem?.barcode || ''}
              onChange={(e) => setSelectedItem({ ...selectedItem, barcode: e.target.value })}
              disabled={!selectedItem?.has_barcode}
            />
            <Input
              placeholder="Image Path"
              mb={4}
              value={selectedItem?.image_path || ''}
              onChange={(e) => setSelectedItem({ ...selectedItem, image_path: e.target.value })}
            />
            <Select
              placeholder="Select Unit of Measure"
              mb={4}
              value={selectedItem?.unit_of_measure || ''}
              onChange={(e) => setSelectedItem({ ...selectedItem, unit_of_measure: e.target.value })}
            >
              <option value="1">Unit 1</option>
              <option value="2">Unit 2</option>
            </Select>
            <Input
              placeholder="Quantity"
              mb={4}
              type="number"
              value={selectedItem?.quantity }
              onChange={(e) => setSelectedItem({ ...selectedItem, quantity: e.target.value })}
            />
            <Input
              placeholder="Low Stock Threshold"
              mb={4}
              type="number"
              value={selectedItem?.low_stock_threshold }
              onChange={(e) => setSelectedItem({ ...selectedItem, low_stock_threshold: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleItemSubmit}>
              {selectedItem?.item_id ? 'Update Item' : 'Create Item'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Item</ModalHeader>
          <ModalBody>Are you sure you want to delete this item?</ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteItem}>
              Delete Item
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Items;
