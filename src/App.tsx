import React from "react";
import "./index.css";

const rowNum = 3;
const columnNum = 3;
const pixelNum = rowNum * columnNum;

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

  //JSX.Elementがhtml要素?
  //v-forはないので，JSX.Element[]にpush
  //returnするときにhtmlタグと{}で囲ってJSX.Elementに変換して返す
  let board: JSX.Element[] = [];
  for (let row = 0; row < pixelNum; row += columnNum) {
    let columns: JSX.Element[] = [];
    for (let column = row; column < row + columnNum; column++)
      columns.push(renderSquare(column));
    board.push(<div>{columns}</div>);
  }

  return <div>{board}</div>;
};

class Game extends React.Component {
  state: {
    history: [
      {
        squares: string[];
        lastPlayer: string;
        pos: [number, number];
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
          squares: Array(pixelNum).fill(null),
          lastPlayer: "",
          pos: [0, 0],
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
          lastPlayer: squaresCopy[idx],
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
    const winner = calculateWinner(current.squares);

    const moves = history.map((elem, idx) => {
      //map関数: コピーし，ラムダ式処理をforeach済みの配列を返す
      // (配列を直接変更する場合はforeachを使ってメモリ節約)
      //本来，第一引数だけでよく，これは配列の各要素
      //しかし，第二引数があると，要素の添え字として使える
      //→ javascriptのforeach系は全てそうらしい → c++より便利
      const desc = idx
        ? `Go to move #${idx} ⇒ ${elem.lastPlayer}: (${elem.pos})`
        : "Go to game start";

      const buttonText =
        idx === this.state.stepNumber ? <strong>{desc}</strong> : desc;

      return (
        <li key={idx}>
          <button onClick={() => this.jumpTo(idx)}>{buttonText}</button>
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
