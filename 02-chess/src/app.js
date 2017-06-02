import $ from 'jquery';
import ChessBoard from 'chessboardjs';
import { Chess } from 'chess.js';
import config from './config';
import io from 'socket.io-client'

window.$ = $;

const path = window.location.href;
let info = true;
let moveHistoryCount = 0;
const chess = new Chess();
const socket = io(config.SERVER_URL);

// chessboard
const onDrop = (source, target) => {
  moveHistoryCount += 1;
  const move = chess.move({
    from: source,
    to: target,
  });

  if (move === null) return 'snapback';

  socket.emit('move', {
    move,
  });
  $('#moveHistory').append(`<div>${moveHistoryCount}: ${source} ${target}</div>`);
};

const onDragStart = (source, piece, position, orientation) => {
  if (chess.game_over() === true ||
    (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
    (chess.turn() === 'b' && piece.search(/^w/) !== -1) ||
    (orientation === 'white' && piece.search(/^w/) === -1) ||
    (orientation === 'black' && piece.search(/^b/) === -1)) {
    return false;
  }

  return true;
};

const boardConfig = {
  draggable: true,
  moveSpeed: 'slow',
  snapbackSpeed: 1000,
  snapSpeed: 100,
  onDrop,
  onDragStart,
};

const board = ChessBoard('board', boardConfig);

const joinGame = () => {
  if (path.toString().split('/')[3]) {
    socket.emit('join game', {
      game: path.toString().split('/')[3],
    });
  }
};

socket.on('game created', (data) => {
  $('#gameInfo').append(`<div>Successfully created a game with id: ${data.game.id}!</div>`);
  history.pushState({}, 'New Game', data.game.id);
});

socket.on('game joined', (data) => {
  $('#gameInfo').append(`<div>Successfully joined the game with id: ${data.game.id}!</div>`);
  $('#gameInfo').append(`<div>Joined as player: ${data.player.color}!</div>`);

  if (data.player.color !== board.orientation()) {
    board.flip();
  }

  board.position(data.game.fen);
  chess.load(data.game.fen);
});

socket.on('move', (data) => {
  chess.move(data.move);
  board.position(chess.fen());
});

socket.on('undo', () => {
  console.log('hi');
  chess.undo();
  board.position(chess.fen(), false);
});

joinGame();

// Buttons
$('#newGame').on('click', () => {
  board.start();
  socket.emit('new game');
});

$('#restart').on('click', () => {
  board.start();
  socket.emit('restart');
});

$('#undo').on('click', () => {
  chess.undo();
  board.position(chess.fen(), false);
  socket.emit('undo');
});

$('#infoButton').on('click', () => {
  info = !info;
  if (info) {
    return $('.gameInfo').show();
  }
  return $('.gameInfo').hide();
});
