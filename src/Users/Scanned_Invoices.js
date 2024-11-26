import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";

const API_URL = process.env.REACT_APP_API_URL;

function ScannedInvoices() {
  const [invoices, setInvoices] = useState([]); // Stores the list of invoices
  const [filteredInvoices, setFilteredInvoices] = useState([]); // Stores the filtered list of invoices
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch invoices list
  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    // Filter invoices based on the search query
    const lowercasedQuery = searchQuery.toLowerCase();
    setFilteredInvoices(
      invoices.filter((invoice) =>
        `${invoice.invoice_number} ${invoice.vendor?.name || ""} ${
          invoice.employee?.first_name || ""
        } ${invoice.employee?.last_name || ""} ${
          invoice.employee?.department?.name || ""
        }`
          .toLowerCase()
          .includes(lowercasedQuery)
      )
    );
  }, [searchQuery, invoices]);

  const fetchInvoices = () => {
    setLoading(true);
    fetch(`${API_URL}/invoices/`)
      .then((response) => response.json())
      .then((data) => {
        setInvoices(data);
        setFilteredInvoices(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching invoice data:", error);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
        <Text ml={4} color="gray.500">
          Loading scanned invoices...
        </Text>
      </Flex>
    );
  }

  return (
    <Box mt="50px" p={6}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg" color="white">
          Scanned Invoices
        </Heading>
        <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            width="300px"
            bg="white"
            borderRadius="md"
            position="relative" // Allows you to use top/left/right/bottom for positioning
            top="10px"           // Adjust vertical position
            left="-600px"          // Adjust horizontal position
            />

      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th color="white">Scan ID</Th>
            <Th color="white">Invoice Number</Th>
            <Th color="white">Vendor</Th>
            <Th color="white">Employee Name</Th>
            <Th color="white">Department</Th>
            <Th color="white">Total Items</Th>
            <Th color="white">Created At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredInvoices.map((invoice) => (
            <Tr color="white" key={invoice.scan_id}>
              <Td>{invoice.scan_id}</Td>
              <Td>{invoice.invoice_number}</Td>
              <Td>{invoice.vendor?.name || "N/A"}</Td>
              <Td>
                {invoice.employee?.first_name} {invoice.employee?.last_name}
              </Td>
              <Td>{invoice.employee?.department?.name || "N/A"}</Td>
              <Td>{invoice.total_items}</Td>
              <Td>{new Date(invoice.created_at).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {filteredInvoices.length === 0 && (
        <Text color="white" textAlign="center" mt={4}>
          No invoices match your search query.
        </Text>
      )}
    </Box>
  );
}

export default ScannedInvoices;
