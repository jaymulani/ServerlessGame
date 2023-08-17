import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Table,
    Tbody,
    Td,
    Select,
    Th,
    Thead,
    Grid,
    Heading,
    Tr,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter
} from '@chakra-ui/react';

const adminUrl = process.env.REACT_APP_ADMIN_URL || 'https://mdlbsby4nd.execute-api.us-east-1.amazonaws.com/dev';
const gameNotification = process.env.REACT_APP_GAME_NOTIFICATION || 'https://31bk5umtd4.execute-api.us-east-1.amazonaws.com/v1/team-broadcast'

const GamesPage = () => {
    const [categories, setCategories] = useState([]);
    const [difficultyLevels, setDifficultyLevels] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedDescription, setSelectedDescription] = useState('')
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [isQuestionListOpen, setIsQuestionListOpen] = useState(false);
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false)
    let isCreateButtonDisabled = !selectedCategory || !selectedDescription || !selectedDifficulty || selectedQuestions.length === 0;


    const fetchCategories = () => {
        fetch(adminUrl + '/categorys')
            .then((res) => res.json())
            .then((data) => setCategories(data));
    };

    const fetchDifficultyLevels = () => {
        fetch(adminUrl + '/difficultys')
            .then((res) => res.json())
            .then((data) => setDifficultyLevels(data));
    };

    const fetchQuestions = () => {
        fetch(adminUrl + '/questions')
            .then((res) => res.json())
            .then((data) => setQuestions(data));
    };

    const fetchGames = () => {
        fetch(adminUrl + '/games')
            .then((res) => res.json())
            .then((data) => setGames(data));
    };

    useEffect(() => {
        fetchCategories();
        fetchDifficultyLevels();
        fetchQuestions();
        fetchGames();
    }, []);

    const handleCreateGame = () => {
        const newGame = {
            category: selectedCategory,
            difficulty: selectedDifficulty,
            description: selectedDescription,
            questions: selectedQuestions.map((question) => question.id),
        };

        fetch(adminUrl + '/game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newGame),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                triggerNotification(data)
                setGames((prevGames) => [...prevGames, data]);
            })
            .then(closeForm)
            .catch((error) => {
                console.error('Error creating game:', error);
            });
    };

    const handleQuestionSelect = (questionId) => {
        const question = questions.find((q) => q.id === questionId);
        if (selectedQuestions.some((q) => q.id === questionId)) {
            setSelectedQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== questionId));
        } else {
            setSelectedQuestions((prevQuestions) => [...prevQuestions, question]);
        }
    };

    const openDeleteConfirmation = (game) => {
        setSelectedGame(game);
        setIsDeleteConfirmationOpen(true);
    };

    const closeDeleteConfirmation = () => {
        setSelectedGame(null);
        setIsDeleteConfirmationOpen(false);
    };

    const handleDeleteGame = () => {
        fetch(adminUrl + '/game/delete/' + selectedGame.id, {
            method: 'GET',
        })
            .then(() => {
                setGames((prevGames) => prevGames.filter((game) => game.id !== selectedGame.id));
                closeDeleteConfirmation();
            })
            .catch((error) => {
                console.error('Error deleting game:', error);
            });
    };

    const handleEditGame = (game) => {
        setSelectedGame(game);
        console.log(selectedGame)
        setSelectedCategory(game.category);
        setSelectedDifficulty(game.difficulty);
        setSelectedDescription(game.description);
        setSelectedQuestions(game.questions.map((questionId) => questions.find((q) => q.id === questionId)));
        setIsQuestionListOpen(false);
        setIsEditMode(true);
    }

    const triggerNotification = (game) => {
        fetch(gameNotification, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "FilterName": "GameAvailability",
                "EmailTopic": "New Game is Created!",
                "Message": `Hi,\nThis is to inform that there is a new game created with the category as ${game.category} and with ${game.difficulty} difficulty level with the context as ${game.description}.`
            }),
        })
    }

    const handleUpdateGame = () => {
        console.log(selectedGame)
        const updatedGame = {
            id: selectedGame.id,
            category: selectedCategory,
            difficulty: selectedDifficulty,
            description: selectedDescription,
            questions: selectedQuestions.map((question) => question.id),
        };

        fetch(adminUrl + '/game/' + selectedGame.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedGame),
        })
            .then((res) => res.json())
            .then(() => {

                setGames((prevGames) => {
                    return prevGames.map((game) => (game.id === updatedGame.id ? updatedGame : game))
                });
                closeForm();
            })
            .catch((error) => {
                console.error('Error updating game:', error);
            });
    };

    const closeForm = () => {
        setSelectedGame(null);
        setSelectedCategory('');
        setSelectedDifficulty('');
        setSelectedDescription('');
        setSelectedQuestions([]);
        setIsQuestionListOpen(false);
        setIsEditMode(false);
    };
    const handleCancelEdit = () => {
        closeForm()
    };

    return (
        <Box mt={4}>
            <Drawer size="xl" isOpen={isQuestionListOpen} placement="right" onClose={() => setIsQuestionListOpen(false)}>
                <DrawerOverlay>
                    <DrawerContent w="100%">
                        <DrawerCloseButton />
                        <DrawerHeader>Question List</DrawerHeader>
                        <DrawerBody>
                            <Table variant='striped'>
                                <Thead>
                                    <Tr>
                                        <Th>Select</Th>
                                        <Th>Question</Th>
                                        <Th>Answer</Th>
                                        <Th>Options</Th>
                                        <Th>Timeframe</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {questions.map((question) => (
                                        <Tr key={question.id}>
                                            <Td>
                                                <input
                                                    type='checkbox'
                                                    checked={selectedQuestions.some((q) => q.id === question.id)}
                                                    onChange={() => handleQuestionSelect(question.id)}
                                                />
                                            </Td>
                                            <Td>{question.question}</Td>
                                            <Td>{question.answer.toUpperCase()}</Td>
                                            <Td>
                                                <ul>
                                                    <li>A: {question.options.a}</li>
                                                    <li>B: {question.options.b}</li>
                                                    <li>C: {question.options.c}</li>
                                                    <li>D: {question.options.d}</li>
                                                </ul>
                                            </Td>
                                            <Td>{question.timeframe}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </DrawerBody>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl mt={4}>
                    <FormLabel>Category</FormLabel>
                    <Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value.trim())}>
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </Select>
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Difficulty</FormLabel>
                    <Select value={selectedDifficulty} onChange={e => setSelectedDifficulty(e.target.value.trim())}>
                        <option value="">Select Difficulty</option>
                        {difficultyLevels.map((level) => (
                            <option key={level.id} value={level.name}>
                                {level.name}
                            </option>
                        ))}
                    </Select>
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Description</FormLabel>
                    <Input
                        name='description'
                        type='text'
                        value={selectedDescription}
                        onChange={e => setSelectedDescription(e.target.value)}
                    />
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Pick the Questions you want to use in the Game</FormLabel>
                    <Button width={"100%"} colorScheme='teal' variant='outline' onClick={() => setIsQuestionListOpen(true)}>
                        Select Questions ({selectedQuestions.length} selected)
                    </Button>
                </FormControl>

            </Grid>
            {isEditMode ? (
                <>
                    <Button mt={4} colorScheme='teal' onClick={handleUpdateGame}>
                        Update Game
                    </Button>
                    <Button mt={4} ml={4} onClick={handleCancelEdit}>
                        Cancel
                    </Button>
                </>
            ) : (
                <Button
                    mt={2}
                    colorScheme='teal'
                    onClick={handleCreateGame}
                    isDisabled={isCreateButtonDisabled}
                >
                    Create Game
                </Button>
            )}


            <Box mt={4}>
                <Heading as="h2" size="md">
                    List of Created Games:
                </Heading>
                <Table mt={4} variant='striped'>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Category</Th>
                            <Th>Difficulty</Th>
                            <Th>Description</Th>
                            <Th>Questions</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {games.map((game) => (
                            <Tr key={game.id}>
                                <Td>{game.id}</Td>
                                <Td>{game.category}</Td>
                                <Td>{game.difficulty}</Td>
                                <Td>{game.description}</Td>
                                <Td>{game.questions ? game.questions.length : 0}</Td>
                                <Td>
                                    <Button colorScheme='teal' size='sm' onClick={() => handleEditGame(game)}>
                                        Edit
                                    </Button>
                                    <Button colorScheme='red' size='sm' ml={3} onClick={() => openDeleteConfirmation(game)}>
                                        Delete
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            <AlertDialog
                isOpen={isDeleteConfirmationOpen}
                onClose={closeDeleteConfirmation}
                leastDestructiveRef={undefined}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Game
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete this game? This action cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={closeDeleteConfirmation}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDeleteGame} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default GamesPage;
