import React, { useEffect, useState } from "react";
import styles from "@/styles/Game2.module.css"
import styles2 from "@/styles/Login.module.css"


import { relative } from "path";
import { useWindowSize } from "@react-hook/window-size/throttled";
import io, {Socket} from "socket.io-client"

const socket = io("http://localhost:8000")

export default function Game () { 
  // const CANVAS_WIDTH = window.innerWidth;
  // const data.CANVAS_HEIGHT = window.innerHeight;
  const [WIDTH, HEIGHT] = useWindowSize({ fps: 60 });
  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 80;
  const BALL_RADIUS = 8;
  const BALL_SPEED = 1;
  const [data, setData] = useState({CANVAS_WIDTH: WIDTH, CANVAS_HEIGHT: HEIGHT, PADDLE_HEIGHT, PADDLE_WIDTH, BALL_RADIUS, BALL_SPEED})
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(false)
    const CANVAS_HEIGHT = HEIGHT / 1.4;
    const CANVAS_WIDTH = WIDTH / 1.4;

    setData({CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE_HEIGHT, PADDLE_WIDTH, BALL_RADIUS, BALL_SPEED})
    setMounted(true)
  }, [HEIGHT, WIDTH])


  //Listeners WSS
  const [player1, setPlayer1] = useState<string>()
  const [player2, setPlayer2] = useState<string>()

  const join = (username: string) => {
    //socket.emit("join_game", username)
  }

  const start = () => {
    socket.emit("start")
  }

  const up = () => {
    socket.emit("up", {})
  }

  const down = () => {
    socket.emit("down", {})
  }


  const startGame = () => {

  }

  const handle_new = (value: string) => {
    console.log("VALUE3 ,", value)
    setPlayer1(value)
  }
  useEffect(() => {
    socket.on("new_user_1", handle_new)
    // socket.on("message", handle_new)

    socket.on("new_user_2", (value) => setPlayer2(value))
    socket.on("start_game", startGame)

    return () => {
      socket.off("new_user_1", setPlayer1)
      socket.off("new_user_2", setPlayer2)
      socket.off("start_game", startGame)
    }
  }, [player1, player2, startGame])
  

  if (!mounted)
  {
    return null;
  }
  return (
    <div>
      <div>
        Waiting for players...
        <button className={styles2.button} onClick={() => join("Michael")}>JOIN PLAYER 1 </button>
        <button className={styles2.button} onClick={() => join("Diane")}> JOIN PLAYER 2 </button>
        Players: {player1} , {player2}
      </div>
      <div className="relative">
          {data && <PongGame data={data}/>}
      </div>
    </div>
    )
}

// const CANVAS_WIDTH = 600;
// const CANVAS_HEIGHT = 400;


const Paddle = ({ x, y, width, height } : { x :number, y :number, width :number, height :number}) => {
    return <div style={{position: 'absolute', left: x, top: y, width, height}} className={styles.paddle}/>;
};

const Ball = ({ x, y, radius } : { x :number, y : number, radius :number}) => {
    return (
      <div style={{
          position: 'absolute',
          left: x - radius,
          top: y - radius,
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius,
        }}
        className={styles.ball}
      />
    );
};

const Net = ({ x, y, width, height} : {x :number, y :number, width :number, height :number}) => {
  return (
    <>
    <div style={{left:x, top:y, width: "8px", height}} className={styles.net}/>
    </>
  );
};

