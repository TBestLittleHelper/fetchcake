type Leader = {
	name: string,
	squares: number,
	timeInMilliseconds: number;
}

const leaders: Leader[] = [{
	name: "Alice",
	squares: 1600,
	timeInMilliseconds: 130000
},
{
	name: "Bob",
	squares: 1100,
	timeInMilliseconds: 120000
},
{
	name: "Charlie",
	squares: 1004,
	timeInMilliseconds: 101982
}
];


let localScores: Leader[] = []

export const addLocalLeaderboardScore = (squares: number, time: number) => {
	localScores.push({ name: "Your Score", squares, timeInMilliseconds: time })
}


const leaderboardButton = document.querySelector<HTMLButtonElement>('#leaderboardButton')
const leaderboardDialog = document.querySelector<HTMLDialogElement>('#leaderboardDialog')
const leaderboardBody = document.querySelector<HTMLTableSectionElement>('#leaderboardBody')

if (!leaderboardButton || !leaderboardDialog) {
	throw new Error(`Could not find leaderboard elements`)
}

function updateLeaderboard() {
	console.log("updating leaderboard ", leaders)
	if (!leaderboardBody) {
		throw new Error(`Could not find leaderboard body`)
	}

	leaderboardBody.innerHTML = ''

	let allLeaders = [...leaders, ...localScores]
	allLeaders.sort((a, b) => a.timeInMilliseconds - b.timeInMilliseconds)

	for (const leader of allLeaders) {
		const tr = document.createElement("tr");

		const nameTd = document.createElement("td");
		nameTd.textContent = leader.name;

		const squaresTd = document.createElement("td");
		squaresTd.textContent = leader.squares.toString();

		const timeTd = document.createElement("td");
		const timeInSeconds = leader.timeInMilliseconds / 1000;
		timeTd.textContent = timeInSeconds.toFixed(2);

		tr.append(nameTd, squaresTd, timeTd);
		leaderboardBody.appendChild(tr);
	}

}

leaderboardButton.addEventListener('click', updateLeaderboard);
