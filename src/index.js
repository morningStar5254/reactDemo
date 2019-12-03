import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  console.log(props.point);
  return (
    <button
      className={
        props.pointArr[0] === props.point ||
        props.pointArr[1] === props.point ||
        props.pointArr[2] === props.point
          ? "square winner"
          : "square"
      }
      onClick={() => {
        props.onClick();
      }}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boderListX: [1, 2, 3],
      boderListY: [1, 2, 3]
    };
  }

  renderSquare(i) {
    console.log(i, this.props.pointArr[0]);
    return (
      <Square
        key={i}
        point={i}
        pointArr={this.props.pointArr}
        value={this.props.squares[i]}
        onClick={() => {
          this.props.onClick(i);
        }}
      />
    );
  }

  render() {
    return (
      <div>
        {this.state.boderListX.map((step, move) => {
          return (
            <div key={move} className="board-row">
              {this.state.boderListY.map((step2, move2) => {
                return this.renderSquare(move2 + move * 3);
              })}
            </div>
          );
        })}
        {/* <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isChange: false
    };
  }

  handleClick(i) {
    const isChange = this.state.isChange;
    const history = !isChange
      ? this.state.history.slice(0, this.state.stepNumber + 1)
      : this.state.history.slice(
          this.state.stepNumber,
          this.state.history.length
        );
    const current = !isChange ? history[history.length - 1] : history[0];
    const squares = current.squares.slice();
    if (calculateWinner(squares, "winner") || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: !isChange
        ? history.concat([{ squares: squares }])
        : [{ squares: squares }].concat(history),
      stepNumber: !isChange ? history.length : 0,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  change() {
    // const history = this.state.history;
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const isChange = this.state.isChange;
    this.setState({
      history: history.reverse(),
      stepNumber: history.length - stepNumber - 1,
      isChange: !isChange
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, "winner");
    const isChange = this.state.isChange;
    let placeList = [];
    let placeHistory = [];
    for (let x = 1; x <= 3; x++) {
      for (let y = 1; y <= 3; y++) {
        placeList.push({ x: x, y: y });
      }
    }
    const moves = history.map((step, move) => {
      let desc;
      if (isChange) {
        desc =
          move === history.length - 1
            ? "Go to move start"
            : "Go to move #" + (history.length - move - 1);
      } else {
        desc = move ? "Go to move #" + move : "Go to move start";
      }
      const place = step.squares.map((step, move) => {
        return step;
      });
      placeHistory = [];
      for (let index = 0; index < place.length; index++) {
        if (place[index] != null) {
          let point = JSON.stringify(placeList[index])
            .replace("{", "")
            .replace("}", "");
          placeHistory = placeHistory + place[index] + ":(" + point + "),";
        }
      }
      return (
        <li key={move}>
          <button
            className={this.state.stepNumber === move ? "active" : ""}
            onClick={() => {
              this.jumpTo(move);
            }}
          >
            {desc} {placeHistory}
          </button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = "winner" + winner;
    } else {
      status = "Next player:" + (this.state.xIsNext ? "X" : "O");
    }

    if (history.length === 10 && !winner) {
      status = "deuce";
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            pointArr={calculateWinner(current.squares, "line")}
            onClick={i => {
              this.handleClick(i);
            }}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            onClick={() => {
              this.change();
            }}
          >
            change
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares, type) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      if (type === "winner") {
        return squares[a];
      } else if (type === "line") {
        return lines[i];
      }
    }
  }
  if (type === "winner") {
    return null;
  } else if (type === "line") {
    return Array(3).fill(null);
  }
}
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
