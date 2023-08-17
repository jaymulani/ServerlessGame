//Refrence: https://pro.chakra-ui.com/components/application/authentication

import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../Components/userAuthentication/Logo";
import { PasswordField } from "../Components/userAuthentication/PasswordField";
import { OAuthButtonGroup } from "../Components/userAuthentication/OAuthButtonGroup";
const { auth } = require("../utils/Firebase");

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = new useToast();
  const handleLogin = async () => {
    try {
      //sign in using Google Firebase
      await auth.signInWithEmailAndPassword(email, password);

      // Authentication successful
      toast({
        title: "Login successful",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      //navigating to verifyQnA page after successfull login
      navigate("/verifyQnA", {
        state: { email },
      });
    } catch (error) {
      toast({
        title: "Incorrect username or password.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleForgotPasswordClick = () => {
    navigate("/forgotPassword");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <Container
      maxW="lg"
      py={{
        base: "12",
        md: "24",
      }}
      px={{
        base: "0",
        sm: "8",
      }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <Logo />
          <Stack
            spacing={{
              base: "2",
              md: "3",
            }}
            textAlign="center"
          >
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Log in to your account
            </Heading>
            <HStack spacing="1" justify="center">
              <Text color="fg.muted">Don't have an account?</Text>
              <Button
                variant="text"
                size="lg"
                color={"blue.500"}
                onClick={handleSignUp}
              >
                Sign up
              </Button>
            </HStack>
          </Stack>
        </Stack>
        <Box
          py={{
            base: "0",
            sm: "8",
          }}
          px={{
            base: "4",
            sm: "10",
          }}
          bg={{
            base: "transparent",
            sm: "bg.surface",
          }}
          boxShadow={{
            base: "none",
            sm: "md",
          }}
          borderRadius={{
            base: "none",
            sm: "xl",
          }}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Stack>
            <HStack justify="space-between">
              <Checkbox defaultChecked>Remember me</Checkbox>
              <Button
                variant="text"
                size="sm"
                onClick={handleForgotPasswordClick}
              >
                Forgot password?
              </Button>
            </HStack>
            <Stack spacing="6">
              <Button
                variant="primary"
                size="lg"
                loadingText="Submitting"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleLogin}
              >
                Sign in
              </Button>
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
    </Container>
  );
};

export default Login;
