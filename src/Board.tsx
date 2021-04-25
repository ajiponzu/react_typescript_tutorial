import "./App";

export const rowNum = 3;
export const columnNum = 3;
export const pixelNum = rowNum * columnNum;

export type SquaresInf = {
  squares: string[];
  win: boolean[];
  winner: string;
};

const Square = (props: {
  value: string;
  onClick: VoidFunction;
  key: number;
  isWin: boolean;
}) => {
  const buttonClass = props.isWin ? "squareWin" : "square";
  return (
    <button className={buttonClass} onClick={props.onClick} key={props.value}>
      {props.value}
    </button>
  );
};

const Board = (props: {
  squaresInf: SquaresInf;
  onClick: (idx: number) => void;
}) => {
  const renderSquare = (idx: number) => {
    return (
      <Square
        value={props.squaresInf.squares[idx]}
        onClick={() => props.onClick(idx)}
        key={idx}
        isWin={props.squaresInf.win[idx]}
      />
    );
  };

  //JSX.Elementがhtml要素?
  //v-forはないので，JSX.Element[]にpush
  //returnするときにhtmlタグと{}で囲ってJSX.Elementに変換して返す
  let board: JSX.Element[] = [];
  for (let pixel = 0; pixel < pixelNum; pixel += columnNum) {
    let columns: JSX.Element[] = [];
    for (let column = pixel; column < pixel + columnNum; column++)
      columns.push(renderSquare(column));
    board.push(
      <div className="board-row" key={Math.floor(pixel / 3)}>
        {columns}
      </div>
    );
  }

  return <div>{board}</div>;
};

export default Board;
