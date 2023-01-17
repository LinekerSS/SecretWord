// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react';

// Data
import { wordList } from './data/words'

// Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: 'start'},
  { id: 2, name: 'game'},
  { id: 3, name: 'end'}
]

const guessesQty = 3;

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordList)

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words)
    
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    console.log(category);

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { category, word }
  }, [words])

  // Start the secretGame
  const startGame = useCallback(() => {
    // Clear all letters
    clearLettersStates()

    // pick word and pick category
    const { category, word } = pickWordAndCategory();
     
    // create an array of letter
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    console.log(wordLetters);
    console.log(word, category);

    // fill states
    setPickedCategory(category)
    setPickedWord(word)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory]);

  // process the letter input
  const verifyLetter = (letter) => {
    console.log(letter);

    const normalizedLetter = letter.toLowerCase();

    // Check if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    // Push guessed letter or remove a guess

    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        letter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
    ]);
    setGuesses((actualGuesses) => actualGuesses - 1)
  }
}

// restart de game
const retry = () => {
  setScore(0)
  setGuesses(guessesQty)
  setGameStage(stages[0].name)
}

// Clear letters state

const clearLettersStates = () => {
  setGuessedLetters([])
  setWrongLetters([])
};

  useEffect(() => {
    if(guesses === 0) {

      // game over and reset all states
      clearLettersStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  // Check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    //win condition
    if(guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore((actualScore) => (actualScore += 100));  

      // Restarts the game
      startGame();
    }
  }, [guessedLetters, letters, startGame])

  

  return (
    <div className="App">
     {gameStage === 'start' && <StartScreen startGame={startGame} />}
     {gameStage === 'game' && (
     <Game 
      verifyLetter={verifyLetter} 
      pickedWord={pickedWord} 
      pickedCategory={pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
     />
     )}
     {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
