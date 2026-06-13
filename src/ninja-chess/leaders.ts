type Leader = {
	name: string,
	squares: number,
	time: number;
}

export const leaders: Leader[] = [{
	name: "Alice",
	squares: 120,
	time: 1000
},
{
	name: "Bob",
	squares: 110,
	time: 1200
}
];


let localScores = []
export const addLocalScore = (name: string, squares: number, time: number) => {
	localScores.push({ name, squares, time })
}


const leaderboardButton = document.querySelector<HTMLButtonElement>('#leaderboardButton')
const leaderboardDialog = document.querySelector<HTMLDialogElement>('#leaderboardDialog')

if (!leaderboardButton || !leaderboardDialog) {
	throw new Error(`Could not find leaderboard elements`)
}
