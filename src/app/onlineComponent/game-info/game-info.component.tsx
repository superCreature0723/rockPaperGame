import { JSX } from 'react';
import logo from '../../assets/images/logo-bonus.svg';

import { GameInfoContainer, GameLogo, GameScore } from './game-info.styles';
import Image from 'next/image';

type GameInfoProps = {
	score: number;
};

const GameInfo = ({ score }: GameInfoProps): JSX.Element => {
	return (
		<GameInfoContainer>
			<GameLogo to='#'>
				<Image src={logo} alt='' />
			</GameLogo>

			<GameScore>
				<span>score</span>
				<span>{score}</span>
			</GameScore>
		</GameInfoContainer>
	);
};

export default GameInfo;
