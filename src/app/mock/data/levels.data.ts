import { Level } from '../../interfaces/Level';

export const LEVELS: Level[] = [
	{
		id: 1,
		name: 'Nível 1',
		instruction: 'Faça a fase.',
		blocks: `
			<block type="ucode_moveForward"></block>
			<block type="ucode_turn"><field name="DIR">turnLeft</field></block>
			<block type="ucode_turn"><field name="DIR">turnRight</field></block>
			<block type="ucode_if"><field name="DIR">isPathLeft</field></block>
			<block type="ucode_ifElse"></block>
			<block type="ucode_forever"></block>
		`,
		map: `[
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 2, 1, 3, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0]
		]`,
		direction: 0,
		blocks_amount: null,
	}	
];