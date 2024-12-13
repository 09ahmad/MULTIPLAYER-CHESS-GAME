import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages"; 

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private moves: string[];
    private startTime: Date;
    private moveCount = 0;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date();

        // Initialize players with colors
        this.player1.send(
            JSON.stringify({
                type: INIT_GAME,
                payload: {
                    color: "white",
                },
            })
        );
        this.player2.send(
            JSON.stringify({
                type: INIT_GAME,
                payload: {
                    color: "black",
                },
            })
        );
    }

    makeMove(socket: WebSocket, move: { from: string; to: string }) {
        // Validate whose turn it is
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("Not player1's turn");
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("Not player2's turn");
            return;
        }

        // Attempt to make the move
        try {
            const result = this.board.move(move);
            if (!result) {
                console.log("Invalid move:", move);
                return;
            }
        } catch (e) {
            console.error("Error processing move:", e);
            return;
        }

        // Update move count and log the move
        this.moves.push(`${move.from}-${move.to}`);
        this.moveCount++;

        // Check if the game is over
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white"; // Determine winner based on the turn
            console.log("Game over. Winner:", winner);

            // Notify both players about the game over
            this.player1.send(
                JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner,
                    },
                })
            );
            this.player2.send(
                JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner,
                    },
                })
            );
            return;
        }

        // Notify the opponent about the move
        const nextPlayer = this.moveCount % 2 === 0 ? this.player1 : this.player2;
        nextPlayer.send(
            JSON.stringify({
                type: MOVE,
                payload: move,
            })
        );
    }
}

        // validate here
        // is it this users move 
        // is the move valid

        // update teh board
        // push the move

        // check if the game is over

        // send the updated board to both players  