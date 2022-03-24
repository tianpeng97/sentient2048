class App extends React.Component {
  constructor(props) {
    super(props);

    let newBoard = Array(4)
      .fill()
      .map(() => Array(4).fill(null));
    this.state = {
      board: newBoard,
      size: 4,
      moves: 0,
      score: 0,
      gameOver: false,
      message: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidUpdate() {
    this.tableConstruction();
  }

  componentDidMount() {
    document.body.addEventListener('keydown', (event) => {
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(
          event.code
        ) > -1
      ) {
        event.preventDefault();
      }
    });

    document.body.addEventListener('keydown', this.handleKeyPress);
    this.addRandom2Cells();
    this.tableConstruction();
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeyPress);
  }

  // Direction verical sont inverted car upper-left corner est coord(0, 0)
  handleKeyPress(event) {
    if (!this.state.gameOver) {
      if (event.key == 'ArrowDown') {
        this.sweep({ x: 0, y: 1 });
      } else if (event.key == 'ArrowUp') {
        this.sweep({ x: 0, y: -1 });
      } else if (event.key == 'ArrowRight') {
        this.sweep({ x: 1, y: 0 });
      } else if (event.key == 'ArrowLeft') {
        this.sweep({ x: -1, y: 0 });
      }
    }
  }

  renderCell(row, cell) {
    return (
      <Cell
        key={`cell-${row}-${cell}`}
        value={this.state.board[row][cell]}
        size={this.state.size}
      />
    );
  }

  tableConstruction() {
    if (this.state.size) {
      let tableConstruction = (
        <div className="game-container">
          <div className={`game-over-${this.state.gameOver}`}>
            {this.state.message}
          </div>
          <table id="game" className="board-container">
            <tbody>
              {this.state.board.map((e, row) => (
                <tr className="board-row" key={`row-${row}`}>
                  {this.state.board.map((e, cell) =>
                    this.renderCell(row, cell)
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

      ReactDOM.render(tableConstruction, document.getElementById('game-body'));
    }
  }

  // Retourne value pour chaque cellule
  getCellValue(cellPosition) {
    if (this.isCellPositionAllowed(cellPosition)) {
      return this.state.board[cellPosition.y][cellPosition.x];
    } else {
      return null;
    }
  }

  // Si la position {x, y} est valide dans la table
  isCellPositionAllowed(cellPosition) {
    return (
      cellPosition.x >= 0 &&
      cellPosition.x < this.state.size &&
      cellPosition.y >= 0 &&
      cellPosition.y < this.state.size
    );
  }

  // New Game
  initGame() {
    let newBoard = Array(4)
      .fill()
      .map(() => Array(4).fill(null));
    this.setState(
      {
        board: newBoard,
        score: 0,
        gameOver: false,
        message: '',
      },
      () => {
        this.addRandom2Cells();
      }
    );
  }

  addRandom2Cells() {
    this.addRandomCell();
    this.addRandomCell();
  }

  fetch(score) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: score }),
    };
    fetch('https://sentient2048.herokuapp.com/score', requestOptions);
  }

  // fetchMoves(moves) {
  //   const requestOptions = {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ moves: moves }),
  //   };
  //   fetch('/~pengtian/cgi-bin/tp3.cgi/moves', requestOptions);
  // }

  // Les positions a "lire" selon la direction du sweep
  initSweep(vector) {
    let positions = {
      x: [...Array(this.state.size).keys()],
      y: [...Array(this.state.size).keys()],
    };

    // On merge du plus loin, note que upper-left est {0, 0}
    if (vector.x === 1) positions.x = positions.x.reverse();
    if (vector.y === 1) positions.y = positions.y.reverse();

    return positions;
  }

  move(board, merges, movement, cellValue, currentPosition, newPosition) {
    let newBoard = [...board];
    let newMerge = [...merges];

    // movement
    if (movement === true) {
      newBoard[currentPosition.y][currentPosition.x] = null;
      newBoard[newPosition.y][newPosition.x] = cellValue;
    } else {
      // merges
      newBoard[newPosition.y][newPosition.x] = cellValue * 2;
      newMerge[newPosition.y][newPosition.x] = true;
      newBoard[currentPosition.y][currentPosition.x] = null;
      newMerge[currentPosition.y][currentPosition.x] = false;
    }

    return { newBoard: newBoard, merges: newMerge };
  }

  // Mouvements des cellules selon une direction {x, y}
  sweep(vector) {
    let positions = this.initSweep(vector);
    let merges = Array(this.state.size)
      .fill()
      .map(() => Array(this.state.size).fill(false));
    let newBoard = [...this.state.board];
    let moved = false;

    positions.y.forEach((y) =>
      positions.x.forEach((x) => {
        let cellPosition = { x: x, y: y };
        let cellValue = this.getCellValue(cellPosition);

        // pas d'action pour cell vide
        if (cellValue !== null) {
          let { newCellPosition, mergeReferencePosition } =
            this.getNewPositions(cellPosition, vector);

          let mergeReferenceValue = this.getCellValue(mergeReferencePosition);

          // Maximum de 1 merge pour 2 cellule
          if (
            mergeReferenceValue !== null &&
            mergeReferenceValue === cellValue &&
            !merges[mergeReferencePosition.y][mergeReferencePosition.x]
          ) {
            ({ newBoard, merges } = this.move(
              newBoard,
              merges,
              false,
              cellValue,
              cellPosition,
              mergeReferencePosition
            ));

            let score = this.state.score + cellValue * 2;
            this.setState({ score: score }, () => {
              this.fetch(score);
            });
            if (cellValue * 2 === 2048) {
              this.setState({ gameOver: true, message: 'GAME WON!' });
            }
          } else {
            ({ newBoard, merges } = this.move(
              newBoard,
              merges,
              true,
              cellValue,
              cellPosition,
              newCellPosition
            ));
          }

          let newCellValue = this.getCellValue(cellPosition);
          if (!moved) {
            if (cellValue !== newCellValue) {
              moved = true;
            }
          }
        }
      })
    );
    this.setState({ board: newBoard });

    if (moved) {
      let moves = this.state.moves + 1;
      // this.setState({ moves: moves }, () => {
      //   this.fetchMoves(moves);
      // });

      if (!this.state.gameOver) {
        this.addRandomCell();
      }

      // have to check after adding cell
      if (this.isGameOver()) {
        this.setState({ gameOver: true, message: 'GAME LOST.' });
      }
    }
  }

  // Jeu fini quand plus de cells vides et plus de merge possible
  isGameOver() {
    return !this.getNullCells().length && !this.isMergeable();
  }

  // Can this cell be merged with another
  isMergeable() {
    let cellValue;
    let directions = [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
    ];

    for (let y = 0; y < this.state.size; y++) {
      for (let x = 0; x < this.state.size; x++) {
        let cellPosition = { x: x, y: y };
        cellValue = this.getCellValue(cellPosition);

        if (cellValue !== null) {
          for (const direction of directions) {
            let newCellPosition = { x: x + direction.x, y: y + direction.y };
            let newCellValue = this.getCellValue(newCellPosition);

            if (newCellValue && newCellValue === cellValue) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  // retourne Array de cells vides
  getNullCells() {
    let nullCells = [];
    let board = this.state.board;
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (!board[y][x]) nullCells.push({ x: x, y: y });
      }
    }
    return nullCells;
  }

  // Retourne {x,y} d'une cellule random
  getRandomCell() {
    let nullCells = this.getNullCells();

    if (nullCells.length) {
      return nullCells[Math.floor(Math.random() * nullCells.length)];
    } else {
      return null;
    }
  }

  // Ajoute un nombre dans une cases libre random
  addRandomCell() {
    let nullCells = this.getNullCells();
    if (nullCells.length) {
      let value = Math.random() < 0.8 ? 2 : 4;
      let cellPosition = this.getRandomCell();
      let newBoard = [...this.state.board];
      newBoard[cellPosition.y][cellPosition.x] = value;
      this.setState({ board: newBoard });
    }
  }

  // Est-ce que la cell est libre
  isCellNull(cellPosition) {
    return !this.state.board[cellPosition.y][cellPosition.x];
  }

  // Nouvelle position possible et celle qui devrait etre utiliser pour merge apres sweep
  getNewPositions(cellPosition, direction) {
    let newCellPosition;

    do {
      newCellPosition = cellPosition;
      cellPosition = {
        x: newCellPosition.x + direction.x,
        y: newCellPosition.y + direction.y,
      };
    } while (
      this.isCellPositionAllowed(cellPosition) &&
      this.isCellNull(cellPosition)
    );

    return {
      newCellPosition: newCellPosition,
      mergeReferencePosition: cellPosition,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-info">
          <div className="row">
            <div className="col-5">
              <div className="title text-center" id="game-head">
                <label>2048 Game</label>
                <div id="game-score">Score : {this.state.score}</div>
              </div>
            </div>
            <div className="col-7">
              <div className="settings">
                <div className="form-group" id="board-size">
                  <div className="row">
                    <div className="col">
                      <button
                        id="game-new"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          this.initGame();
                        }}
                      >
                        New Game
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="game-body"></div>
      </div>
    );
  }
}

if (document.getElementById('root')) {
  ReactDOM.render(<App />, document.getElementById('root'));
}
