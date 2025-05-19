import GameInfo from '../onlineComponent/game-info/game-info.component';
import OnlineGameBody from './game-body';
import GameRulesImage from '../onlineComponent/game-rules/game-rules.component';
import GameRulesBtn from '../onlineComponent/game-rules-btn/game-rules-btn.component';
import GameStatus from './game-status';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setShowRules } from "../redux/rules/rules.slice";
import { JSX } from 'react';

const OnlineGameStart = (): JSX.Element => {
	const { score } = useAppSelector(state => state.onlineScorer);
	const { showRules } = useAppSelector(state => state.rules);

	const dispatch = useAppDispatch();

	const rulesHandler = () => dispatch(setShowRules(!showRules));

	return (
		<div className='Game Game__Container'>
			<GameInfo score={score} />
			<OnlineGameBody />

			<GameStatus />

			{showRules ? (
				<GameRulesImage closeHandler={rulesHandler} />
			) : (
				<GameRulesBtn openHandler={rulesHandler} />
			)}
		</div>
	);
};

export default OnlineGameStart;
