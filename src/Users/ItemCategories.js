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
  Spinner,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

// API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

function ItemCategories() {
  const [categories, setCategories] = useState([]); // Stores the list of categories
  const [filteredCategories, setFilteredCategories] = useState([]); // Stores the filtered categories based on search
  const [searchQuery, setSearchQuery] = useState(''); // Stores the search input
  const [loading, setLoading] = useState(true); // Loading state
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal controls for create/update
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure(); // Modal controls for delete confirmation
  const [selectedCategory, setSelectedCategory] = useState(null); // Stores selected category for update
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Stores category to be deleted
  const toast = useToast();

  // Fetch categories list
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    fetch(`${API_URL}/item-categories/`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setFilteredCategories(data); // Set the filtered categories initially to all categories
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching category data:', error);
        setLoading(false);
      });
  };

  // Filter categories based on search query
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query)
    );
    setFilteredCategories(filtered);
  };

  // Handle Create or Update Category
  const handleCategorySubmit = () => {
    if (!selectedCategory.name || !selectedCategory.description) {
      toast({
        title: 'Error',
        description: 'Name and Description are required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const method = selectedCategory.category_id ? 'PUT' : 'POST';
    const url = selectedCategory.category_id
      ? `${API_URL}/item-categories/${selectedCategory.category_id}`
      : `${API_URL}/item-categories/`;

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedCategory),
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: 'Success',
            description: selectedCategory.category_id ? 'Category updated successfully.' : 'Category created successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          fetchCategories();
          onClose(); // Close modal
        } else {
          throw new Error('Failed to submit category data');
        }
      })
      .catch((error) => {
        console.error('Error submitting category data:', error);
        toast({
          title: 'Error',
          description: 'Failed to submit category data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Handle Delete Category
  const handleDeleteCategory = () => {
    fetch(`${API_URL}/item-categories/${categoryToDelete}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Category deleted successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          fetchCategories(); // Re-fetch categories after deletion
          onDeleteClose(); // Close delete confirmation modal
        } else {
          throw new Error('Failed to delete category');
        }
      })
      .catch((error) => {
        console.error('Error deleting category:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete category.',
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
          Loading categories...
        </Text>
      </Flex>
    );
  }

  return (
    <Box mt="50px" p={6} color="white">
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">Item Categories</Heading>
        <Button colorScheme="teal" onClick={() => { setSelectedCategory({}); onOpen(); }}>
          Create New Category
        </Button>
      </Flex>

      {/* Search Box with reduced length and manual position */}
      <Flex justify="space-between" align="center" mb={4} position="relative" top="10px">
        <Input
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Category "
          width="250px"  // Reduced width for the search box
          bg="white"
          color="black"
          _placeholder={{ color: 'gray.500' }}
          _focus={{ borderColor: 'teal.500' }}
          position="absolute" // Manually positioned
          top = "-60px"
          left="50%" // Centered horizontally
          transform="translateX(-50%)" // Offset by 50% for exact center alignment
        />
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr color="white">
            <Th color="white">Category ID</Th>
            <Th color="white">Name</Th>
            <Th color="white">Description</Th>
            <Th color="white">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredCategories.map((category) => (
            <Tr key={category.category_id}>
              <Td>{category.category_id}</Td>
              <Td>{category.name}</Td>
              <Td>{category.description}</Td>
              <Td>
                <IconButton
                  icon={<FiEdit />}
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    onOpen(); // Open modal for editing
                  }}
                  aria-label="Edit Category"
                  mr={4}
                />
                <IconButton
                  icon={<FiTrash2 />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => {
                    setCategoryToDelete(category.category_id); // Set category to be deleted
                    onDeleteOpen(); // Open delete confirmation modal
                  }}
                  aria-label="Delete Category"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Create/Update Category Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedCategory?.category_id ? 'Update' : 'Create'} Category</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Category Name"
              mb={4}
              value={selectedCategory?.name || ''}
              onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
            />
            <Input
              placeholder="Category Description"
              mb={4}
              value={selectedCategory?.description || ''}
              onChange={(e) => setSelectedCategory({ ...selectedCategory, description: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCategorySubmit}>
              {selectedCategory?.category_id ? 'Update Category' : 'Create Category'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Category</ModalHeader>
          <ModalBody>Are you sure you want to delete this category?</ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ItemCategories;
