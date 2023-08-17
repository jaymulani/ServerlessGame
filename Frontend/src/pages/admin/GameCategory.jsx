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

const GameCategory = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
    });
    let isCreateButtonDisabled = !newCategory.name || !newCategory.description
    useEffect(() => {
        fetch(adminUrl + '/categorys')
            .then((res) => res.json())
            .then((data) => setCategories(data));
    }, [])

    const createCategory = (category) => {
        return fetch(adminUrl + '/category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category),
        });
    }

    const deleteCategory = (categoryId) => {
        return fetch(adminUrl + '/category/delete/' + categoryId, {
            method: 'GET',
        });
    }

    const handleCreateCategory = async () => {
        let resp = await createCategory(newCategory)
        let data = await resp.json();
        console.log(data);
        setCategories((prevCategories) => [...prevCategories, data]);
        setNewCategory({ name: '', description: '' });
    };

    const handleDeleteCategory = async (categoryId) => {
        await deleteCategory(categoryId)
        setCategories((prevCategory) => prevCategory.filter((category) => category.id !== categoryId));
    };

    return (
        <Box mt={4}>
            <FormControl mt={4}>
                <FormLabel>Name</FormLabel>
                <Input type='text'
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
            </FormControl>

            <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Input
                    type='text'
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
            </FormControl>

            <Button mt={4} colorScheme="teal" onClick={handleCreateCategory} isDisabled={isCreateButtonDisabled}>
                Create Category
            </Button>

            <Table mt={4} variant="striped">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Description</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {categories.map((category) => (
                        <Tr key={category.id}>
                            <Td>{category.id}</Td>
                            <Td>{category.name}</Td>
                            <Td>{category.description}</Td>
                            <Td>
                                <Button
                                    colorScheme="red"
                                    onClick={() => handleDeleteCategory(category.id)}
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

export default GameCategory
