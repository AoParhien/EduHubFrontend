// WordMasterGame.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Input,
  Select,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Divider,
  useToast,
  VStack,
  HStack,
  Center,
  Alert,
  AlertIcon,
  Tag,
  TableContainer,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup
} from '@chakra-ui/react';

const WordMasterGame = () => {
  const toast = useToast();
  const [gameState, setGameState] = useState('loading'); // loading, ready, playing, won, lost
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [category, setCategory] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [revealedLetters, setRevealedLetters] = useState({});
  const [maxAttempts, setMaxAttempts] = useState(6);
  const [userName, setUserName] = useState('');
  const [gameStats, setGameStats] = useState({ played: 0, won: 0, streak: 0, bestStreak: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard
  const [hint, setHint] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [topics, setTopics] = useState([
    "science", "history", "geography", "literature", "technology"
  ]);
  const [selectedTopic, setSelectedTopic] = useState('science');
  const [gameHistory, setGameHistory] = useState([]);

  // Initialize game from localStorage if available
  useEffect(() => {
    const savedStats = localStorage.getItem('wordMasterStats');
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
    
    const savedName = localStorage.getItem('wordMasterUserName');
    if (savedName) {
      setUserName(savedName);
    }
    
    const savedHistory = localStorage.getItem('wordMasterHistory');
    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory));
    }
    
    setGameState('ready');
  }, []);

  // Save game stats to localStorage when they change
  useEffect(() => {
    if (gameStats.played > 0) {
      localStorage.setItem('wordMasterStats', JSON.stringify(gameStats));
    }
  }, [gameStats]);

  // Save username to localStorage when it changes
  useEffect(() => {
    if (userName) {
      localStorage.setItem('wordMasterUserName', userName);
    }
  }, [userName]);

  // Save game history to localStorage when it changes
  useEffect(() => {
    if (gameHistory.length > 0) {
      localStorage.setItem('wordMasterHistory', JSON.stringify(gameHistory));
    }
  }, [gameHistory]);

  // Fetch a new word from the API
  const fetchNewWord = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    // Adjust word length based on difficulty
    let minLength = 4;
    let maxLength = 6;
    
    if (difficulty === 'easy') {
      minLength = 3;
      maxLength = 5;
    } else if (difficulty === 'hard') {
      minLength = 6;
      maxLength = 9;
    }
    
    try {
      // API endpoint - using Datamuse API to get words related to a topic
      const response = await fetch(`https://api.datamuse.com/words?ml=${selectedTopic}&max=100`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch word');
      }
      
      const data = await response.json();
      
      // Filter words by length based on difficulty and for appropriate characters
      const filteredWords = data.filter(wordData => {
        const w = wordData.word;
        return w.length >= minLength && 
               w.length <= maxLength && 
               /^[a-zA-Z]+$/.test(w) && // letters only
               !w.includes('-') && 
               !w.includes(' ');
      });
      
      if (filteredWords.length === 0) {
        throw new Error('No suitable words found for this topic. Try another topic.');
      }
      
      // Select a random word
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      const selectedWord = filteredWords[randomIndex].word.toUpperCase();
      
      // Fetch definition using another API
      const definitionResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord}`);
      let definitionText = '';
      let wordHint = '';
      
      if (definitionResponse.ok) {
        const definitionData = await definitionResponse.json();
        if (definitionData[0] && definitionData[0].meanings && definitionData[0].meanings[0]) {
          definitionText = definitionData[0].meanings[0].definitions[0].definition;
          
          // Create hint from definition
          const words = definitionText.split(' ');
          if (words.length > 6) {
            // Create hint using parts of the definition
            wordHint = words.slice(0, 5).join(' ') + '...';
          } else {
            wordHint = 'First letter is ' + selectedWord[0];
          }
        }
      }
      
      if (!definitionText) {
        definitionText = `A ${selectedTopic}-related term`;
        wordHint = 'First letter is ' + selectedWord[0];
      }

      setWord(selectedWord);
      setDefinition(definitionText);
      setCategory(selectedTopic);
      setHint(wordHint);
      setGuesses([]);
      setCurrentGuess('');
      setRevealedLetters({});
      setShowHint(false);
      setHintsUsed(0);
      setGameState('playing');
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to start game. Please try again.');
      setIsLoading(false);
      setGameState('ready');
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to start game. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle keyboard input
  const handleKeyDown = (e) => {
    if (gameState !== 'playing') return;
    
    if (e.key === 'Enter') {
      submitGuess();
    } else if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Za-z]$/.test(e.key) && currentGuess.length < word.length) {
      setCurrentGuess(prev => prev + e.key.toUpperCase());
    }
  };

  // Listen for keyboard events
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Submit a guess
  const submitGuess = () => {
    if (currentGuess.length !== word.length) {
      return;
    }
    
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');
    
    // Check for win
    if (currentGuess === word) {
      endGame(true);
      return;
    }
    
    // Check for loss
    if (newGuesses.length >= maxAttempts) {
      endGame(false);
      return;
    }
    
    // Update revealed letters
    updateRevealedLetters(currentGuess);
  };

  // Update which letters have been correctly guessed
  const updateRevealedLetters = (guess) => {
    const newRevealed = { ...revealedLetters };
    
    // Check for correct letter positions
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === word[i]) {
        newRevealed[i] = word[i];
      }
    }
    
    setRevealedLetters(newRevealed);
  };

  // End the game and update stats
  const endGame = (isWin) => {
    const newStats = { ...gameStats };
    newStats.played += 1;
    
    if (isWin) {
      newStats.won += 1;
      newStats.streak += 1;
      newStats.bestStreak = Math.max(newStats.streak, newStats.bestStreak);
      setGameState('won');
      
      toast({
        title: 'Congratulations!',
        description: `You guessed the word "${word}" correctly!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      newStats.streak = 0;
      setGameState('lost');
      
      toast({
        title: 'Game Over',
        description: `The word was "${word}".`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
    
    setGameStats(newStats);
    
    // Add to game history
    const newHistory = [
      {
        date: new Date().toISOString(),
        word: word,
        result: isWin ? 'won' : 'lost',
        guesses: guesses.length + (isWin ? 1 : 0),
        topic: selectedTopic,
        hintsUsed: hintsUsed
      },
      ...gameHistory
    ].slice(0, 10); // Keep only the 10 most recent games
    
    setGameHistory(newHistory);
  };

  // Reset the game
  const resetGame = () => {
    setGameState('ready');
  };

  // Start a new game
  const startGame = () => {
    fetchNewWord();
  };

  // Reveal a hint
  const revealHint = () => {
    setShowHint(true);
    setHintsUsed(hintsUsed + 1);
  };

  // Get letter status for each letter in a guess (correct, present, absent)
  const getLetterStatus = (guessedLetter, index, word) => {
    if (guessedLetter === word[index]) {
      return 'correct';
    } else if (word.includes(guessedLetter)) {
      return 'present';
    } else {
      return 'absent';
    }
  };

  // Get the color for a letter based on its status
  const getLetterColor = (status) => {
    switch (status) {
      case 'correct':
        return { bg: 'green.500', text: 'white' };
      case 'present':
        return { bg: 'yellow.500', text: 'white' };
      case 'absent':
        return { bg: 'gray.400', text: 'white' };
      default:
        return { bg: 'blue.50', text: 'blue.800' };
    }
  };

  // Virtual keyboard for mobile users
  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ];

  // Handle virtual keyboard input
  const handleKeyPress = (key) => {
    if (gameState !== 'playing') return;
    
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === '⌫') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < word.length) {
      setCurrentGuess(prev => prev + key);
    }
  };

  // Get all guessed letters to determine keyboard coloring
  const getAllGuessedLetters = () => {
    const result = {};
    
    guesses.forEach(guess => {
      for (let i = 0; i < guess.length; i++) {
        const status = getLetterStatus(guess[i], i, word);
        
        // Only upgrade status (absent -> present -> correct)
        if (result[guess[i]] === undefined || 
            (result[guess[i]] === 'absent' && (status === 'present' || status === 'correct')) ||
            (result[guess[i]] === 'present' && status === 'correct')) {
          result[guess[i]] = status;
        }
      }
    });
    
    return result;
  };

  return (
    <Container maxW="md" centerContent py={6} bg="blue.50" minH="100vh">
      <Card w="full" boxShadow="lg" bg="white" borderRadius="lg">
        <CardHeader pb={0}>
          <Heading as="h1" size="lg" textAlign="center" color="blue.700" mb={1}>
            Word Master
          </Heading>
          <Text fontSize="sm" textAlign="center" color="blue.600" mb={4}>
            The educational word guessing game
          </Text>
        </CardHeader>
        
        <CardBody>
          {gameState === 'loading' && (
            <Center py={8}>
              <Text>Loading game...</Text>
            </Center>
          )}
          
          {gameState === 'ready' && (
            <VStack spacing={4} align="stretch">
              <Box>
                <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                  Your Name:
                </FormLabel>
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  borderColor="blue.300"
                  focusBorderColor="blue.500"
                />
              </Box>
              
              <Box>
                <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                  Choose Topic:
                </FormLabel>
                <Select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  borderColor="blue.300"
                  focusBorderColor="blue.500"
                >
                  {topics.map(topic => (
                    <option key={topic} value={topic}>
                      {topic.charAt(0).toUpperCase() + topic.slice(1)}
                    </option>
                  ))}
                </Select>
              </Box>
              
              <Box>
                <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                  Difficulty:
                </FormLabel>
                <HStack spacing={2}>
                  {['easy', 'medium', 'hard'].map((level) => (
                    <Button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      flex="1"
                      variant={difficulty === level ? 'solid' : 'outline'}
                      colorScheme={difficulty === level ? 'yellow' : 'blue'}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </HStack>
              </Box>
              
              {errorMessage && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {errorMessage}
                </Alert>
              )}
              
              <Button
                onClick={startGame}
                isLoading={isLoading}
                loadingText="Loading..."
                colorScheme="blue"
                size="lg"
                isFullWidth
              >
                Start Game
              </Button>
              
              {gameStats.played > 0 && (
                <Box mt={4} bg="blue.50" borderRadius="lg" p={4}>
                  <Heading as="h2" size="md" textAlign="center" mb={2}>
                    Your Stats
                  </Heading>
                  <StatGroup>
                    <Stat bg="white" p={2} borderRadius="md" textAlign="center">
                      <StatNumber>{gameStats.played}</StatNumber>
                      <StatLabel fontSize="xs">Played</StatLabel>
                    </Stat>
                    <Stat bg="white" p={2} borderRadius="md" textAlign="center">
                      <StatNumber>
                        {Math.round((gameStats.won / gameStats.played) * 100)}%
                      </StatNumber>
                      <StatLabel fontSize="xs">Win Rate</StatLabel>
                    </Stat>
                    <Stat bg="white" p={2} borderRadius="md" textAlign="center">
                      <StatNumber>{gameStats.streak}</StatNumber>
                      <StatLabel fontSize="xs">Streak</StatLabel>
                    </Stat>
                    <Stat bg="white" p={2} borderRadius="md" textAlign="center">
                      <StatNumber>{gameStats.bestStreak}</StatNumber>
                      <StatLabel fontSize="xs">Best</StatLabel>
                    </Stat>
                  </StatGroup>
                </Box>
              )}
              
              {gameHistory.length > 0 && (
                <Box mt={4}>
                  <Heading as="h2" size="md" mb={2}>
                    Recent Games
                  </Heading>
                  <TableContainer maxH="48" overflowY="auto">
                    <Table size="sm" variant="simple">
                      <Thead bg="blue.100">
                        <Tr>
                          <Th>Word</Th>
                          <Th>Topic</Th>
                          <Th isNumeric>Result</Th>
                          <Th isNumeric>Guesses</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {gameHistory.map((game, index) => (
                          <Tr key={index} bg={index % 2 === 0 ? 'blue.50' : 'white'}>
                            <Td>{game.word}</Td>
                            <Td>{game.topic}</Td>
                            <Td isNumeric>
                              <Badge colorScheme={game.result === 'won' ? 'green' : 'red'}>
                                {game.result}
                              </Badge>
                            </Td>
                            <Td isNumeric>{game.guesses}/{maxAttempts}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </VStack>
          )}
          
          {(gameState === 'playing' || gameState === 'won' || gameState === 'lost') && (
            <VStack spacing={4} align="stretch">
              <Box textAlign="center" mb={2}>
                <Text fontSize="sm" color="blue.600" mb={1}>
                  Category: <Text as="span" fontWeight="medium">{category.toUpperCase()}</Text>
                </Text>
                
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontSize="sm" color="gray.500">
                    Guesses: {guesses.length}/{maxAttempts}
                  </Text>
                  
                  {gameState === 'playing' && !showHint && (
                    <Button
                      onClick={revealHint}
                      variant="link"
                      size="sm"
                      colorScheme="yellow"
                    >
                      Need a hint?
                    </Button>
                  )}
                </Flex>
                
                {showHint && (
                  <Alert status="warning" mt={2} borderRadius="md" size="sm">
                    <AlertIcon />
                    <Text fontSize="sm"><b>Hint:</b> {hint}</Text>
                  </Alert>
                )}
              </Box>
              
              {/* Game board */}
              <Box mb={4}>
                {/* Current word representation with blank spaces */}
                <HStack justify="center" mb={6} spacing={1}>
                  {word.split('').map((letter, index) => (
                    <Center
                      key={index}
                      w="40px"
                      h="40px"
                      borderWidth="2px"
                      borderColor={revealedLetters[index] ? 'green.500' : 'blue.300'}
                      bg={revealedLetters[index] ? 'green.100' : 'white'}
                      borderRadius="md"
                      fontSize="lg"
                      fontWeight="bold"
                    >
                      {revealedLetters[index] || (gameState === 'lost' ? letter : '')}
                    </Center>
                  ))}
                </HStack>
                
                {/* Previous guesses */}
                <VStack spacing={2} mb={4}>
                  {guesses.map((guess, guessIndex) => (
                    <HStack key={guessIndex} justify="center" spacing={1}>
                      {guess.split('').map((letter, letterIndex) => {
                        const status = getLetterStatus(letter, letterIndex, word);
                        const colors = getLetterColor(status);
                        return (
                          <Center
                            key={letterIndex}
                            w="40px"
                            h="40px"
                            bg={colors.bg}
                            color={colors.text}
                            fontWeight="bold"
                            borderRadius="md"
                          >
                            {letter}
                          </Center>
                        );
                      })}
                    </HStack>
                  ))}
                </VStack>
                
                {/* Current guess input */}
                {gameState === 'playing' && (
                  <HStack justify="center" spacing={1} mb={6}>
                    {Array.from({ length: word.length }).map((_, index) => (
                      <Center
                        key={index}
                        w="40px"
                        h="40px"
                        borderWidth="2px"
                        borderColor={index < currentGuess.length ? 'blue.500' : 'gray.300'}
                        borderRadius="md"
                        fontSize="lg"
                        fontWeight="bold"
                      >
                        {index < currentGuess.length ? currentGuess[index] : ''}
                      </Center>
                    ))}
                  </HStack>
                )}
                
                {/* Result messages */}
                {gameState === 'won' && (
                  <Box textAlign="center" mb={4}>
                    <Heading as="h2" size="lg" color="green.600" mb={2}>
                      You got it!
                    </Heading>
                    <Text color="gray.700">
                      The word was <Text as="span" fontWeight="bold">{word}</Text>
                    </Text>
                    <Text mt={2} fontSize="sm" color="gray.600">
                      {definition}
                    </Text>
                  </Box>
                )}
                
                {gameState === 'lost' && (
                  <Box textAlign="center" mb={4}>
                    <Heading as="h2" size="lg" color="red.600" mb={2}>
                      Game Over
                    </Heading>
                    <Text color="gray.700">
                      The word was <Text as="span" fontWeight="bold">{word}</Text>
                    </Text>
                    <Text mt={2} fontSize="sm" color="gray.600">
                      {definition}
                    </Text>
                  </Box>
                )}
                
                {/* Virtual keyboard */}
                {gameState === 'playing' && (
                  <Box mt={4}>
                    {keyboard.map((row, rowIndex) => (
                      <HStack key={rowIndex} justify="center" spacing={1} mb={1}>
                        {row.map((key) => {
                          const guessedLetters = getAllGuessedLetters();
                          const status = guessedLetters[key];
                          const colors = getLetterColor(status);
                          
                          return (
                            <Button
                              key={key}
                              onClick={() => handleKeyPress(key)}
                              size="sm"
                              height="40px"
                              width={key === 'ENTER' || key === '⌫' ? 'auto' : '32px'}
                              padding={key === 'ENTER' || key === '⌫' ? '0 12px' : '0'}
                              fontSize={key === 'ENTER' || key === '⌫' ? 'xs' : 'md'}
                              bg={colors.bg}
                              color={colors.text}
                              _hover={{ opacity: 0.8 }}
                              fontWeight="bold"
                            >
                              {key}
                            </Button>
                          );
                        })}
                      </HStack>
                    ))}
                  </Box>
                )}
              </Box>
              
              {/* Game control buttons */}
              {(gameState === 'won' || gameState === 'lost') && (
                <Button
                  onClick={resetGame}
                  colorScheme="blue"
                  size="lg"
                >
                  Play Again
                </Button>
              )}
            </VStack>
          )}
        </CardBody>
        
        <CardFooter pt={0}>
          <Flex w="full" direction="column" align="center">
            <Divider mb={4} />
            <Text fontSize="sm" color="gray.500">
              Explore our full courses to expand your vocabulary!
            </Text>
          </Flex>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default WordMasterGame;