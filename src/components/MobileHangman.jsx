import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const HANGMAN_STATES = [
  `
  +---+
      |
      |
      |
      |
      |
=========`,
  `
  +---+
  O   |
      |
      |
      |
      |
=========`,
  `
  +---+
  O   |
  |   |
      |
      |
      |
=========`,
  `
  +---+
  O   |
 /|   |
      |
      |
      |
=========`,
  `
  +---+
  O   |
 /|\\  |
      |
      |
      |
=========`,
  `
  +---+
  O   |
 /|\\  |
 /    |
      |
      |
=========`,
  `
  +---+
  O   |
 /|\\  |
 / \\  |
      |
      |
=========`
];

const CATEGORIES = {
  programming: ['JAVASCRIPT', 'PYTHON', 'REACT', 'NODE'],
  animals: ['ELEPHANT', 'GIRAFFE', 'PENGUIN', 'DOLPHIN'],
  countries: ['JAPAN', 'BRAZIL', 'FRANCE', 'CANADA']
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const MobileHangman = () => {
  const [word, setWord] = useState('');
  const [category, setCategory] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [attempts, setAttempts] = useState(0);
  const [gamePhase, setGamePhase] = useState('menu');
  const [inputWord, setInputWord] = useState('');
  const [inputCategory, setInputCategory] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleGuess = (letter) => {
    if (gamePhase !== 'playing' || guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 6) {
        setGamePhase('lost');
      }
    } else if (word.split('').every(l => newGuessedLetters.has(l))) {
      setGamePhase('won');
    }
  };

  const startSinglePlayerGame = () => {
    const categories = Object.keys(CATEGORIES);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const words = CATEGORIES[randomCategory];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    setWord(randomWord);
    setCategory(randomCategory.toUpperCase());
    setGuessedLetters(new Set());
    setAttempts(0);
    setGamePhase('playing');
  };

  const startTwoPlayerGame = () => {
    if (inputWord.trim() && inputCategory.trim()) {
      setWord(inputWord.trim().toUpperCase());
      setCategory(inputCategory.trim().toUpperCase());
      setGuessedLetters(new Set());
      setAttempts(0);
      setGamePhase('playing');
      setIsDialogOpen(false);
      setInputWord('');
      setInputCategory('');
    }
  };

  if (gamePhase === 'menu') {
    return (
      <>
        <Card className="w-full max-w-lg mx-auto bg-zinc-900 border-zinc-800 shadow-2xl">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Hangman</h1>
              <p className="text-zinc-400">Choose your game mode</p>
            </div>
            
            <Button 
              onClick={startSinglePlayerGame}
              className="w-full h-14 text-lg bg-violet-600 hover:bg-violet-700 text-white"
            >
              Single Player
            </Button>
            
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Two Players
            </Button>
          </CardContent>
        </Card>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent className="bg-zinc-900 border-zinc-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-white">
                Enter Your Word
              </AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-400">
                Player 2, no peeking! 👀
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="space-y-4 my-4">
              <Input
                type="text"
                placeholder="Enter word"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
              <Input
                type="text"
                placeholder="Enter category"
                value={inputCategory}
                onChange={(e) => setInputCategory(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => {
                  setIsDialogOpen(false);
                  setInputWord('');
                  setInputCategory('');
                }}
                className="bg-zinc-800 text-white hover:bg-zinc-700"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={startTwoPlayerGame}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Start Game
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto bg-zinc-900 border-zinc-800 shadow-2xl">
      <CardContent className="p-6 space-y-6">
        {/* Game Stats */}
        <div className="bg-zinc-800/50 px-4 py-2 rounded-lg text-center">
          <p className="text-sm text-zinc-400">Attempts</p>
          <p className="text-2xl font-bold text-white">{attempts}/6</p>
        </div>

        {/* Category */}
        <div className="text-center text-zinc-400">
          Category: <span className="text-violet-400">{category}</span>
        </div>

        {/* Hangman Display */}
        <div className="font-mono text-emerald-400 bg-zinc-800/50 p-6 rounded-xl overflow-hidden">
          <pre className="transition-all duration-300">
            {HANGMAN_STATES[attempts]}
          </pre>
        </div>

        {/* Word Display */}
        <div className="text-4xl font-mono tracking-wider text-center min-h-16 text-white">
          {word.split('').map((letter, index) => (
            <span 
              key={index} 
              className="inline-block mx-1 transition-all duration-300"
            >
              {guessedLetters.has(letter) ? letter : '_'}
            </span>
          ))}
        </div>

        {/* Game Status */}
        {gamePhase !== 'playing' && (
          <div className={`text-center p-4 rounded-lg ${
            gamePhase === 'won' 
              ? 'bg-emerald-900/50 text-emerald-300' 
              : 'bg-rose-900/50 text-rose-300'
          }`}>
            <p className="text-lg font-medium mb-4">
              {gamePhase === 'won' 
                ? '🎉 Congratulations! You won!' 
                : `💔 Game Over! The word was: ${word}`}
            </p>
            <Button
              onClick={startSinglePlayerGame}
              className={`px-8 ${
                gamePhase === 'won' 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-rose-600 hover:bg-rose-700'
              } text-white`}
            >
              Play Again
            </Button>
          </div>
        )}

        {/* Keyboard */}
        <div className="grid grid-cols-7 gap-1.5">
          {ALPHABET.map(letter => (
            <Button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.has(letter) || gamePhase !== 'playing'}
              className={`
                p-2 text-lg font-medium
                transition-all duration-300 
                ${guessedLetters.has(letter)
                  ? word.includes(letter)
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-zinc-700 hover:bg-zinc-600'
                }
                text-white
              `}
            >
              {letter}
            </Button>
          ))}
        </div>

        {/* Return to Menu */}
        <Button
          onClick={() => setGamePhase('menu')}
          className="w-full mt-4 bg-zinc-700 hover:bg-zinc-600 text-white"
        >
          Back to Menu
        </Button>
      </CardContent>
    </Card>
  );
};

export default MobileHangman;