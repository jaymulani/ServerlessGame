import {
  Box,
} from '@chakra-ui/react';



const Dashboard = () => {
  let reactDashBoardUrl = process.env.REACT_APP_DASHBOARD_URL || "https://lookerstudio.google.com/embed/reporting/bc16bfa7-74ea-4624-a779-00ef03e63f11/page/WciYD"

  const DisplayFrame = () => {
    return (
      <Box
        w="100vw"
        h="100vh"
      >
        <iframe
          title="dashboard"
          src={reactDashBoardUrl}
          allowFullScreen
          width="90%"
          height="90%"
        />
      </Box>
    )
  }
  return (
    <div>
      <DisplayFrame />
    </div>
  );
}

export default Dashboard;
