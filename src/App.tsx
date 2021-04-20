import React from "react";
import "./index.css";

const Square = (props: { value: string; onClick: VoidFunction }) => {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
};

const Board = (props: {
  squares: string[];
  onClick: (idx: number) => void;
}) => {
  const renderSquare = (idx: number) => {
    return (
      <Square value={props.squares[idx]} onClick={() => props.onClick(idx)} />
    );
  };

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

class Game extends React.Component {
  state: {
    history: [
      {
        squares: string[];
      }
    ];
    stepNumber: number;
    xIsNext: boolean;
  };

  constructor(props: {}) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick = (idx: number) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squaresCopy = current.squares.slice();

    if (calculateWinner(squaresCopy) || squaresCopy[idx]) return;
    squaresCopy[idx] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([
        {
          squares: squaresCopy,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  };

  jumpTo = (step: number) => {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  };

  render = () => {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((_step, move) => {
      const desc = move ? `Go to move #${move}` : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status: string;
    if (winner) status = "Winner: " + winner;
    else status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(idx: number) => this.handleClick(idx)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  };
}

const calculateWinner = (squares: Array<string>) => {
  //三目並べの勝ち筋における，石の位置の組合せ
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    //tie
    const [a, b, c] = lines[i];
    //同プレイヤーの石が三つ並んでいるか
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }

  return null;
};

export default Game;
