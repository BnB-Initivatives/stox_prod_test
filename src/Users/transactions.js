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
  Spinner,
  Input,
} from '@chakra-ui/react';

// API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

function Transactions() {
  const [transactions, setTransactions] = useState([]); // Stores the list of transactions
  const [loading, setLoading] = useState(true); // Loading state
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Fetch transactions list
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    setLoading(true);
    fetch(`${API_URL}/transactions/`)
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching transaction data:', error);
        setLoading(false);
      });
  };

  // Filter transactions based on the search term
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.transaction_id.toString().includes(searchTerm) ||
    transaction.employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
        <Text ml={4} color="white">
          Loading transactions...
        </Text>
      </Flex>
    );
  }

  return (
    <Box mt="50px" p={6} color="white">
      <Flex justify="center" mb={4}>
        <Input
          placeholder="Search Transactions"
          width="250px"
          top="60px"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          bgColor="white" // White background for search box
          color="black" // Ensure text is visible
        />
      </Flex>

      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">Transactions</Heading>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr color="white">
            <Th color="white">Transaction ID</Th>
            <Th color="white">Employee Name</Th>
            <Th color="white">Department</Th>
            <Th color="white">Total Items</Th>
            <Th color="white">Created At</Th>
            <Th color="white">Updated At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredTransactions.map((transaction) => (
            <Tr key={transaction.transaction_id}>
              <Td>{transaction.transaction_id}</Td>
              <Td>{transaction.employee.first_name} {transaction.employee.last_name}</Td>
              <Td>{transaction.department.name}</Td>
              <Td>{transaction.total_items}</Td>
              <Td>{new Date(transaction.created_at).toLocaleString()}</Td>
              <Td>{new Date(transaction.updated_at).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default Transactions;
