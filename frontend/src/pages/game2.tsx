// import React, { useState, useEffect, useCallback } from "react";
// import "./styles.css";

// const PADDLE_WIDTH = 10;
// const PADDLE_HEIGHT = 80;
// const BALL_RADIUS = 8;
// const WINNING_SCORE = 10;

// const Game = () => {
//   const [gameState, setGameState] = useState({
//     ballX: 50,
//     ballY: 50,
//     ballDX: 5,
//     ballDY: 5,
//     player1Score: 0,
//     player2Score: 0,
//     showWinScreen: false,
//   });

//   const canvasRef = React.useRef();

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");

//     const animate = () => {
//       moveBall();
//       drawCanvas(context);
//       requestAnimationFrame(animate);
//     };

//     requestAnimationFrame(animate);

//     window.addEventListener("keydown", handleKeyPress({}));

//     return () => window.removeEventListener("keydown", handleKeyPress());
//   }, []);

//   const moveBall = useCallback(() => {
//     setGameState((prevState) => {
//       let { ballX, ballY, ballDX, ballDY, player1Score, player2Score } =
//         prevState;

//       ballX += ballDX;
//       ballY += ballDY;

//       if (ballX > canvasRef.current.width - BALL_RADIUS) {
//         ballDX = -ballDX;
//         if (ballY < gameState.player2PaddleY || ballY > gameState.player2PaddleY + PADDLE_HEIGHT) {
//           checkForPoint(1);
//         } else {
//           handleCollision(ballY, gameState.player2PaddleY, 2);
//         }
//       }

//       if (ballX < BALL_RADIUS) {
//         ballDX = -ballDX;
//         if (ballY < gameState.player1PaddleY || ballY > gameState.player1PaddleY + PADDLE_HEIGHT) {
//           checkForPoint(2);
//         } else {
//           handleCollision(ballY, gameState.player1PaddleY, 1);
//         }
//       }

//       if (ballY > canvasRef.current.height - BALL_RADIUS || ballY < BALL_RADIUS) {
//         ballDY = -ballDY;
//       }

//       return {
//         ...prevState,
//         ballX,
//         ballY,
//         ballDX,
//         ballDY,
//         player1Score,
//         player2Score,
//       };
//     });
//   }, [gameState]);

//   const drawCanvas = useCallback((ctx) => {
//     // Clear canvas
//     ctx.fillStyle = "#000000";
//     ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//     // Draw center line
//     ctx.strokeStyle = "#ffffff";
//     ctx.setLineDash([10, 10]);
//     ctx.beginPath();
//     ctx.moveTo(canvasRef.current.width / 2, 0);
//     ctx.lineTo(canvasRef.current.width / 2, canvasRef.current.height);
//     ctx.stroke();

//     // Draw ball
//     ctx.fillStyle = "#ffffff";
//     ctx.beginPath();
//     ctx.arc(gameState.ballX, gameState.ballY, BALL_RADIUS, 0, Math.PI * 2);
//     ctx.fill();

//     // Draw paddles
//     ctx.fillStyle = "#ffffff";
//     ctx.fillRect(
//       0,
//       gameState.player1PaddleY,
//       PADDLE_WIDTH,
//       PADDLE_HEIGHT
//     );
//     ctx.fillRect(
//       canvasRef.current.width - PADDLE_WIDTH,
//       gameState.player2PaddleY,
//       PADDLE_WIDTH,
//       PADDLE_HEIGHT
//     );
//   }
// }

// const handleKeyPress = ({setGameState, prevState, paddleSpeed, boardHeight, paddleHeight}) => {
//  return React.useCallback(
//     (event :any) => {
//       const { key } = event;
//       setGameState((prevState) => {
//         const { player1Y, player2Y } = prevState;
//         let newPlayer1Y = player1Y;
//         let newPlayer2Y = player2Y;
//         switch (key) {
//           case 'w':
//             newPlayer1Y -= paddleSpeed;
//             break;
//           case 's':
//             newPlayer1Y += paddleSpeed;
//             break;
//           case 'ArrowUp':
//             newPlayer2Y -= paddleSpeed;
//             break;
//           case 'ArrowDown':
//             newPlayer2Y += paddleSpeed;
//             break;
//           default:
//             break;
//         }
//         // Keep the paddles within the game board
//         newPlayer1Y = Math.max(newPlayer1Y, 0);
//         newPlayer1Y = Math.min(newPlayer1Y, boardHeight - paddleHeight);
//         newPlayer2Y = Math.max(newPlayer2Y, 0);
//         newPlayer2Y = Math.min(newPlayer2Y, boardHeight - paddleHeight);
//         return { ...prevState, player1Y: newPlayer1Y, player2Y: newPlayer2Y };
//       });
//     },
//     [setGameState]
//   );
// }
