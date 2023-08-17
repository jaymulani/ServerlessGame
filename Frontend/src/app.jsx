import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignupCard from "./pages/userRegistration";
import Login from "./pages/login";
import ForgotPasswordForm from "./pages/forgotPassword";
import EditProfile from "./pages/editProfile";
import SetUpQnA from "./pages/QnA";
import VerifyQnA from "./pages/VerifyQnA";
import Navbar from "./utils/navbar";
import ChatApp from "./Components/bot/ChatApp";
import Admin from "./pages/admin/Admin";
import Logout from "./pages/Logout";
import InviteUsers from "./pages/admin/InviteUsers"
import LeaderBoard from './pages/admin/LeaderBoard'


const App = () => {
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  return (
    <ChakraProvider>
      <BrowserRouter>
        {userEmail && userId && userRole && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignupCard />} />
          <Route path="/forgotpassword" element={<ForgotPasswordForm />} />
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/QnA" element={<SetUpQnA />} />
          <Route path="/verifyQna" element={<VerifyQnA />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/invite/:teamId/:teamName/:userId" element={<InviteUsers />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />

        </Routes>
      </BrowserRouter>
      <ChatApp />
    </ChakraProvider>
  );
};

export default App;
