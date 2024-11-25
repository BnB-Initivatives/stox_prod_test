import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Heading,
  Image,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FiX, FiCamera, FiMinus, FiPlus } from "react-icons/fi";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";

const APIEndpoint = process.env.REACT_APP_API_URL;

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [employee, setEmployee] = useState(null); // Store employee data in state
  const productsPerPage = 8; // Show 8 products at a time
  const toast = useToast();
  const history = useHistory();

  // Access data passed between components
  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.employee) {
      setEmployee(location.state.employee);
      console.log(
        "ProductCard: Access employee data from other component:",
        location.state.employee
      );
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state && location.state.cart) {
      setCart(location.state.cart);
      console.log(
        "ProductCard: Access cart data from other component:",
        location.state.cart
      );
    }
  }, [location.state]);

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(`${APIEndpoint}/items/`);

        if (response.status === 200) {
          setProducts(response.data);
        } else {
          toast({
            title: "Error",
            description: "An error occurred while fetching items.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Unable to fetch products.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
    fetchProducts();
  }, []);

  // Handle adding a product to the cart
  const handleAddToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item.item_id === product.item_id
    );

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.item_id === product.item_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    toast({
      title: "Product Added",
      description: `${
        product.title || product.name || "Unnamed Product"
      } added to cart.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle changing product quantity
  const handleChangeQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.item_id === productId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    toast({
      title: "Cart Updated",
      description: `Updated quantity for product ID: ${productId}.`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle removing a product from the cart
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.item_id !== productId)
    );
    toast({
      title: "Product Removed",
      description: "Item removed from cart.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle checkout logic
  const handleCheckout = async () => {
    try {
      // Prepare checkout payload
      const checkoutPayload = {
        employee_id: employee.employee_id,
        department_id: employee.department.department_id,
        total_items: cart.reduce((sum, item) => sum + item.quantity, 0),
        checkout_items: cart.map((item) => ({
          item_id: item.item_id,
          quantity: item.quantity,
        })),
      };

      // Send checkout data
      const postResponse = await axios.post(
        `${APIEndpoint}/transactions/`,
        checkoutPayload
      );
      if (postResponse.status === 201) {
        toast({
          title: "Checkout Successful",
          description: "Your items have been checked out successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setCart([]); // Clear the cart after checkout
      } else {
        toast({
          title: "Checkout Failed",
          description: "An error occurred during checkout.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Navigate to Camera page
  const handleScanBarcode = () => {
    history.push("./camera", { cart, employee });
  };

  // Navigate back to Welcome page
  const handleGoBack = () => {
    history.push("./CheckoutMainPage", {
      employee,
    });
  };

  return (
    <Flex
      direction="row"
      align="start"
      justify="space-between"
      w="100%"
      minH="100vh"
      p={5}
    >
      <Button
        position="absolute"
        top="15px"
        left="65px"
        colorScheme="teal"
        onClick={handleGoBack}
        size="md"
      >
        Back
      </Button>

      <Box w="60%" p={4}>
        <Heading size="md" mb={4}>
          Products
        </Heading>
        <Flex wrap="wrap" justify="space-between" gap={4}>
          {currentProducts.map((product) => (
            <Box
              key={product.item_id}
              border="1px solid gray"
              borderRadius="md"
              overflow="hidden"
              boxShadow="sm"
              p={3}
              bg="white"
              w="22%"
            >
              <Image
                src={product.image}
                alt={product.title || product.name || "Unnamed Product"}
                mb={2}
                borderRadius="md"
              />
              <Text fontSize="lg" fontWeight="bold">
                {product.title || product.name || "Unnamed Product"}
              </Text>
              <Text fontSize="sm" color="gray.500" mb={2}>
                {product.description}
              </Text>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => handleAddToCart(product)}
                w="full"
              >
                Add to Cart
              </Button>
            </Box>
          ))}
        </Flex>

        <Flex justify="center" mt={4}>
          <Button
            onClick={goToPreviousPage}
            isDisabled={currentPage === 0}
            mr={2}
            colorScheme="blue"
          >
            Previous
          </Button>
          <Button
            onClick={goToNextPage}
            isDisabled={currentPage === totalPages - 1}
            colorScheme="blue"
          >
            Next
          </Button>
        </Flex>
      </Box>

      <Box w="35%" p={4} border="1px solid gray" borderRadius="md" bg="white">
        <Heading size="md" mb={4} textAlign="center">
          Cart
        </Heading>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th textAlign="center">Quantity</Th>
              <Th textAlign="right">Remove</Th>
            </Tr>
          </Thead>
          <Tbody>
            {cart.map((item) => (
              <Tr key={item.item_id}>
                <Td>{item.title || item.name || "Unnamed Product"}</Td>
                <Td>
                  <Flex align="center" justify="center" gap={2}>
                    <IconButton
                      icon={<FiMinus />}
                      size="sm"
                      colorScheme="red"
                      aria-label="Decrease quantity"
                      onClick={() => handleChangeQuantity(item.item_id, -1)}
                    />
                    <Box textAlign="center" w="30px">
                      {item.quantity}
                    </Box>
                    <IconButton
                      icon={<FiPlus />}
                      size="sm"
                      colorScheme="green"
                      aria-label="Increase quantity"
                      onClick={() => handleChangeQuantity(item.item_id, 1)}
                    />
                  </Flex>
                </Td>
                <Td textAlign="right">
                  <IconButton
                    icon={<FiX />}
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleRemoveFromCart(item.item_id)}
                    aria-label="Remove from cart"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Button
          colorScheme="teal"
          w="48%"
          size="lg"
          onClick={handleCheckout}
          mt={4}
          isDisabled={cart.length === 0}
        >
          Checkout
        </Button>
        <Button
          colorScheme="blue"
          w="48%"
          size="lg"
          onClick={handleScanBarcode}
          mt={4}
        >
          Scan Barcode
        </Button>
      </Box>
    </Flex>
  );
}

export default ProductPage;
