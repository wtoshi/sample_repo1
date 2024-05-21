// import React, { useState } from 'react'
// import Intro from '../Intro/Intro';
// import Game from '../game/Game';
// import { TranslationValues, IntlProvider } from 'next-intl';

// type SceneChangerProps = {
//     loc: (key: string, values?: TranslationValues) => string;
// }

// const SceneChanger = ({loc} : SceneChangerProps) => {

//     const [introScene, setIntroScene] = useState(true);
//     const [gameScene, setGameScene] = useState(false);

//     return (
//         <div>
//             {introScene && <Intro title ={loc('Intro.title')}/>}

//             {gameScene && <Game />}
//         </div>
//     )
// }

// export default SceneChanger