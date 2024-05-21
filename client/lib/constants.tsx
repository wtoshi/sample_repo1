import { CircleHelp, Route } from "lucide-react";
import { PiLadderSimple,PiLadderSimpleBold   } from "react-icons/pi";

export const navItems =[
    {
      label: 'Nav.howToPlayBtn',
      modalId: 'howToPlayModal',
      iconLight: <CircleHelp />,
      iconDark: <CircleHelp />,
    },
    {
      label: 'Nav.rankingBtn',
      modalId: 'ranksModal',
      iconLight: <Route />,
      iconDark: <Route />,
    }
  ]
  