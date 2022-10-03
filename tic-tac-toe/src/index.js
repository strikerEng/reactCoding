import React from 'react';
import useState from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// A function component that only renders a single component
function Square(props){
    return (
      // When you click the button it should draw either and X or O depending on who's turn it is
      <button 
          className="square" 
          // call the function to handle clicks passed to the Square component
          onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }

class Board extends React.Component {
  renderSquare(i) {
    return (
    <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
    />
    );
  }

  // render function calls tells React to return and display a hierarchy of views listed in this React component
  /*
      On render, it returns a description of what the code will display on the screen
      React will then take the description and display the result 
      The return type of the render function is really a React element which is a lightweight description of what to render
  */

  render() {
    return (
      // JSX syntax to create new React elements 
      <div>

        <div className="board-row">
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
        </div>
      </div>
    );  
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      // activeButton 
      activeButton: null, 
      history : [{ squares: Array(9).fill(null) }],
      lastClickedColAndRow: [],
      stepNumber: 0,
      xIsNext : true,

    };

  }

  render() {
    const history = this.state.history;
    const current = history[ this.state.stepNumber ];
    const winner = calculateWinner(current.squares);
    const historyColAndRowClick = this.state.lastClickedColAndRow;
    
    // Returns a react element 
    const moves = history.map((step, move)=> {
      const desc = move ?  'Go to move # ' + move + ' (' + (historyColAndRowClick[ move - 1 ]) + ')': 'Go to game start';

      // Return the react element
      return(
        // Create a list item
        // Assign proper keys when you are building a dynamic list
        // Keys needs to be unique between components and their siblings
        <li key={move}> 
          <button 
          onClick={() => this.jumpTo(move)}
          // 600 appears as bold while 400 appears as regular text
          style={{ fontWeight: this.state.activeButton === move ? 600 : 400 }}
          >
            {desc}
          </button>
        </li>
      );
    }); 

    let status;
    if (winner){
      status = 'Winner: ' + winner;
    }else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'Y');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={ current.squares }
            onClick={(i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[ history.length -1 ];
    // Return a copy of the array of each square's states
    // This helps us build a pure component through immutability. Instead of modifying this.state.squares directly we will modify a copy of that data 
    const squares = current.squares.slice();
    const clickedColumnsAndRowHistory = this.state.lastClickedColAndRow.slice()

    // Determine the row and column of the square based on its index
    let row;

    if (i < 3){ row = 1}
    if (i > 2 && i < 6){ row = 2 }
    if (i > 5){ row = 3 }

    const column = i % 3 + 1 

    // Ignore a click if the game already has a winner or the square is already filled
    if (calculateWinner(squares) || squares[i]){ return; }
    
    // Set the state of the ith square to X, this will show up in the game board
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // squares[i] = 'X'
    // setState function sets the React component's state
    // Update the square components in the board, i.e write and X in the square that was clicked
    // flip the xIsNext flag
    this.setState({
      history: history.concat([{ squares: squares }]),
      lastClickedColAndRow : clickedColumnsAndRowHistory.concat([ [column, row] ]),
      squares: squares,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      activeButton: step,
      boldButtonText: true,
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);


//             Helper Functions
// ========================================

function calculateWinner(squares) {
  // possible straight and diagonal lines to win tic-tac-toe
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
    const [a, b, c] = lines[i];
    // if the square is equal to one player, X or Y, for all squares return that player as the winner
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
