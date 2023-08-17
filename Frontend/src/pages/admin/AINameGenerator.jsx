
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
  Box,
} from '@chakra-ui/react';
const userId = localStorage.getItem("userId");

// const userId = 'steve12';


const TeamCard = ({ teamName, teamId   }) => {
  return (
    <div style={{ backgroundColor: 'lightgrey', marginBottom: '10px' }}>
    <Box
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p={4}
      width="100%"
      minHeight="100px"
    >
      <Heading size="md" mb={2}>
        {teamName}
      </Heading>
      <Link to={`/invite/${teamId}/${teamName}/${userId}`}>
        <Button colorScheme="blue">Edit</Button>
      </Link>
    </Box>
    </div>
  );
};


const TeamList = ({ teams }) => {
  return (
    <Stack direction="column" spacing={4}>
      {teams.map((team, index) => (
        <TeamCard key={index} teamName={team.team_name} teamId={team.id} />
      ))}
    </Stack>
  );
};

const AINameGenerator = () => {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const fetchTeams = async () => {
    try {
      const response = await axios.post('https://2w627hva83.execute-api.us-east-1.amazonaws.com/test/fetchteams', {
        userId: userId,
      });

      if (response.status === 200) {
        const data = response.data;
        setTeams(data.teams);
      } else {
        console.error('Failed to fetch teams:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };
  const generateTeamName = () => {
    axios
      .get('https://random-word-api.herokuapp.com/word?number=1')
      .then((response) => {
        const name = response.data.join(' ');
        setTeamName(name);
        axios
          .post('https://2w627hva83.execute-api.us-east-1.amazonaws.com/test/insertteam', {
            teamName: name,
            userId: userId,
          })
          .then((response) => {
            console.log('Team inserted successfully:', response.data);
            alert("Team inserted successfully");
            fetchTeams();
          })
          .catch((error) => {
            console.log('Error inserting team:', error);
            fetchTeams();
          });
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };
  
  useEffect(() => {
    

    fetchTeams();
    
  }, []);

  return (
    <div>
<div>
</div>

    <Container maxW="xl" py={8}>
      {/* <div style={{ backgroundColor: 'lightgrey', marginBottom: '20px', width: '3px', height: '150px' }}> */}
      <Button style={{ backgroundColor: 'lightblue', marginBottom: '20px', width: '250px', height: '75px' }} fontSize="2xl" onClick={generateTeamName}>
        Generate Team Name
      </Button>
      {/* </div> */}
      <br/>
      <br/>
      <Heading mt={8} mb={4} size="xl">
        Team List
      </Heading>
      <br/>
      <TeamList teams={teams} />
    </Container>
    </div>
  );
};

export default AINameGenerator;
