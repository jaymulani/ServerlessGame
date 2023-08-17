import { Box, Flex, Input, Button, Avatar, Text, IconButton, useDisclosure, Link } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { BsChatDots } from "react-icons/bs";

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const { isOpen, onToggle } = useDisclosure();
  const chatContainerRef = useRef(null);
  const botUrl = process.env.REACT_APP_BOT_URL || "/bot"
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (inputText.trim() !== "") {
      const userMessage = {
        reply: inputText,
        timestamp: new Date().toLocaleTimeString(),
        isUser: true,
      };
      const botMessage = {
        ...await generateBotResponse(inputText),
        timestamp: new Date().toLocaleTimeString(),
        isUser: false,
      };
      setMessages([...messages, userMessage, botMessage]);
      setInputText("");
    }
  };

  const generateBotResponse = async (userMessage) => {
    try {
      let resp = await fetch(botUrl, {
        method: "post",
        mode: "cors",
        body: JSON.stringify({
          message: userMessage
        })
      }
      );
      console.log(resp)
      if (resp.ok) {
        let data = await resp.json()
        console.log(data)
        return data
      }
      else {
        console.log("error - ", JSON.stringify(resp))
        return "Unable to fetch response."
      }
    } catch (e) {
      console.log("Error - ", e)
      return "Unable to fetch response."
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFloatingButtonClick = () => {
    onToggle();
    setInputText("");
  };

  return (
    <>
      <IconButton
        icon={<BsChatDots />}
        position="fixed"
        bottom="20px"
        right="20px"
        size="lg"
        colorScheme="blue"
        onClick={handleFloatingButtonClick}
        zIndex="999"
      />
      {isOpen && (
        <Box
          border="1px"
          position="fixed"
          bottom="80px"
          right="20px"
          bg="white"
          boxShadow="lg"
          borderRadius="lg"

          overflow="hidden"
          width="350px"
          height="400px"
        >
          <Flex flexDirection="column" height="100%">
            <Box flex="1" overflowY="scroll" p={4} ref={chatContainerRef}>
              {messages.map((message, index) => (
                <Flex key={index} mb={4} flexDirection={message.isUser ? "row-reverse" : "row"}>
                  <Avatar name={message.isUser ? "User" : "Chatbot"} size="sm" mr={2} />
                  <Box>
                    <Text fontSize="sm" fontWeight="bold">
                      {message.isUser ? "User" : "Chatbot"}
                    </Text>
                    {
                      message.link ?
                        <Link href={message.link} isExternal>
                          {message.reply}
                        </Link>
                        : <Text fontSize="sm">{message.reply}</Text>
                    }
                    <Text fontSize="xs" color="gray.500">
                      {message.timestamp}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Box>
            <Flex flexDirection="row-reverse"><Text fontSize='xs'>This conversation has {messages.length} messages</Text></Flex>
            <Flex p={4} borderTopWidth="1px">
              <Input
                flex="1"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                mr={2}
              />
              <Button colorScheme="blue" onClick={handleSendMessage}>
                Send
              </Button>
            </Flex>
          </Flex>
        </Box>
      )}
    </>
  );
}

export default ChatApp
