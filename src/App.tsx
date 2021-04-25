import React, { useState } from "react";
import Board, { columnNum, pixelNum, SquaresInf } from "./Board";
import "./App.css";

const calculateWinner = (squaresInf: SquaresInf, step: number) => {
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
    if (
      squaresInf.squares[a] &&
      squaresInf.squares[a] === squaresInf.squares[b] &&
      squaresInf.squares[a] === squaresInf.squares[c]
    ) {
      squaresInf.win[a] = true;
      squaresInf.win[b] = true;
      squaresInf.win[c] = true;
      squaresInf.winner = squaresInf.squares[a];
    }
  }

  if (squaresInf.winner !== "") return squaresInf;
  if (step === pixelNum) return "引き分け";

  return null;
};

type Note = {
  stepNumber: number;
  squaresInf: SquaresInf;
  lastPlayer: string;
  pos: [number, number];
};

const initNote: Note[] = [
  {
    stepNumber: 0,
    squaresInf: {
      squares: Array(pixelNum).fill(""),
      win: Array(pixelNum).fill(false),
      winner: "",
    },
    lastPlayer: "",
    pos: [0, 0],
  },
];

const [history, setHistory] = useState(initNote);
const [stepNumber, setStepNumber] = useState(0);
const [xIsNext, setXIsNext] = useState(true);
const [isRise, setIsRise] = useState(true);

class Game extends React.Component {
  state: {
    history: [
      {
        stepNumber: number;
        squaresInf: SquaresInf;
        lastPlayer: string;
        pos: [number, number];
      }
    ];
    stepNumber: number;
    xIsNext: boolean;
    isRise: boolean;
  };

  constructor(props: {}) {
    super(props);
    this.state = {
      history: [
        {
          stepNumber: 0,
          squaresInf: {
            squares: Array(pixelNum).fill(""),
            win: Array(pixelNum).fill(false),
            winner: "",
          },
          lastPlayer: "",
          pos: [0, 0],
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isRise: true,
    };
  }

  handleClick = (idx: number) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squaresCopy: SquaresInf = {
      squares: current.squaresInf.squares.slice(),
      win: current.squaresInf.win.slice(),
      winner: current.squaresInf.winner,
    };

    if (
      calculateWinner(squaresCopy, current.stepNumber) ||
      squaresCopy.squares[idx]
    )
      return;

    squaresCopy.squares[idx] = this.state.xIsNext ? "●" : "○";

    this.setState({
      history: history.concat([
        {
          stepNumber: history.length,
          squaresInf: squaresCopy,
          lastPlayer: squaresCopy.squares[idx],
          pos: [(idx % columnNum) + 1, Math.floor(idx / columnNum) + 1],
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
    const winner = calculateWinner(current.squaresInf, current.stepNumber);

    const movesTemp = this.state.isRise
      ? history.slice()
      : history.slice().reverse();
    const moves = movesTemp.slice().map((elem) => {
      //map関数: コピーし，ラムダ式処理をforeach済みの配列を返す
      // (配列を直接変更する場合はforeachを使ってメモリ節約)
      //本来，第一引数だけでよく，これは配列の各要素
      //しかし，第二引数があると，要素の添え字として使える
      //→ javascriptのforeach系は全てそうらしい → c++より便利

      const desc = elem.stepNumber
        ? `Go to move #${elem.stepNumber} ⇒ ${elem.lastPlayer}: (${elem.pos})`
        : "Go to game start";

      const buttonText =
        elem.stepNumber === this.state.stepNumber ? (
          <strong className="history-highlight">
            {elem.stepNumber + ".  " + desc}
          </strong>
        ) : (
          elem.stepNumber + ".  " + desc
        );

      return (
        <div className="history-line" key={elem.stepNumber}>
          <button
            className="history-button"
            onClick={() => this.jumpTo(elem.stepNumber)}
          >
            {buttonText}
          </button>
        </div>
      );
    });

    const radioButtons = (
      <div>
        <input
          type="radio"
          className="radio-button-rise"
          name="sort"
          onChange={() =>
            this.setState({
              isRise: true,
            })
          }
          defaultChecked={this.state.isRise}
        />
        <strong className="radio-button-rise">昇順</strong>
        <input
          type="radio"
          className="radio-button-down"
          name="sort"
          onChange={() =>
            this.setState({
              isRise: false,
            })
          }
          defaultChecked={!this.state.isRise} //checkedだと別のボタンを押しても選択されない
        />
        <strong className="radio-button-down">降順</strong>
      </div>
    );

    let status: string;
    if (winner !== null) {
      if (winner === "引き分け") status = winner;
      else status = "Winner: " + winner.winner;
    } else status = `Next player: ${this.state.xIsNext ? "●" : "○"}`;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squaresInf={current.squaresInf}
            onClick={(idx: number) => this.handleClick(idx)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {radioButtons}
          <div className="history">{moves}</div>
        </div>
      </div>
    );
  };
}

export default Game;
