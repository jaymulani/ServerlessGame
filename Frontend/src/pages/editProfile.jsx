//Refernce: https://chakra-ui.com/docs/components/modal
//Refernce: https://chakra-templates.dev/forms/authentication

import React from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Select,
  Avatar,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AWS from "aws-sdk";

export default function UserProfileEdit() {
  const {
    isOpen: isTeamsOpen,
    onOpen: onTeamsOpen,
    onClose: onTeamsClose,
  } = useDisclosure();
  const {
    isOpen: isuserCompOpen,
    onOpen: onuserCompOpen,
    onClose: onuserCompClose,
  } = useDisclosure();

  const toast = useToast();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState(null);
  let [email, setEmail] = useState("");
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [role, setRole] = useState("");
  let [userIcon, setUserIcon] = useState("");
  let [userId, setUserId] = useState("");
  const imageInputRef = useRef(null);
  const location = useLocation();
  const s3 = new AWS.S3();
  const s3BucketName = "user-icon-trivia";
  const [selectedUser, setSelectedUser] = useState(null);
  const [otherUsers, setOtherUsers] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://5r9064zspc.execute-api.us-east-1.amazonaws.com/default/getUsersLambda"
      );
      console.log("Other Users : ", res.data);
      setOtherUsers(
        res.data.filter(
          (user) => user.userId !== localStorage.getItem("userId")
        )
      );
    } catch (err) {
      console.error(err);
    }

    if (
      localStorage.getItem("userId") &&
      localStorage.getItem("userEmail") &&
      localStorage.getItem("userRole")
    ) {
      try {
        const email = localStorage.getItem("userEmail");
        const response = await axios.post(
          "https://k6c7r5v21b.execute-api.us-east-1.amazonaws.com/default/getUserDetails-trivia",
          { email }
        );
        let users = response.data;
        setUsers(users);
        setUserName(users.firstName + " " + users.lastName);
        setUserId(localStorage.getItem("userId"));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      navigate("/login");
    }
  };

  const getUserIcon = async () => {
    const response = await fetch(
      "https://xwpfgwzuuj.execute-api.us-east-1.amazonaws.com/default/getUserIconLambda",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: localStorage.getItem("userEmail") }),
      }
    );
    console.log(response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error === "") {
      console.log("User icon not found");
      return;
    }
    console.log(data);
    const blob = await fetch(`data:image/png;base64,${data.base64}`).then((r) =>
      r.blob()
    );
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      setAvatarUrl(fileReader.result);
    };

    fileReader.readAsDataURL(blob);
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.post(
        "https://2w627hva83.execute-api.us-east-1.amazonaws.com/test/fetchteams",
        { userId: localStorage.getItem("userId") }
      );
      setTeams(response.data.teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  React.useEffect(() => {
    getUserIcon();
    fetchData();
    fetchTeams();
  }, []);

  // Add another useEffect to calculate the comparison data when the selected user changes
  useEffect(() => {
    if (selectedUser) {
      setComparisonData({
        win_loss_ratio: users.win_loss_ratio - selectedUser.win_loss_ratio,
        total_points: users.total_points - selectedUser.total_points,
        games_played: users.games_played - selectedUser.games_played,
      });
    }
  }, [selectedUser]);

  const handleEditProfile = () => {
    console.log(avatarUrl);

    setIsEditing(true);
    document.getElementById("user-name").removeAttribute("readonly");
    document.getElementById("email").removeAttribute("readonly");
    document.getElementById("user-icon").disabled = false;
  };

  const [comparedUser, setComparedUser] = useState(null);

  const handleUserChange = (e) => {
    const user = otherUsers.find((user) => user.userId === e.target.value);
    setSelectedUser(user);
  };

  const handleComparison = () => {
    setComparedUser(selectedUser);
  };

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const buttonBgColor = useColorModeValue("white", "gray.700");
  const [userName, setUserName] = useState(
    users ? users.firstName + " " + users.lastName : ""
  );

  if (users === null) {
    return null;
  }

  // Function to handle clicking on "Submit" button
  const handleSubmit = async () => {
    try {
      console.log(document.getElementById("role").value);

      firstName = document.getElementById("user-name").value.split(" ")[0];
      lastName = document.getElementById("user-name").value.split(" ")[1];
      role = document.getElementById("role").value;
      email = document.getElementById("email").value;
      let response;
      try {
        response = await axios.post(
          "https://m3mjk4dzfc.execute-api.us-east-1.amazonaws.com/default/updateUserDetailsLambda",
          {
            email,
            firstName,
            lastName,
            role,
            userId,
          }
        );
        if (response.status === 200) {
          toast({
            title: "User details updated successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "User details failed to update",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Error updating user details",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "User details failed to update",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }

    setIsEditing(false);
    document.getElementById("user-name").setAttribute("readonly", "");
    document.getElementById("email").setAttribute("readonly", "");
    document.getElementById("user-icon").setAttribute("disable", "true");
  };

  // Function to handle clicking on "Cancel" button
  const handleCancel = () => {
    setIsEditing(false);
    document.getElementById("user-name").setAttribute("readonly", "");
    document.getElementById("email").setAttribute("readonly", "");
  };

  // Function to handle changing user icon
  const handleChangeIcon = () => {
    imageInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(",")[1];

        try {
          const response = await axios.post(
            "https://t9meulfw6g.execute-api.us-east-1.amazonaws.com/default/uploadImageLambda",
            {
              userEmail: users.email,
              base64,
            }
          );

          if (response.status === 200) {
            console.log("File uploaded successfully");
            console.log(response.data);
            setAvatarUrl(response.data.Location);
          } else {
            console.log("Failed to upload the file");
          }
        } catch (error) {
          console.error("Error", error);
        }
      };

      reader.onerror = () => {
        console.error("File could not be read");
      };

      reader.readAsDataURL(selectedImage);
    }
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={bgColor}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={buttonBgColor}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <FormLabel>User Icon</FormLabel>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar size="xl" src={avatarUrl}></Avatar>
            </Center>
            <Center w="full">
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <Button id="user-icon" onClick={handleChangeIcon} w="full">
                Change Icon
              </Button>
            </Center>
          </Stack>
        </FormControl>
        <FormControl id="user-name" isRequired>
          <FormLabel>User name</FormLabel>
          <Input
            isDisabled={!isEditing}
            placeholder="UserName"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </FormControl>
        <FormControl isReadOnly id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            isDisabled={!isEditing}
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
            value={users.email}
            onChange={(e) => setUserName(e.target.value)}
          />
        </FormControl>
        <FormControl isReadOnly id="userId" isRequired>
          <FormLabel>User Id</FormLabel>
          <Input
            isDisabled={!isEditing}
            placeholder="your user Id"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={users.userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </FormControl>
        <FormControl isReadOnly id="no-of-games">
          <FormLabel>Games Played</FormLabel>
          <Input
            isDisabled={!isEditing}
            placeholder="100"
            _placeholder={{ color: "gray.500" }}
            type="text"
            defaultValue={users.games_played}
          />
        </FormControl>
        <FormControl isReadOnly id="win-loss">
          <FormLabel>Win / Loss</FormLabel>
          <Input
            isDisabled={!isEditing}
            placeholder="Win / Loss"
            _placeholder={{ color: "gray.500" }}
            type="text"
            defaultValue={users.win_loss_ratio}
            onChange={(e) => setUserName(e.target.value)}
          />
        </FormControl>
        <FormControl isReadOnly id="total-points">
          <FormLabel>Total Points</FormLabel>
          <Input
            isDisabled={!isEditing}
            placeholder="100"
            _placeholder={{ color: "gray.500" }}
            type="text"
            defaultValue={users.total_points}
            onChange={(e) => setUserName(e.target.value)}
          />
        </FormControl>
        <FormControl id="role">
          <FormLabel>Role</FormLabel>
          <Input
            isDisabled={!isEditing}
            isReadOnly
            placeholder="Player"
            _placeholder={{ color: "gray.500" }}
            type="text"
            defaultValue={users.role}
            onChange={(e) => setUserName(e.target.value)}
          />
        </FormControl>
        <FormControl onClick={onTeamsOpen} isReadOnly id="teams">
          <FormLabel>Team Affliations</FormLabel>
          <Input
            cursor="pointer"
            placeholder="Click here to get team affiliations of the user"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl
          onClick={onuserCompOpen}
          isReadOnly
          id="achievement-comparison"
        >
          <FormLabel>Achievement comparison</FormLabel>
          <Input
            cursor="pointer"
            placeholder="Click here to compare achievements with a user"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>

        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            display={isEditing ? "block" : "none"}
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            display={isEditing ? "block" : "none"}
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
            onClick={handleSubmit} // Call the function to handle submit
          >
            Submit
          </Button>
          <Button
            display={isEditing ? "none" : "block"}
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
            onClick={handleEditProfile} // Call the function to handle edit profile
          >
            Edit Profile
          </Button>
        </Stack>
      </Stack>
      <Modal onClose={onTeamsClose} isOpen={isTeamsOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User's affiliated teams list</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ul>
              {teams.map((team, index) => (
                <li key={index}>{team.team_name}</li>
              ))}
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onTeamsClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isuserCompOpen} onClose={onuserCompClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Compare Your Performance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>Select User</FormLabel>
            <Select
              placeholder="Select a user you want to compare your performance with"
              onChange={handleUserChange}
            >
              {otherUsers.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </Select>
            <Button
              marginTop="10px"
              bg={"blue.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
              onClick={handleComparison}
            >
              Compare
            </Button>
            {comparedUser && (
              <Table variant="simple" marginTop="10px">
                <Thead>
                  <Tr>
                    <Th>Parameter</Th>
                    <Th>Your Achievement</Th>
                    <Th>Compared User Achievement</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Total Points</Td>
                    <Td>{users.total_points}</Td>
                    <Td>{comparedUser.total_points}</Td>
                  </Tr>
                  <Tr>
                    <Td>Games Played</Td>
                    <Td>{users.games_played}</Td>
                    <Td>{comparedUser.games_played}</Td>
                  </Tr>
                </Tbody>
              </Table>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onuserCompClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
