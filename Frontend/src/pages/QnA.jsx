import React, { useState } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const questions = [
  "Question 1: What is your favorite color?",
  "Question 2: What is your pet's name?",
  "Question 3: Where were you born?",
];

export default function SetUpQnA() {
  const location = useLocation();
  const firstName = location.state.enteredFirstName;
  const lastName = location.state.enteredLastName;
  const role = location.state.enteredRole;
  const userEmail = location.state.enteredEmail;
  const userId = location.state.userId;

  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(3).fill(""));
  const toast = useToast();

  const handleAnswerChange = (index, event) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = event.target.value;
    setAnswers(updatedAnswers);
  };

  const handleSaveAnswers = async () => {
    try {
      const qnaData = {};
      questions.forEach((question, index) => {
        qnaData[question] = answers[index];
      });
      console.log(userId);
      let email = userEmail;
      let games_played = 0;
      let win_loss_ratio = 0;
      let total_points = 0;
      await axios.post(
        "https://3www0k6zb2.execute-api.us-east-1.amazonaws.com/default/saveQnaLambda",
        {
          //{
          email,
          firstName,
          lastName,
          role,
          qnaData,
          games_played,
          win_loss_ratio,
          total_points,
          userId,
          //},
        }
      );
      toast({
        title: "User registered successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      console.log("Error saving QnA answers:", error);
    }
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
                onClick={handleSaveAnswers}
              >
                Save Answers
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
