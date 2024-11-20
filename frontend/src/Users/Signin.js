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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Toast for notifications
  const toast = useToast();
  const history = useHistory();

  // User credentials with roles
  const userCredentials = {
    "superuser@example.com": { password: "superuser123", role: "superuser" },
    "retailcrew@example.com": { password: "retailcrew123", role: "retailcrew" },
    "receiver@example.com": { password: "receiver123", role: "receiver" },
    "manager@example.com": { password: "manager123", role: "manager" },
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // const email = e.target.email.value;
    // const password = e.target.password.value;

    // Check if email exists in userCredentials and password matches
    if (
      userCredentials[email] &&
      userCredentials[email].password === password
    ) {
      const userRole = userCredentials[email].role;

      toast({
        title: "Login Successful",
        description: `Welcome, ${userRole}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redirect based on role
      if (userRole === "superuser") {
        history.push("/Superuser/Dashboard");
      } else if (userRole === "retailcrew") {
        history.push("/Retailcrew/Dashboard");
      } else if (userRole === "receiver") {
        history.push("/Receiver/Dashboard");
      } else if (userRole === "manager") {
        history.push("/Manager/Dashboard");
      }
    } else {
      toast({
        title: "Invalid Credentials",
        description: "Please check your email and password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="rgb(19,21,54)" position="relative">
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
        <Heading color={titleColor} fontSize="32px" mb="20px" textAlign="center">
          Nice to see you!
        </Heading>
        <Text color={textColor} fontWeight="bold" fontSize="14px" mb="36px">
          Enter your username and password to sign in 
        </Text>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="normal" color="white">
            Username
          </FormLabel>
          <GradientBorder borderRadius="20px" mb="24px">
            <Input
              color="white"
              bg="rgb(19,21,54)"
              border="transparent"
              borderRadius="20px"
              fontSize="sm"
              size="lg"
              placeholder="Your email address"
              value={email}
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
          <FormLabel htmlFor="remember-login" mb="0" ms="1" fontWeight="normal" color="white">
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
