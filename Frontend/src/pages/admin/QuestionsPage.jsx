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
  Tr,
} from '@chakra-ui/react';

const adminUrl = process.env.REACT_APP_ADMIN_URL || 'https://mdlbsby4nd.execute-api.us-east-1.amazonaws.com/dev';
const questionTagUrl = process.env.REACT_APP_QUESTION_TAG || 'https://us-east1-serverless-project-9.cloudfunctions.net/extractTags'

const GameQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    id: '',
    question: '',
    answer: '',
    categories: '',
    options: {
      a: '',
      b: '',
      c: '',
      d: '',
    },
    timeframe: 5,
  });
  let isCreateButtonDisabled = !newQuestion.question || !newQuestion.answer || !newQuestion.options.a || !newQuestion.options.b || !newQuestion.options.c || !newQuestion.options.d || !newQuestion.timeframe
  const [editingQuestion, setEditingQuestion] = useState(null);
  const generalTag = ["General"]

  const fetchQuestions = () => {
    fetch(adminUrl + '/questions')
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const createQuestion = (question) => {
    return fetch(adminUrl + '/question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(question),
    });
  };

  const fetchQuestionsCategories = (question) => {
    return fetch(questionTagUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: question }),
    });
  }

  const updateQuestion = (question) => {
    return fetch(adminUrl + '/question/' + question.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(question),
    });
  };

  const deleteQuestion = (questionId) => {
    return fetch(adminUrl + '/question/delete/' + questionId, {
      method: 'GET',
    });
  };

  const handleCreateQuestion = async () => {
    let tagResponse = await fetchQuestionsCategories(newQuestion.question)
    let tagBody = await tagResponse.json()
    console.log("Tags - ", tagBody)
    newQuestion.categories = tagBody ? tagBody.tags : generalTag
    let resp = await createQuestion(newQuestion);
    let data = await resp.json();

    console.log(data);
    setQuestions((prevQuestions) => [...prevQuestions, data]);
    setNewQuestion({
      id: '',
      question: '',
      answer: '',
      categories: '',
      options: {
        a: '',
        b: '',
        c: '',
        d: '',
      },
      timeframe: 5,
    });
  };

  const handleUpdateQuestion = async () => {
    let resp = await updateQuestion(editingQuestion);
    let data = await resp.json();
    console.log(questions);
    setQuestions((prevQuestions) => {
      console.log("Prev Questions", prevQuestions)
      return prevQuestions.map((question) => (question.id === data.id ? data : question))
    }
    );
    setEditingQuestion(null);
    fetchQuestions();
  };

  const handleDeleteQuestion = async (questionId) => {
    await deleteQuestion(questionId);
    setQuestions((prevQuestions) => prevQuestions.filter((question) => question.id !== questionId));
  };

  const handleEdit = (question) => {
    setEditingQuestion({ ...question });
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'a' || name === 'b' || name === 'c' || name === 'd') {
      if (editingQuestion) {
        setEditingQuestion((prevEditingQuestion) => ({
          ...prevEditingQuestion,
          options: {
            ...prevEditingQuestion.options,
            [name]: value,
          },
        }));
      } else {
        setNewQuestion((prevNewQuestion) => ({
          ...prevNewQuestion,
          options: {
            ...prevNewQuestion.options,
            [name]: value,
          },
        }));
      }
    } else {
      if (editingQuestion) {
        setEditingQuestion((prevEditingQuestion) => ({
          ...prevEditingQuestion,
          [name]: value,
        }));
      } else {
        setNewQuestion((prevNewQuestion) => ({
          ...prevNewQuestion,
          [name]: value,
        }));
      }
    }
  };


  return (
    <Box mt={4}>
      <FormControl mt={4}>
        <FormLabel>Question</FormLabel>
        <Input
          name='question'
          type='text'
          value={editingQuestion ? editingQuestion.question : newQuestion.question}
          onChange={handleChange}
        />
      </FormControl>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>

        <FormControl mt={4}>
          <FormLabel>Option A</FormLabel>
          <Input
            name='a'
            type='text'
            value={editingQuestion ? editingQuestion.options.a : newQuestion.options.a}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Option B</FormLabel>
          <Input
            name='b'
            type='text'
            value={editingQuestion ? editingQuestion.options.b : newQuestion.options.b}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Option C</FormLabel>
          <Input
            name='c'
            type='text'
            value={editingQuestion ? editingQuestion.options.c : newQuestion.options.c}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Option D</FormLabel>
          <Input
            name='d'
            type='text'
            value={editingQuestion ? editingQuestion.options.d : newQuestion.options.d}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Answer</FormLabel>
          <Select
            name='answer'
            value={editingQuestion ? editingQuestion.answer : newQuestion.answer}
            onChange={handleChange}
          >
            <option value="">Select Answer</option>
            {
              ['a', 'b', 'c', 'd'].map((option) => (
                <option key={option} value={option}>{option.toUpperCase()}</option>
              ))
            }
          </Select>
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Timeframe</FormLabel>
          <Input
            name='timeframe'
            type='number'
            value={editingQuestion ? editingQuestion.timeframe : newQuestion.timeframe}
            onChange={handleChange}
          />
        </FormControl>
      </Grid>

      {editingQuestion ? (
        <>
          <Button mt={4} colorScheme='teal' onClick={handleUpdateQuestion}>
            Update Question
          </Button>
          <Button mt={4} ml={4} onClick={handleCancelEdit}>
            Cancel
          </Button>
        </>
      ) : (
        <Button mt={4} colorScheme='teal' onClick={handleCreateQuestion} isDisabled={isCreateButtonDisabled}>
          Create Question
        </Button>
      )}

      <Table mt={4} variant='striped'>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Question</Th>
            <Th>Answer</Th>
            <Th>Options</Th>
            <Th>Categories/Tags</Th>
            <Th>Timeframe</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {questions.map((question) => (
            <Tr key={question.id}>
              <Td>{question.id}</Td>
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
              <Td>
                <ul>
                  {question.categories ? question.categories.map(category => <li>{category}</li>) : generalTag.map(category => <li>{category}</li>)}
                </ul>
              </Td>
              <Td>{question.timeframe}</Td>
              <Td>
                <Grid column={2} gap={2}>
                  <Button colorScheme='teal' size='sm' onClick={() => handleEdit(question)}>
                    Edit
                  </Button>
                  <Button
                    colorScheme='red'
                    size='sm'
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    Delete
                  </Button>
                </Grid>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default GameQuestion;
