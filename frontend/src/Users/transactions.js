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
  useDisclosure,
  useToast,
  IconButton,
  Spinner,
} from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';

// API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

function Transactions() {
  const [transactions, setTransactions] = useState([]); // Stores the list of transactions
  const [loading, setLoading] = useState(true); // Loading state
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure(); // Modal controls for delete confirmation
  const [transactionToDelete, setTransactionToDelete] = useState(null); // Stores transaction to be deleted
  const toast = useToast();

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

  // Handle Delete Transaction
  const handleDeleteTransaction = () => {
    fetch(`${API_URL}/transactions/${transactionToDelete}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Transaction deleted successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          fetchTransactions(); // Re-fetch transactions after deletion
          onDeleteClose(); // Close delete confirmation modal
        } else {
          throw new Error('Failed to delete transaction');
        }
      })
      .catch((error) => {
        console.error('Error deleting transaction:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete transaction.',
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
          Loading transactions...
        </Text>
      </Flex>
    );
  }

  return (
    <Box mt="50px" p={6} color="white">
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
            <Th color="white">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <Tr key={transaction.transaction_id}>
              <Td>{transaction.transaction_id}</Td>
              <Td>{transaction.employee.first_name} {transaction.employee.last_name}</Td>
              <Td>{transaction.department.name}</Td>
              <Td>{transaction.total_items}</Td>
              <Td>{new Date(transaction.created_at).toLocaleString()}</Td>
              <Td>{new Date(transaction.updated_at).toLocaleString()}</Td>
              <Td>
                <IconButton
                  icon={<FiTrash2 />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => {
                    setTransactionToDelete(transaction.transaction_id); // Set transaction to be deleted
                    onDeleteOpen(); // Open delete confirmation modal
                  }}
                  aria-label="Delete Transaction"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Transaction</ModalHeader>
          <ModalBody>Are you sure you want to delete this transaction?</ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteTransaction}>
              Delete Transaction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Transactions;
