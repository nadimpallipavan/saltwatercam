import { useState } from 'react';
import { siteContent } from '../data/siteContent.js';
import { Award, CheckCircle2, XCircle, RotateCcw, HelpCircle } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function KidsClubPage() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const revealRef = useScrollReveal();

  const currentQuestion = siteContent.quiz[currentQuestionIdx];

  const handleOptionClick = (optionIndex) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    // index is 1-based in siteContent
    if (optionIndex === currentQuestion.answer - 1) {
      setScore(score + 1);
    }
  };

  const handleNextClick = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    
    if (currentQuestionIdx + 1 < siteContent.quiz.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setScore(0);
    setIsAnswered(false);
    setIsFinished(false);
  };

  return (
    <div className="pageContainer kidsPage">
      <div className="sectionHeader">
        <p className="eyebrow"><Award size={18} /> Kids Explorer Club</p>
        <h1>Marine Explorer Challenge</h1>
        <p className="subtitle">Test your ocean knowledge and earn badges! Perfect for kids and explorers of all ages.</p>
      </div>

      <TiltCard className="quizCard" revealRef={revealRef}>
        {!isFinished ? (
          <>
            <div className="quizProgress">
              <span>Question {currentQuestionIdx + 1} of {siteContent.quiz.length}</span>
              <div className="progressBar">
                <div 
                  className="progressFill" 
                  style={{ width: `${((currentQuestionIdx + 1) / siteContent.quiz.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="quizQuestion">
              <HelpCircle size={24} className="questionIcon" />
              {currentQuestion.question}
            </h2>

            <div className="optionsGrid">
              {currentQuestion.options.map((option, idx) => {
                let btnClass = '';
                if (isAnswered) {
                  if (idx === currentQuestion.answer - 1) {
                    btnClass = 'correct';
                  } else if (selectedOption === idx) {
                    btnClass = 'incorrect';
                  } else {
                    btnClass = 'disabled';
                  }
                } else if (selectedOption === idx) {
                  btnClass = 'selected';
                }

                return (
                  <button
                    key={idx}
                    className={`optionBtn ${btnClass}`}
                    onClick={() => handleOptionClick(idx)}
                    disabled={isAnswered}
                  >
                    <span className="optionLetter">{['A', 'B', 'C', 'D'][idx]}</span>
                    <span className="optionText">{option}</span>
                    {isAnswered && idx === currentQuestion.answer - 1 && <CheckCircle2 size={18} className="feedbackIcon text-green" />}
                    {isAnswered && selectedOption === idx && idx !== currentQuestion.answer - 1 && <XCircle size={18} className="feedbackIcon text-red" />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="explanationBox">
                <h4>
                  {selectedOption === currentQuestion.answer - 1 ? (
                    <span className="text-green">🎉 Correct! Great job!</span>
                  ) : (
                    <span className="text-red">Oops! Not quite right.</span>
                  )}
                </h4>
                <p>{currentQuestion.explanation}</p>
                <button className="nextBtn" onClick={handleNextClick}>
                  {currentQuestionIdx + 1 === siteContent.quiz.length ? 'Finish Quiz' : 'Next Question'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="quizFinished">
            <Award size={64} className="badgeIcon" />
            <h2>Congratulations, Explorer!</h2>
            <p>You completed the V1 Marine Explorer Challenge.</p>
            <div className="scoreDisplay">
              <strong>Your Score:</strong>
              <span className="scoreNumber">{score} / {siteContent.quiz.length}</span>
            </div>
            {score === siteContent.quiz.length ? (
              <p className="badgeAwardText">🏆 Perfect Score! You have been awarded the **Boynton Inlet Master Seal** badge!</p>
            ) : score >= 2 ? (
              <p className="badgeAwardText">🐬 Nice work! You earned the **Salty Cadet** badge!</p>
            ) : (
              <p className="badgeAwardText">🐠 Good attempt! Keep watching the camera stream to learn more about fish behavior.</p>
            )}
            <button className="resetBtn" onClick={resetQuiz}>
              <RotateCcw size={16} /> Try Again
            </button>
          </div>
        )}
      </TiltCard>
    </div>
  );
}
