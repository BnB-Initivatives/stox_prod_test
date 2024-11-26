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
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]); // Stores categories list
  const [searchTerm, setSearchTerm] = useState(''); // Stores the search term
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal controls for create/update
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure(); // Modal controls for delete confirmation
  const [selectedItem, setSelectedItem] = useState(null); // Stores selected item for update
  const [itemToDelete, setItemToDelete] = useState(null); // Stores item to be deleted
  const toast = useToast();

  // Fetch items list
  useEffect(() => {
    fetchItems();
    fetchVendors();
    fetchCategories();
  }, []);
  
  const fetchVendors = () => {
    fetch(`${API_URL}/vendors/`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setVendors(data);
        } else {
          console.error('Expected an array for vendors, but got:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching vendors:', error);
      });
  };

  const fetchCategories = () => {
    fetch(`${API_URL}/item-categories/`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Expected an array for categories, but got:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  };

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

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Input
          placeholder="Search by Item Name"
          width="250px"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          bgColor="white" // Added white background color
          color="black"
        />
        <Button colorScheme="teal" onClick={() => { setSelectedItem({}); onOpen(); }}>
          Create New Item
        </Button>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr color="white">
            <Th color="white">ID</Th>
            <Th color="white">Item Code</Th>
            <Th color="white">Name</Th>
            <Th color="white">Vendor</Th>
            <Th color="white">Quantity</Th>
            <Th color="white">Threshold</Th>
            <Th color="white">Barcode</Th>
            <Th color="white">Image</Th>
            <Th color="white">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredItems.map((item) => (
            <Tr key={item.item_id}>
              <Td>{item.item_id}</Td>
              <Td>{item.item_code}</Td>
              <Td>{item.name}</Td>
              <Td>{item.vendor ? item.vendor.name : 'N/A'}</Td>
              <Td textAlign="center">{item.quantity}</Td>
              <Td textAlign="center">{item.low_stock_threshold}</Td>
              <Td>{item.has_barcode ? 'Yes' : 'No'}</Td>
              <Td>
                {item.image_path && (
                  <Image src={item.image_path} alt={item.name} boxSize="50px" objectFit="cover" />
                )}
              </Td>
              <Td>
                <Flex gap={4} justify="center">
                  <IconButton
                    icon={<FiEdit />}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => {
                      setSelectedItem(item);
                      onOpen(); // Open modal for editing
                    }}
                    aria-label="Edit Item"
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
                </Flex>
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
            <Select
              placeholder="Select Vendor"
              value={selectedItem?.vendor_id || ''}
              mb={4}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, vendor_id: e.target.value })
              }
            >
              {vendors.map((vendor) => (
                <option key={vendor.vendor_id} value={vendor.vendor_id}>
                  {vendor.name}
                </option>
              ))}
            </Select>
            <Select
              placeholder="Select Category"
              value={selectedItem?.category || ''}
              mb={4}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, category: e.target.value })
              }
            >
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_name}>
                  {category.category_name}
                </option>
              ))}
            </Select>
            <Input
              placeholder="Owner Department"
              mb={4}
              value={selectedItem?.owner_department || ''}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, owner_department: e.target.value })
              }
            />
            <Input
              placeholder="Quantity"
              type="number"
              mb={4}
              value={selectedItem?.quantity || ''}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, quantity: e.target.value })
              }
            />
            <Input
              placeholder="Low Stock Threshold"
              type="number"
              mb={4}
              value={selectedItem?.low_stock_threshold || ''}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, low_stock_threshold: e.target.value })
              }
            />
            <Flex align="center" mb={4}>
              <Text>Has Barcode </Text>
              <Switch
                isChecked={selectedItem?.has_barcode || false}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    has_barcode: e.target.checked,
                  })
                }
              />
            {/* </Flex> */}
            {/* Conditionally show barcode input when 'has_barcode' is true */}
             {/* <td></td> */}

            {selectedItem?.has_barcode && (
              <Input
                mb={4}
                width="250px"
                value={selectedItem?.barcode || ''}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, barcode: e.target.value })
                }
              />
            )}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleItemSubmit}>
              {selectedItem?.item_id ? 'Update' : 'Create'} Item
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
            <Text>Are you sure you want to delete this item?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleDeleteItem}>
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

export default Items;