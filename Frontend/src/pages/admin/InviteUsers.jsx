
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Box, Button, Input, ListItem, UnorderedList ,Stat,
//   StatLabel,
//   StatNumber,
//   StatHelpText,
//   StatArrow,
//   StatGroup,
//   Divider,} from '@chakra-ui/react';
// import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
// import { useParams } from 'react-router-dom';
// import GameDropdown from './GameDropdown'; // Replace './GameDropdown' with the correct path to your GameDropdown component


// function InviteUsers() {
//   const [invitedUsers, setInvitedUsers] = useState([]);
//   const [email, setEmail] = useState('');
//   const { teamId, teamName, userId } = useParams();
//   const mainUserId = userId;
//   const [teamDetails, setTeamDetails] = useState(null);
//   const [gamesData, setGamesData] = useState([]); // State variable to hold games data
//   const [selectedGame, setSelectedGame] = useState(''); // State variable to hold the selected game ID
//   const [teamData, setTeamData] = useState({
//     teamId: teamId,
//     gameId: '',
//     invitedUsers: [],
//     timeStamp:''
//   });
  


//   const sendInvitation = async () => {
//     try {
//       const response = await axios.post('https://2w627hva83.execute-api.us-east-1.amazonaws.com/test/createteam', {
//         email: email,
//         userId: userId,
//         teamId: teamId,
//       });

//       if (response.status === 200) {
//         if (response.data === 'no') {
//           alert('User does not exist');
//           setEmail('');
          
//         } else {
//           alert('Invitation sent Successfully');
//           setEmail('');
//         }
//         console.log(response.data);
//       } else {
//         console.error('Failed to send invitation');
//       }
//     } catch (error) {
//       console.error('Failed to send invitation:', error);
//     }
//   };

//   const deleteInvitation = async (userId) => {
//     try {
//       const response = await axios.post('https://ewfh5bupzi.execute-api.us-east-1.amazonaws.com/user/deleteuser', {
//         teamId: teamId,
//         userId: userId,
//         mainUserId: mainUserId,
//       });
//       if (response.status === 200) {
//         alert(response.data.message);
//         console.log(response);
//         setInvitedUsers(invitedUsers.filter((user) => user.userId !== userId));
//       } else {
//         console.error('Failed to delete invitation');
//       }
//     } catch (error) {
//       console.error('Failed to delete invitation:', error);
//     }
//   };

//   useEffect(() => {
//     const fetchInvitedUsers = async () => {
//       try {
//         const response = await axios.post(`https://ewfh5bupzi.execute-api.us-east-1.amazonaws.com/user/getteamusers`, {
//           teamId: teamId,
//         });

//         if (response.status === 200) {
//           const data = response.data;
//           setInvitedUsers(data);
//           setTeamData((prevData) => ({
//             ...prevData,
//             invitedUsers: 
           
//               data
//             ,
//           }));
//         } else {
//           console.error('Failed to fetch invited users:', response.status);
//         }
//       } catch (error) {
//         console.error('Failed to fetch invited users:', error);
//       }

//       const re = await axios.get('https://wz623cin89.execute-api.us-east-1.amazonaws.com/dev/tstatsm3?id='+teamId);
//       setTeamDetails(re.data);
//     };

//     fetchInvitedUsers();
//   }, []);

//   useEffect(() => {
//     const fetchGamesData = async () => {
//       try {
//         const response = await axios.get('https://mdlbsby4nd.execute-api.us-east-1.amazonaws.com/dev/games');

//         if (response.status === 200) {
//           setGamesData(response.data);
//         } else {
//           console.error('Failed to fetch games data:', response.status);
//         }
//       } catch (error) {
//         console.error('Failed to fetch games data:', error);
//       }
//     };

//     fetchGamesData();
//   }, []);


//   const handleSelectGame = (gameId) => {
//     setSelectedGame(gameId);
//     setTeamData((prevData) => ({
//       ...prevData,
//       gameId: gameId,
//     }));
//   };

//   const log = async () => {
//     try {
//       const response = await axios.post('https://mdlbsby4nd.execute-api.us-east-1.amazonaws.com/dev/gameteam', teamData);
//     if (response.status === 200) {
//       alert('Successfully subscribed to game...');
//       // Do something with the response if needed
//     } else {
//       console.error('Failed to post teams data');
//     }
// console.log(teamData)
//     const rep = await axios.post('https://x0hufprm4e.execute-api.us-east-1.amazonaws.com/dev/sendEmailToUsers', JSON.stringify(teamData));

