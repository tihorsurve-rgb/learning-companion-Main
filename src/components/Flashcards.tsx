import React, { useState, useEffect } from 'react';
import { type Lesson, type Flashcard } from '../types';
import { generateFlashcards } from '../services/geminiService';
import { Card, Button, Badge } from './UI';

export const Flashcards: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleLoadCards();
  }, [lesson]);

  const handleLoadCards = async () => {
    setLoading(true);
    try {
      const c = await generateFlashcards(lesson);
      setCards(c);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error(error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  if (loading) {
    return (
      <Card className="h-[300px] flex items-center justify-center">
        Loading cards...
      </Card>
    );
  }

  if (cards.length === 0) {
    return <Card>No flashcards available.</Card>;
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      {/* Header */}
      <div className="flex justify-between items-center px-4">
        <h3 className="text-xl font-bold text-white">Flashcards</h3>
        <span className="text-sm text-white/40">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Flashcard */}
      <div
        className="relative h-[300px] w-full perspective-1000 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
            }`}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden">
            <Card className="w-full h-full flex flex-col items-center justify-center text-center p-8 border-blue-500/30">
              <div className="mb-4">
                <Badge color="blue">Question</Badge>
              </div>

              <p className="text-2xl font-bold text-white">
                {currentCard.question}
              </p>

              <p className="mt-8 text-sm text-white/30">
                Click to flip
              </p>
            </Card>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <Card className="w-full h-full flex flex-col items-center justify-center text-center p-8 border-purple-500/30 bg-purple-900/10">
              <div className="mb-4">
                <Badge color="purple">Answer</Badge>
              </div>

              <p className="text-xl text-white/90">
                {currentCard.answer}
              </p>

              <div className="mt-8 flex gap-2">
                <Button
                  variant="ghost"
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Marked as Known');
                  }}
                >
                  Mark as Known
                </Button>

                <Button
                  variant="ghost"
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Need Revision');
                  }}
                >
                  Need Revision
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={prevCard}>
          Previous
        </Button>

        <Button variant="outline" onClick={nextCard}>
          Next Card
        </Button>
      </div>
    </div>
  );
};