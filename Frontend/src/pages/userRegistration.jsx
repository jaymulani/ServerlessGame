//Refernce: https://pro.chakra-ui.com/components/application/authentication

import React, { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Divider,
  Select,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { OAuthButtonGroup } from "../Components/userAuthentication/OAuthButtonGroup";
import { useNavigate } from "react-router-dom";
import { firebase, auth } from "../utils/Firebase";
import "firebase/compat/auth";
import SetUpQnA from "../pages/QnA";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const enteredFirstName = document.getElementById("firstName").value;
      const enteredLastName = document.getElementById("lastName").value;
      const enteredEmail = document.getElementById("email").value;
      const enteredPassword = document.getElementById("password").value;
      const enteredRole = document.getElementById("role").value;
      const userId = document.getElementById("userId").value;
      console.log(userId+"userId")
      // Create the user with email and password using Firebase Authentication
      await auth.createUserWithEmailAndPassword(enteredEmail, enteredPassword);

      setFirstName(enteredFirstName);
      setLastName(enteredLastName);
      setUserEmail(enteredEmail);
      setRole(enteredRole);
      setRole(userId);

      navigate("/QnA", {
        state: {
          enteredEmail,
          enteredFirstName,
          enteredLastName,
          enteredRole,
          userId,
        },
      });
    } catch (error) {
      console.log("Error during signup:", error);
      // Handle signup error, show error message, etc.
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" id="firstName" />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName" isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" id="lastName" />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" id="email" />
            </FormControl>
            <FormControl id="userId" isRequired>
              <FormLabel>User Id</FormLabel>
              <Input type="text" id="userId" />
            </FormControl>
            <FormControl id="role" isRequired>
              <FormLabel>Role</FormLabel>
              <Select id="role">
                <option value="host">Host</option>
                <option value="player">Player</option>
              </Select>
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link color={"blue.400"} onClick={handleLoginClick}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
          <Stack spacing="6" paddingTop="10px">
            <HStack>
              <Divider />
              <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                or continue with
              </Text>
              <Divider />
            </HStack>
            <OAuthButtonGroup />
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
