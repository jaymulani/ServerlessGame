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
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';

const adminUrl = process.env.REACT_APP_ADMIN_URL || 'https://mdlbsby4nd.execute-api.us-east-1.amazonaws.com/dev';

const GameDifficultyLevel = () => {
    const [difficultyLevels, setDifficultyLevels] = useState([]);
    const [newDifficultyLevel, setNewDifficultyLevel] = useState({
        name: '',
        description: '',
    });
    let isCreateButtonDisabled = !newDifficultyLevel.name || !newDifficultyLevel.description
    useEffect(() => {
        fetch(adminUrl + '/difficultys')
            .then((res) => res.json())
            .then((data) => setDifficultyLevels(data));
    }, []);

    const createDifficultyLevel = (difficultyLevel) => {
        return fetch(adminUrl + '/difficulty', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(difficultyLevel),
        });
    };

    const deleteDifficultyLevel = (difficultyLevelId) => {
        return fetch(adminUrl + '/difficulty/delete/' + difficultyLevelId, {
            method: 'GET',
        });
    };

    const handleCreateDifficultyLevel = async () => {
        let resp = await createDifficultyLevel(newDifficultyLevel);
        let data = await resp.json();
        console.log(data);
        setDifficultyLevels((prevDifficultyLevels) => [...prevDifficultyLevels, data]);
        setNewDifficultyLevel({ name: '', description: '' });
    };

    const handleDeleteDifficultyLevel = async (difficultyLevelId) => {
        await deleteDifficultyLevel(difficultyLevelId);
        setDifficultyLevels((prevDifficultyLevels) =>
            prevDifficultyLevels.filter((difficultyLevel) => difficultyLevel.id !== difficultyLevelId)
        );
    };

    return (
        <Box mt={4}>
            <FormControl mt={4}>
                <FormLabel>Name</FormLabel>
                <Input
                    type='text'
                    value={newDifficultyLevel.name}
                    onChange={(e) => setNewDifficultyLevel({ ...newDifficultyLevel, name: e.target.value })}
                />
            </FormControl>

            <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Input
                    type='text'
                    value={newDifficultyLevel.description}
                    onChange={(e) =>
                        setNewDifficultyLevel({ ...newDifficultyLevel, description: e.target.value })
                    }
                />
            </FormControl>

            <Button mt={4} colorScheme='teal' onClick={handleCreateDifficultyLevel} isDisabled={isCreateButtonDisabled}>
                Create Difficulty Level
            </Button>

            <Table mt={4} variant='striped'>
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Description</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {difficultyLevels.map((difficultyLevel) => (
                        <Tr key={difficultyLevel.id}>
                            <Td>{difficultyLevel.id}</Td>
                            <Td>{difficultyLevel.name}</Td>
                            <Td>{difficultyLevel.description}</Td>
                            <Td>
                                <Button
                                    colorScheme='red'
                                    onClick={() => handleDeleteDifficultyLevel(difficultyLevel.id)}
                                >
                                    Delete
                                </Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default GameDifficultyLevel;