const PongGame = ({data} :any) => {
  const canvasRef = React.useRef(null);
  const [gameState, setGameState] = React.useState({
    paddle1Y: data.CANVAS_HEIGHT / 2 - data.PADDLE_HEIGHT / 2,
    paddle2Y: data.CANVAS_HEIGHT / 2 - data.PADDLE_HEIGHT / 2,
    ballX: data.CANVAS_WIDTH / 2,
    ballY: data.CANVAS_HEIGHT / 2,
    ballDX: data.BALL_SPEED,
    ballDY: data.BALL_SPEED,
    player1Score: 0,
    player2Score: 0,
  });

  const updateBallPosition = React.useCallback(() => {
    setGameState((prevState) => {
      let { ballX, ballY, ballDX, ballDY, player1Score, player2Score } = prevState;

      // Update ball position
      ballX += ballDX;
      ballY += ballDY;

      // Check if ball hits top or bottom wall
      if (ballY - data.BALL_RADIUS <= 0 || ballY + data.BALL_RADIUS >= data.CANVAS_HEIGHT) {
        ballDY = -ballDY;
      }

      // Check if ball hits left paddle
      if (ballX - data.BALL_RADIUS <= data.PADDLE_WIDTH && ballY >= gameState.paddle1Y && ballY <= gameState.paddle1Y + data.PADDLE_HEIGHT) {
        ballDX = -ballDX;
      }

      // Check if ball hits right paddle
      if (ballX + data.BALL_RADIUS >= data.CANVAS_WIDTH - data.PADDLE_WIDTH && ballY >= gameState.paddle2Y && ballY <= gameState.paddle2Y + data.PADDLE_HEIGHT) {
        ballDX = -ballDX;
      }

      // Check if ball goes out of bounds
      if (ballX + data.BALL_RADIUS >= data.CANVAS_WIDTH) {
        console.log("Player 1 scores!");
        player1Score += 1;
        ballX = data.CANVAS_WIDTH / 2;
        ballY = data.CANVAS_HEIGHT / 2;
        ballDX = -ballDX;
      } else if (ballX - data.BALL_RADIUS <= 0) {
        console.log("Player 2 scores!");
        player2Score += 1;
        ballX = data.CANVAS_WIDTH / 2;
        ballY = data.CANVAS_HEIGHT / 2;
        ballDX = -ballDX;
      }
      return {
        ...prevState,
        ballX,
        ballY,
        ballDX,
        ballDY,
        player1Score,
        player2Score,
      };
    });
  }, [gameState.paddle1Y, gameState.paddle2Y, data]);

  const handleKeyDown = React.useCallback(
    (event: any) => {
        if (event.key === "w" && gameState.paddle1Y > 0) {
            setGameState((prevState) => ({ ...prevState, paddle1Y: prevState.paddle1Y - 10 }));
        } else if (event.key === "s" && gameState.paddle1Y < data.CANVAS_HEIGHT - data.PADDLE_HEIGHT) {
            setGameState((prevState) => ({ ...prevState, paddle1Y: prevState.paddle1Y + 10 }));
        } else if (event.key === "ArrowUp" && gameState.paddle2Y > 0) {
            setGameState(( (prevState) => ({ ...prevState, paddle2Y: prevState.paddle2Y - 10 })))
        } else if (event.key === "ArrowDown" && gameState.paddle2Y < data.CANVAS_HEIGHT - data.PADDLE_HEIGHT) {
            setGameState((prevState) => ({ ...prevState, paddle2Y: prevState.paddle2Y + 10 }));
        }
    },[gameState.paddle1Y, gameState.paddle2Y]);

    React.useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // const intervalId = setInterval(() => {
      //   updateBallPosition();
      // }, 10);
  
      document.addEventListener("keydown", handleKeyDown);
  
      return () => {
        // clearInterval(intervalId);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [updateBallPosition, handleKeyDown]);
    
    return (
      <>
       
          <div className={styles.wrapper}>
          <canvas
            ref={canvasRef}
            width={data.CANVAS_WIDTH}
            height={data.CANVAS_HEIGHT}
            className={styles.canvas}>
          </canvas>
          <Paddle x={0} y={gameState.paddle1Y} width={data.PADDLE_WIDTH} height={data.PADDLE_HEIGHT} />
          <Paddle x={data.CANVAS_WIDTH - data.PADDLE_WIDTH} y={gameState.paddle2Y} width={data.PADDLE_WIDTH} height={data.PADDLE_HEIGHT} />
          <Ball x={gameState.ballX} y={gameState.ballY} radius={data.BALL_RADIUS} />
          <Net x={data.CANVAS_WIDTH /2} y={0} width={data.CANVAS_WIDTH} height={data.CANVAS_HEIGHT} />
          </div>
          <div>Player 1 Score: {gameState.player1Score}</div>
          <div>Player 2 Score: {gameState.player2Score}</div>
        </>
    );
  };