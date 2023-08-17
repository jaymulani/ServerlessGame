import React from "react";
import {
  Box,
  Heading,
  Tab,
  TabList,
  Tabs,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import QuestionsPage from "./QuestionsPage";
import GamesPage from "./GamePage";
import Dashboard from "./Dashboard";
import GameCategory from "./GameCategory";
import GameDifficultyLevel from "./GameLevel";
import AINameGenerator from "./AINameGenerator";
import LeaderBoard from "./LeaderBoard";

const Admin = () => {
  return (
    <>
      <Heading as="h1" textAlign="center" mb={4}>
        Trivia Content Management System
      </Heading>
      <Box py={4}>
        <Tabs variant="enclosed" align="center">
          <TabList>
            <Tab>Dashboard</Tab>
            <Tab>Game Categories</Tab>
            <Tab>Game levels</Tab>
            <Tab>Questions</Tab>
            <Tab>Games</Tab>
            <Tab>Show teams</Tab>
            <Tab>LeaderBoard</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Dashboard />
            </TabPanel>
            <TabPanel>
              <GameCategory />
            </TabPanel>
            <TabPanel>
              <GameDifficultyLevel />
            </TabPanel>
            <TabPanel>
              <QuestionsPage />
            </TabPanel>
            <TabPanel>
              <GamesPage />
            </TabPanel>
            <TabPanel>
              <AINameGenerator />
            </TabPanel>
            <TabPanel>
              <LeaderBoard />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default Admin;
