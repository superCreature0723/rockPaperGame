"use client";

import {
  Controller,
  Scores,
  Round,
  GameView,
  ToggleButton,
  ButtonBox,
} from "../components/index";
import { randomPcMove } from "../../../utils/randomPcMove";
import { useGameContext } from "../context/gameContext";
import { useEffect, useState } from "react";
import BombAnimation from "../components/BombAnimation";

const GamePage = () => {
  const { state, dispatch } = useGameContext();
  const [timer, setTimer] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const { userSelect, pcSelect } = state;
     if (userSelect !== "none" && pcSelect !== "none") {
       determineWinner(userSelect, pcSelect);
     }
  }, [state.roundCounter]);

  useEffect(() => {
    if (state.roundCounter > 0) {
      setTimer(10); // Reset the timer to 10 for each new round
      dispatch({ type: "SET_USER_SELECT", payload: "none" });
      dispatch({ type: "SET_PC_SELECT", payload: "none" });
      setGameOver(false); // Reset gameOver state
    }
  }, [state.roundCounter]);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (timer > 0 && !gameOver) {
      countdownInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      dispatch({ type: "INCREMENT_PC_SCORE" });
      dispatch({ type: "INCREMENT_ROUND" });
      setTimer(10);
    }

    return () => clearInterval(countdownInterval); // 
  }, [timer, gameOver]);

  const pcMoveHandler = () => {
    const { title, image } = randomPcMove();
    // set in state
    dispatch({ type: "SET_PC_IMAGE", payload: image });
    dispatch({ type: "SET_PC_SYMBOL", payload: title });
    dispatch({ type: "INCREMENT_ROUND" });
  };

  
  const determineWinner = (user: string, pc: string) => {
    
    if (user === pc) {
      return dispatch({ type: "INCREMENT_GAME_TIES" });
    }
    if (
      (user === "rock" && pc === "scissor") ||
      (user === "paper" && pc === "rock") ||
      (user === "scissor" && pc === "paper")
    ) {
      dispatch({ type: "INCREMENT_USER_SCORE" });
    } else {
      dispatch({ type: "INCREMENT_PC_SCORE" });
    }
  };

  return (
    <div className="w-full min-h-screen bg-primary flex flex-col select-none relative">
      <Scores />
      <Round round={state.roundCounter} />
      <div className="w-full flex justify-center mt-4">
        <div className="bg-black text-white p-2 rounded-xl">
          Time Left: {timer}s
        </div>
      </div>
      <GameView />
      <Controller pcMove={pcMoveHandler} />
      <ToggleButton />
      <ButtonBox />
      <BombAnimation />

        {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-red-500">
          Game Over! You Lost!
        </div>
      )}
    </div>
  );
};

export default GamePage;
