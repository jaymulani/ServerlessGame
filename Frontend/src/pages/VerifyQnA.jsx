import React, { useState } from "react";
import axios from "axios";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

// Security questions for the user
const questions = [
  "Question 1: What is your favorite color?",
  "Question 2: What is your pet's name?",
  "Question 3: Where were you born?",
];

export default function VerifyQnA() {
  const location = useLocation();
  const email = location.state.email;

  const [verificationResult, setVerificationResult] = useState("");
  const [answers, setAnswers] = useState(Array(3).fill(""));
  const toast = useToast();
  const handleAnswerChange = (index, event) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = event.target.value;
    setAnswers(updatedAnswers);
  };
  const navigate = useNavigate();

  // Function to update answer state
  const handleVerifyAnswers = async () => {
    try {
      const response = await axios.post(
        "https://h96mxp03ph.execute-api.us-east-1.amazonaws.com/default/verifyQnAUser",
        {
          email: email,
          answer1: answers[0],
          answer2: answers[1],
          answer3: answers[2],
        }
      );

      // Handle the verification result
      const { verified } = response.data;
      if (verified) {
        toast({
          title: "User logged in successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        try {
          const email = location.state.email;
          const response = await axios.post(
            "https://k6c7r5v21b.execute-api.us-east-1.amazonaws.com/default/getUserDetails-trivia",
            { email }
          );
          console.log("users : " + response);
          let users = response.data;
          const userId = users.userId;
          const userRole = users.role;

          console.log("user Role : " + userRole);
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userId", userId);
          localStorage.setItem("userRole", userRole);
          console.log("user Role : " + userRole);
          navigate("/editProfile");

          // If verified, store user details and navigate to editProfile, else showing error toast
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        toast({
          title: "Incorrect security answers. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      setVerificationResult(
        verified ? "Answers verified" : "Answers not verified"
      );
    } catch (error) {
      console.log("Error verifying answers:", error);
    }
  };

  return (
    <>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Set Up 2-Factor Authentication
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              {questions.map((question, index) => (
                <FormControl key={index} id={`answer-${index + 1}`} isRequired>
                  <FormLabel>{question}</FormLabel>
                  <Input
                    type="text"
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e)}
                  />
                </FormControl>
              ))}
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={handleVerifyAnswers}
                >
                  Save Answers
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
      <button onClick={handleVerifyAnswers}>Verify Answers</button>
      <p>{verificationResult}</p>
    </>
  );
}