//     if (response.status === 200) {
//       alert('Successfully subscribed to game...');
//       // Do something with the response if needed
//     } else {
//       console.error('Failed to post teams data');
//     }


//     } catch (error) {
      
//     }
//     console.log(teamData)
//   };
//   return (
//     <div>
//     <Box p={4}>
//       <br />
//       <br />
//       <br />
//       <Input
//         type="email"
//         placeholder="Enter email address"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <Button onClick={sendInvitation} colorScheme="blue" my={4}>
//         Send Invitation
//       </Button>
//       <br/>
//       <GameDropdown games={gamesData} onSelectGame={handleSelectGame} selectedGameId={selectedGame} />

//       <Button onClick={log} colorScheme="red" my={4} style={{ margin: '25px' }}>
//       Subscribe to Game
//       </Button>
//       {/* <Input
//         type="email"
//         placeholder="Enter email address"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       /> */}
//       <UnorderedList>
//       <h1 style={{ fontSize: '2em' }}>Team Users</h1>

//         {invitedUsers.map((user) => (
          
//           <Box key={user.userId} borderWidth="1px" borderRadius="lg" p={4} boxShadow="md" my={4}>
//             <div style={{ backgroundColor: 'lightgrey', marginBottom: '10px' }}>
//             <ListItem>
//               <b>Email</b>: {user.receiverEmail}
//               <br/>
//               <b>Name</b>: {user.username}
//               <br/>
//               {user.userId === mainUserId ? (
//                 <Button colorScheme="red" onClick={() => deleteInvitation(user.userId)}>
//                   Leave Team
//                 </Button>
//               ) : (
//                 <Button colorScheme="red" onClick={() => deleteInvitation(user.userId)}>
//                   Delete
//                 </Button>
//               )}
//             </ListItem>
//             </div>
//           </Box>
//         ))}
//       </UnorderedList>

//     </Box>
//     <div>
//       <br/>
//       <br/>
//     <h1 style={{ fontSize: '2em' }}>Team Statistics</h1>
//   {teamDetails && (
//     <Box borderWidth="4px" borderRadius="lg" p={4} boxShadow="md" my={4}>
//       <div style={{ backgroundColor: ' #ffd6cc', marginBottom: '10px' }}>
//         <p><b>Team Name:</b> {teamDetails.team_name}</p>
//         <p><b>Win/Loss Ratio:</b> {teamDetails.win_loss_ratio}</p>
//         <p><b>Time Stamp:</b> {teamDetails.timeStamp}</p>
//         <p><b>Team ID:</b> {teamDetails.id}</p>
//         <p><b>Games Played:</b> {teamDetails.games_played}</p>
//         <p><b>Total Points Earned:</b> {teamDetails.total_points_earned}</p>
//       </div>
//     </Box>
//   )}
// </div>

//     </div>
    
//   );
// }

// export default InviteUsers;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Input, ListItem, UnorderedList ,Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Divider,} from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { useParams } from 'react-router-dom';
import GameDropdown from './GameDropdown'; // Replace './GameDropdown' with the correct path to your GameDropdown component

