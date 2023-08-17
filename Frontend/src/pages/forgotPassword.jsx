// Reference: https://chakra-templates.dev/forms/authentication

import React, { useState } from "react";
import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/Firebase";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      //Hanndling Forgot password using Google Firebase
      await auth.sendPasswordResetEmail(email);

      //toast notification to the user
      toast({
        title: "Password Reset Link Sent",
        description: "A password reset link has been sent to your email.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      //navigating to login after successfully sending the password reset mail
      navigate("/login");
    } catch (error) {
      //toast notification to the user for invalid(non-existent email)
      toast({
        title: "Error",
        description: "An error occurred while sending the password reset link.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Forgot your password?
        </Heading>
        <Text
          fontSize={{ base: "sm", sm: "md" }}
          color={useColorModeValue("gray.800", "gray.400")}
        >
          You'll get an email with a reset link
        </Text>
        <FormControl id="email">
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={"blue.400"}
            color={"white"}
            _hover={{ bg: "blue.500" }}
            onClick={handleResetPassword}
          >
            Request Reset
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
