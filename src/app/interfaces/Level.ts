export interface Level {

	id: number;
	name: string;
	instruction: string;
	blocks: string;
	map: string;
	direction: number;
	blocks_amount: number;
	lock?: boolean;
	stars?: number;
	tips?: string[];

}