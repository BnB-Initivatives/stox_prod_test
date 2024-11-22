import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Image,
  Switch,
  Text,
  DarkMode,
  useToast,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import signInImage from "assets/img/Logo.png";
import AuthFooter from "components/Footer/AuthFooter";
import GradientBorder from "components/GradientBorder/GradientBorder";

function SignIn() {
  const titleColor = "white";
  const textColor = "gray.400";

  // State to store form data
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Toast for notifications
  const toast = useToast();
  const history = useHistory();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const APIEndpoint = process.env.REACT_APP_API_URL;
    // Create form data
    const formData = new URLSearchParams();
    formData.append("remember_me", rememberMe);
    formData.append("grant_type", "password");
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch(`${APIEndpoint}/auth/token`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!response.ok) {
        console.error(`Error: HTTP ${response.status}`);
        throw new Error(`HTTP response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      // Assign the response data to variables
      const {
        access_token,
        employee_id,
        roles,
        token_type,
        user_id,
        user_name,
      } = data[0];

      console.log("Authentication successful for user:", user_name);

      // Store the access token in local storage for subsequent requests
      localStorage.setItem("authToken", access_token);

      if (roles && roles.length > 0) {
        const userRole = roles[0].name;
        console.log("User role:", userRole);
        localStorage.setItem("userRole", userRole);
        // Store the user role in local storage for subsequent requests
        toast({
          title: "Login Successful",
          description: `Welcome, ${user_name}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        switch (userRole) {
          case "SuperUser":
            history.push("/Superuser/Dashboard");
            break;
          case "RetailStaff":
            history.push("/Retailcrew/Dashboard");
            break;
          case "Receiver":
            history.push("/Receiver/Dashboard");
            break;
          case "Manager":
            history.push("/Manager/Dashboard");
            break;
          default:
            toast({
              title: "Invalid Role",
              description: "The user role is not recognized.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            break;
        }
      } else {
        toast({
          title: "Invalid Credentials",
          description: "Please check your user and the role assigned.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "An error occurred",
        description: "Unable to sign in. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="rgb(19,21,54)"
      position="relative"
    >
      <Flex
        direction="column"
        w={{ base: "90%", md: "400px" }}
        maxW="1044px"
        mx="auto"
        background="transparent"
        p="20px"
        align="center"
        justify="center"
      >
        <Image src={signInImage} alt="Logo" boxSize="100px" mb="20px" />
        <Heading
          color={titleColor}
          fontSize="32px"
          mb="20px"
          textAlign="center"
        >
          Nice to see you!
        </Heading>
        <Text color={textColor} fontWeight="bold" fontSize="14px" mb="36px">
          Enter your username and password to sign in
        </Text>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="normal" color="white">
            Usernames
          </FormLabel>
          <GradientBorder borderRadius="20px" mb="24px">
            <Input
              color="white"
              bg="rgb(19,21,54)"
              border="transparent"
              borderRadius="20px"
              fontSize="sm"
              size="lg"
              placeholder="Your user name"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
            />
          </GradientBorder>
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="normal" color="white">
            Password
          </FormLabel>
          <GradientBorder borderRadius="20px" mb="24px">
            <Input
              color="white"
              bg="rgb(19,21,54)"
              border="transparent"
              borderRadius="20px"
              fontSize="sm"
              size="lg"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </GradientBorder>
        </FormControl>
        <FormControl display="flex" alignItems="center" mb="24px">
          <DarkMode>
            <Switch
              id="remember-login"
              colorScheme="brand"
              isChecked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
          </DarkMode>
          <FormLabel
            htmlFor="remember-login"
            mb="0"
            ms="1"
            fontWeight="normal"
            color="white"
          >
            Remember me
          </FormLabel>
        </FormControl>
        <Button
          variant="brand"
          fontSize="10px"
          type="submit"
          w="100%"
          maxW="350px"
          h="45"
          mb="20px"
          onClick={handleSubmit}
        >
          SIGN IN
        </Button>
        <AuthFooter />
      </Flex>
    </Flex>
  );
}

export default SignIn;
