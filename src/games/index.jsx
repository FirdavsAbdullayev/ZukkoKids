import MemoryGame from './MemoryGame';
import TicTacToeGame from './TicTacToeGame';
import OddOneOutGame from './OddOneOutGame';
import SimonGame from './SimonGame';
import BalloonGame from './BalloonGame';
import NumberHuntGame from './NumberHuntGame';
import ShapesColorsGame from './ShapesColorsGame';
import MazeGame from './MazeGame';

/** game_key -> React komponent */
const GAME_COMPONENTS = {
  memory: MemoryGame,
  tictactoe: TicTacToeGame,
  odd_one_out: OddOneOutGame,
  simon: SimonGame,
  balloon_pop: BalloonGame,
  number_hunt: NumberHuntGame,
  shapes_colors: ShapesColorsGame,
  maze: MazeGame,
};

export default GAME_COMPONENTS;