function InviteUsers() {
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [email, setEmail] = useState('');
  const { teamId, teamName, userId } = useParams();
  const mainUserId = userId;
  const [teamDetails, setTeamDetails] = useState(null);
  const [gamesData, setGamesData] = useState([]); // State variable to hold games data
  const [selectedGame, setSelectedGame] = useState(''); // State variable to hold the selected game ID
  const [teamData, setTeamData] = useState({
    teamId: teamId,
    gameId: '',
    invitedUsers: [],
    timeStamp:''
  });
  

  const sendInvitation = async () => {
    try {
      const response = await axios.post('https://2w627hva83.execute-api.us-east-1.amazonaws.com/test/createteam', {
        email: email,
        userId: userId,
        teamId: teamId,
      });

      if (response.status === 200) {
        if (response.data === 'no') {
          alert('User does not exist');
          setEmail('');
          
        } else {
          alert('Invitation sent Successfully');
          setEmail('');
        }
        console.log(response.data);
      } else {
        console.error('Failed to send invitation');
      }
    } catch (error) {
      console.error('Failed to send invitation:', error);
    }
  };

  const deleteInvitation = async (userId) => {
    try {
      const response = await axios.post('https://ewfh5bupzi.execute-api.us-east-1.amazonaws.com/user/deleteuser', {
        teamId: teamId,
        userId: userId,
        mainUserId: mainUserId,
      });
      if (response.status === 200) {
        alert(response.data.message);
        console.log(response);
        setInvitedUsers(invitedUsers.filter((user) => user.userId !== userId));
      } else {
        console.error('Failed to delete invitation');
      }
    } catch (error) {
      console.error('Failed to delete invitation:', error);
    }
  };

  useEffect(() => {
    const fetchInvitedUsers = async () => {
      try {
        const response = await axios.post(`https://ewfh5bupzi.execute-api.us-east-1.amazonaws.com/user/getteamusers`, {
          teamId: teamId,
        });

        if (response.status === 200) {
          const data = response.data;
          setInvitedUsers(data);
          setTeamData((prevData) => ({
            ...prevData,
            invitedUsers: 
           
              data
            ,
          }));
        } else {
          console.error('Failed to fetch invited users:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch invited users:', error);
      }

      const re = await axios.get('https://wz623cin89.execute-api.us-east-1.amazonaws.com/dev/tstatsm3?id='+teamId);
      setTeamDetails(re.data);
    };

    fetchInvitedUsers();
  }, []);

  useEffect(() => {
    const fetchGamesData = async () => {
      try {
        const response = await axios.get('https://je9q7ypm4m.execute-api.us-east-1.amazonaws.com/dev/games');

        if (response.status === 200) {
          setGamesData(response.data);
        } else {
          console.error('Failed to fetch games data:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch games data:', error);
      }
    };

    fetchGamesData();
  }, []);

  const handleSelectGame = (gameId) => {
    setSelectedGame(gameId);
    setTeamData((prevData) => ({
      ...prevData,
      gameId: gameId,
    }));
  };

  const log = async () => {
    try {
      const response = await axios.post('https://mdlbsby4nd.execute-api.us-east-1.amazonaws.com/dev/gameteam', teamData);
    if (response.status === 200) {
      alert('Successfully subscribed to game...');
      // Do something with the response if needed
    } else {
      console.error('Failed to post teams data');
    }
console.log(teamData)
    const rep = await axios.post('https://x0hufprm4e.execute-api.us-east-1.amazonaws.com/dev/sendEmailToUsers', JSON.stringify(teamData));

    if (response.status === 200) {
      alert('Successfully subscribed to game...');
      // Do something with the response if needed
    } else {
      console.error('Failed to post teams data');
    }

    } catch (error) {
      
    }
    console.log(teamData)
  };
  return (
    <div>
    <Box p={4}>
      <br />
      <br />
      <br />
      <Input
        type="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={sendInvitation} colorScheme="blue" my={4}>
        Send Invitation
      </Button>
      <br/>
      <GameDropdown games={gamesData} onSelectGame={handleSelectGame} selectedGameId={selectedGame} />

      <Button onClick={log} colorScheme="red" my={4} style={{ margin: '25px' }}>
      Subscribe to Game
      </Button>
      {/* <Input
        type="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /> */}
      <UnorderedList>
      <h1 style={{ fontSize: '2em' }}>Team Users</h1>

        {invitedUsers.map((user) => (
          
          <Box key={user.userId} borderWidth="1px" borderRadius="lg" p={4} boxShadow="md" my={4}>
            <div style={{ backgroundColor: 'lightgrey', marginBottom: '10px' }}>
            <ListItem>
              <b>Email</b>: {user.receiverEmail}
              <br/>
              <b>Name</b>: {user.username}
              <br/>
              {user.userId === mainUserId ? (
                <Button colorScheme="red" onClick={() => deleteInvitation(user.userId)}>
                  Leave Team
                </Button>
              ) : (
                <Button colorScheme="red" onClick={() => deleteInvitation(user.userId)}>
                  Delete
                </Button>
              )}
            </ListItem>
            </div>
          </Box>
        ))}
      </UnorderedList>

    </Box>
    <div>
      <br/>
      <br/>
    <h1 style={{ fontSize: '2em' }}>Team Statistics</h1>
  {teamDetails && (
    <Box borderWidth="4px" borderRadius="lg" p={4} boxShadow="md" my={4}>
      <div style={{ backgroundColor: ' #ffd6cc', marginBottom: '10px' }}>
        <p><b>Team Name:</b> {teamDetails.team_name}</p>
        <p><b>Win/Loss Ratio:</b> {teamDetails.win_loss_ratio}</p>
        <p><b>Time Stamp:</b> {teamDetails.timeStamp}</p>
        <p><b>Team ID:</b> {teamDetails.id}</p>
        <p><b>Games Played:</b> {teamDetails.games_played}</p>
        <p><b>Total Points Earned:</b> {teamDetails.total_points_earned}</p>
      </div>
    </Box>
  )}
</div>

    </div>
    
  );
}

export default InviteUsers;

