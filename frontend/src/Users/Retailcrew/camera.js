import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  Text,
  useToast,
  Table,
  Tbody,
  Tr,
  Td,
  Th,
  Thead,
} from "@chakra-ui/react";
import { FiPlus, FiMinus, FiX } from "react-icons/fi";
import { useHistory, useLocation } from "react-router-dom"; // React Router for redirection
import Quagga from "quagga";
import axios from "axios";
const APIEndpoint = process.env.REACT_APP_API_URL;

function CameraPage() {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [scannedBarcode, setScannedBarcode] = useState(null);
  const [cart, setCart] = useState([]);
  const videoRef = useRef(null);
  const toast = useToast();
  const history = useHistory(); // For redirecting to the product card page
  const [scanLinePosition, setScanLinePosition] = useState(0); // For moving the red line

  const [employee, setEmployee] = useState(null); // Store employee data in state
  // Access data passed between components
  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.employee) {
      setEmployee(location.state.employee);
      console.log(
        "Camera: Access employee data from other component:",
        location.state.employee
      );
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state && location.state.cart) {
      setCart(location.state.cart);
      console.log(
        "Camera: Access cart data from other component:",
        location.state.cart
      );
    }
  }, [location.state]);

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!scannedBarcode) return;
    const product = products.find((p) => p.barcode === scannedBarcode);
    if (!product) return;

    const newCart = [...cart, { ...product, quantity }];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    toast({
      title: "Product Added",
      description: `${quantity} x ${product.title} added to cart.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setShowModal(false);
    setQuantity(1); // Reset quantity after adding to cart
    setScannedBarcode(null); // Reset barcode after adding to cart
  };

  const handleRemoveFromCart = (barcode) => {
    const updatedCart = cart.filter((item) => item.barcode !== barcode);
    setCart(updatedCart);
    toast({
      title: "Product Removed",
      description: "Product removed from cart.",
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

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          Quagga.init(
            {
              inputStream: {
                name: "Live",
                type: "LiveStream",
                target: videoRef.current,
              },
              decoder: {
                readers: ["code_128_reader", "ean_reader"],
              },
            },
            (err) => {
              if (err) {
                console.error("Error initializing Quagga:", err);
                return;
              }
              Quagga.start();
            }
          );

          Quagga.onDetected((data) => {
            const barcode = data.codeResult.code;
            setScannedBarcode(barcode);

            // Check if the scanned barcode exists in the local product data
            const product = products.find((p) => p.barcode === barcode);
            if (product) {
              // If product exists, show the modal
              setShowModal(true);
            } else {
              // If no matching product, show a toast notification
              toast({
                title: "Product Not Found",
                description:
                  "This barcode does not match any product in the database.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            }
          });
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
        });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const updateScanLinePosition = () => {
    setScanLinePosition((prev) => (prev >= 100 ? 0 : prev + 1)); // Moves line position up to 100%
  };

  useEffect(() => {
    startCamera();
    const scanLineInterval = setInterval(updateScanLinePosition, 30); // Adjust the speed of the scan line movement
    return () => {
      stopCamera();
      clearInterval(scanLineInterval);
    };
  }, []);

  return (
    <Box
      w="100%"
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      p={4}
    >
      <Box position="relative" w="100%" maxW="600px" mr={8}>
        <video
          ref={videoRef}
          width="100%"
          height="auto"
          style={{ borderRadius: "8px", border: "2px solid #fff" }}
          autoPlay
          muted
          playsInline
        />
        {/* Red Scanning Line */}
        <Box
          position="absolute"
          top={`${scanLinePosition}%`} // Moving the line based on state
          left="0"
          right="0"
          height="2px"
          bg="red"
        />
        <Button
          position="absolute"
          bottom="20px"
          left="50%"
          transform="translateX(-50%)"
          colorScheme="blue"
          onClick={startCamera}
        >
          Start Scanning
        </Button>
      </Box>

      <Box
        w="100%"
        maxW="400px"
        p={4}
        boxShadow="lg"
        borderRadius="md"
        bg="white"
      >
        <Heading size="md" mb={4} textAlign="center">
          Cart
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th textAlign="center">Quantity</Th>
              <Th textAlign="right">Remove</Th>
            </Tr>
          </Thead>
          <Tbody>
            {cart.map((item) => (
              <Tr key={item.barcode}>
                <Td>{item.name}</Td>
                <Td>{item.quantity}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleRemoveFromCart(item.barcode)}
                    leftIcon={<FiX />}
                  >
                    Remove
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Checkout and Product Card Buttons */}
        <Flex justify="space-between" mt={4}>
          <Button
            colorScheme="green"
            onClick={handleCheckout}
            w="48%" // Ensures both buttons are of equal width
            size="lg" // Keeps button size consistent
          >
            Checkout
          </Button>

          <Button
            colorScheme="blue"
            onClick={() =>
              history.push("/Retailcrew/ProductCard", { cart, employee })
            }
            w="48%" // Ensures both buttons are of equal width
            size="lg" // Keeps button size consistent
          >
            Product Card
          </Button>
        </Flex>
      </Box>

      {/* Modal for quantity input */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        size="md"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            Enter Quantity for Product
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex align="center" justify="center" direction="row" mb={4}>
              <Button onClick={decreaseQuantity} size="sm" mr={2}>
                <FiMinus />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                size="sm"
                width="50px"
                textAlign="center"
              />
              <Button onClick={increaseQuantity} size="sm" ml={2}>
                <FiPlus />
              </Button>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CameraPage;
