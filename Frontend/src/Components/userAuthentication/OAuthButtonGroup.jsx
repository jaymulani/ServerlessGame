//Refernce: https://pro.chakra-ui.com/components/application/authentication

import { Button, ButtonGroup, VisuallyHidden } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { GoogleIcon, FacebookIcon } from "./ProviderIcons";
import axios from "axios";

const {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} = require("firebase/auth");
const { auth } = require("../../utils/Firebase");

const providers = [
  {
    name: "Google",
    icon: <GoogleIcon boxSize="5" />,
  },
  {
    name: "Facebook",
    icon: <FacebookIcon boxSize="5" />,
  },
];

export const OAuthButtonGroup = () => {
  const navigate = useNavigate();

  const handleOAuthSignIn = async (name) => {
    try {
      let provider;

      if (name === "Google") {
        provider = new GoogleAuthProvider();
      } else if (name === "Facebook") {
        provider = new FacebookAuthProvider();
      }

      signInWithPopup(auth, provider).then(async (result) => {
        let enteredEmail = result.user.email;
        let name = result.user.displayName.split(" ");
        let enteredFirstName = name[0];
        let enteredLastName = name[1];
        let enteredRole = "player";
        let enteredUserId = result.user.email.split("@")[0];
        console.log(result.user);

        // Fetch data from the backend
        try {
          const response = await axios.post(
            "https://k6c7r5v21b.execute-api.us-east-1.amazonaws.com/default/getUserDetails-trivia",
            { email: enteredEmail }
          );
          let users = response.data;
          // If user exists, navigate to '/verifyQna'
          console.log(users.email == enteredEmail);
          if (users.email == enteredEmail) {
            navigate("/verifyQna", {
              state: { email: enteredEmail },
            });
          }
          // If user doesn't exist, navigate to '/QnA'
          else {
            navigate("/QnA", {
              state: {
                enteredEmail,
                enteredFirstName,
                enteredLastName,
                enteredRole,
                enteredUserId,
              },
            });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      });
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };

  return (
    <ButtonGroup variant="secondary" spacing="4" width="full">
      {providers.map(({ name, icon }) => (
        <Button key={name} width="full" onClick={() => handleOAuthSignIn(name)}>
          <VisuallyHidden>Sign in with {name}</VisuallyHidden>
          {icon}
        </Button>
      ))}
    </ButtonGroup>
  );
};
