import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Stack, Spinner, SimpleGrid, Image } from '@chakra-ui/react';
import axios from 'axios';
import { Separator } from 'components/Separator/Separator';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const response = await axios.get(`${API_URL}items`);
        if (Array.isArray(response.data)) {
          setInventory(response.data);
        } else {
          throw new Error('Unexpected API response structure');
        }
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError('Failed to load inventory data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt="20">
        <Spinner size="xl" color="teal.500" />
        <Text mt={4}>Loading inventory data...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt="20" color="red.500">
        <Text fontSize="lg">{error}</Text>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading mb={5} size="lg" textAlign="center">
        Inventory List
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {inventory.map((item, index) => (
          <Box
            key={item.item_id} // Assuming each item has a unique 'item_id'
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            shadow="md"
            p={4}
            bg={`rgba(0, 123, 255, 0.${(index % 3) + 4})`}  // Light blueish background with slight transparency variation
            borderColor={`rgba(0, 123, 255, 0.${(index % 3) + 4})`}  // Unique border color for each card
          >
            <Stack spacing={4}>
              {/* Display image if available */}
              <Image
                src={item.image_path || 'https://via.placeholder.com/150'}
                alt={item.product_name || 'Product Image'}
                boxSize="150px"
                objectFit="cover"
                borderRadius="lg"
                mb={4}
              />
              <Heading size="md">{item.product_name}</Heading>
              <Text fontSize="sm" color="#fff">
                {item.description}
              </Text>
              <Separator />
              <Stack spacing={2}>
                <Text fontSize="sm" color="#fff">
                  Code: {item.item_code}
                </Text>
                <Text fontSize="sm" color="#fff">
                  In Stock: {item.quantity}
                </Text>
              </Stack>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Inventory;
