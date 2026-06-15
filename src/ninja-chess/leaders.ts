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

export const addLocalLeaderboardScore = (name: string, squares: number, time: number) => {
	localScores.push({ name, squares, time })
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

	for (const leader of leaders) {
		const tr = document.createElement("tr");

		const nameTd = document.createElement("td");
		nameTd.textContent = leader.name;

		const squaresTd = document.createElement("td");
		squaresTd.textContent = leader.squares.toString();

		const timeTd = document.createElement("td");
		timeTd.textContent = leader.time.toString();

		tr.append(nameTd, squaresTd, timeTd);
		leaderboardBody.appendChild(tr);
	}

}

leaderboardButton.addEventListener('click', updateLeaderboard);
