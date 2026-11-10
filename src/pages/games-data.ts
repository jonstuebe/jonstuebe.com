import chainIcon from "@/assets/games/chain.png";
import closecallIcon from "@/assets/games/closecall.png";
import originIcon from "@/assets/games/origin.png";
import plotlineIcon from "@/assets/games/plotline.png";
import sudokuIcon from "@/assets/games/sudoku.png";
import timestackIcon from "@/assets/games/timestack.png";
import trashIcon from "@/assets/games/trash.svg";
import triviaIcon from "@/assets/games/trivia.png";
import wordwheelIcon from "@/assets/games/wordwheel.png";

export type Game = {
  id: string;
  name: string;
  href: string;
  /** The game's home-screen app icon, copied from its repo. */
  icon: string;
};

// Add new games to the end of this list. People who have saved a custom
// order will see new games appear at the bottom of their layout.
export const GAMES: Game[] = [
  {
    id: "timestack",
    name: "Timestack",
    href: "https://timestack.jonstuebe.com/",
    icon: timestackIcon,
  },
  {
    id: "chain",
    name: "Chain",
    href: "https://chain.jonstuebe.com/",
    icon: chainIcon,
  },
  {
    id: "closecall",
    name: "Close Call",
    href: "https://closecall.jonstuebe.com/",
    icon: closecallIcon,
  },
  {
    id: "plotline",
    name: "Plotline",
    href: "https://plotline.jonstuebe.com/",
    icon: plotlineIcon,
  },
  {
    id: "wordwheel",
    name: "WordWheel",
    href: "https://wordwheel.jonstuebe.com/",
    icon: wordwheelIcon,
  },
  {
    id: "trivia",
    name: "Trivia",
    href: "https://trivia.jonstuebe.com/",
    icon: triviaIcon,
  },
  {
    id: "trash",
    name: "Trash",
    href: "https://trash.jonstuebe.com/",
    icon: trashIcon,
  },
  {
    id: "origin",
    name: "Origin",
    href: "https://origin.jonstuebe.com/",
    icon: originIcon,
  },
  {
    id: "sudoku",
    name: "Sudoku",
    href: "https://sudoku.jonstuebe.com/",
    icon: sudokuIcon,
  },
];
