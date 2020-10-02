import setPhoto from "./setMarsPhoto.js";
import getMarsData from "./getMarsData.js";

//DATA CONTROLLER
const dataController = (() => {
	let marsData = {
		temperature: "",
		date: "",
		season: "",
	};

	const objectsData = {
		bottle: {
			url: "./img/bottle.svg",
			w: "40px",
			do: () => {
				playerData.food += 3;
				if (playerData.food > 100) playerData.food = 100;
			},
		},
		water: {
			url: "./img/water.svg",
			w: "60px",
			do: () => {
				playerData.water += 6;
				if (playerData.water > 100) playerData.water = 100;
			},
		},
		shield: {
			url: "./img/shield.svg",
			w: "60px",
			do: () => {
				playerData.water += 3;
				if (playerData.water > 100) playerData.water = 100;

				playerData.food += 3;
				if (playerData.food > 100) playerData.food = 100;
			},
		},
		littleAlien: {
			url: "./img/littleAlien.svg",
			w: "100px",
			do: () => {
				playerData.health -= 5;
				if (playerData.health < 0) playerData.health = 0;
			},
		},
		bigAlien: {
			url: "./img/bigAlien.svg",
			w: "100px",
			do: () => {
				playerData.health -= 15;
				if (playerData.health < 0) playerData.health = 0;
			},
		},
		box: {
			url: "./img/box.svg",
			w: "40px",
			do: () => {
				let random = Math.floor(Math.random() * 4);

				switch (random) {
					case 0:
						playerData.food += 3;
						if (playerData.food > 100) playerData.food = 100;
						break;
					case 1:
						playerData.water += 6;
						if (playerData.water > 100) playerData.water = 100;
						break;
					case 2:
						playerData.health += 20;
						if (playerData.health > 100) playerData.health = 100;
						break;
					case 3:
						playerData.health -= 20;
						if (playerData.health < 0) playerData.health = 0;
						break;
				}
			},
		},
	};

	let playerData = {
		health: 100,
		food: 100,
		water: 100,
		score: 0,
	};

	return {
		getMarsData: () => {
			return marsData;
		},
		getObjectsData: () => {
			return objectsData;
		},
		getPlayerData: () => {
			return playerData;
		},
	};
})();

// UI CONTROLLER
const UIController = (() => {
	const DOMStrings = {
		body: "body",
		loadingE: ".loading-container",
		errorE: ".error-loading-container",
		errorTextE: ".error-loading-container div p",
		startBtn: "start-btn",
		mainE: "main",
		gameContainer: ".game-container",
		solInfoE: ".game-container .sol-info",
		spawnContainer: ".game-container .object-spawner-container",
		handsE: "hands",
		handsAnim: "move-hands",
		deleteE: "delete-element",
		foodBar: "foodProgress",
		waterBar: "waterProgress",
		healthBar: "healthProgress",
		gameOverE: "gameOverContainer",
		volumeE: "volume",
		scoreE: ".score-container",
	};

	let hands = document.getElementById(DOMStrings.handsE);

	const spawn = (data, playerData) => {
		let spawnContainer = document.querySelector(DOMStrings.spawnContainer);
		let object = document.createElement("img");
		let randomPosX = Math.floor(Math.random() * 60) + 20; //20% - 80%;
		let randomPosY = Math.floor(Math.random() * 30) + 10; //10% - 40%
		let randomKey = Object.keys(data)[
			Math.floor(Math.random() * Object.keys(data).length)
		];

		object.src = data[randomKey].url;
		object.style.position = "absolute";
		object.style.width = data[randomKey].w;
		object.style.left = `${randomPosX}%`;
		object.style.top = `${randomPosY}%`;
		object.style.cursor = "pointer";

		//HANDS ANIMATION
		object.addEventListener("click", (e) => {
			data[randomKey].do();
			updateUI(playerData);

			e.target.parentNode.removeChild(e.target);
			hands.classList.add("move-hands");
			setTimeout(() => {
				hands.classList.remove("move-hands");
			}, 1000);
		});

		//REMOVE ELEMENT
		object.addEventListener("animationend", (e) => {
			e.target.parentNode.removeChild(e.target);
		});

		object.classList.add(DOMStrings.deleteE);
		spawnContainer.appendChild(object);
	};

	const updateUI = (data) => {
		let health = document.getElementById(DOMStrings.healthBar),
			food = document.getElementById(DOMStrings.foodBar),
			water = document.getElementById(DOMStrings.waterBar);

		health.value = `${data.health}`;
		food.value = `${data.food}`;
		water.value = `${data.water}`;
	};

	const gameOverUI = (statsInt, healthInt) => {
		let container = document.getElementById(DOMStrings.gameOverE);
		container.style.display = "block";
		clearInterval(spawnInterval);
		clearInterval(statsInt);
		clearInterval(healthInt);
		clearInterval(scoreInterval);
	};

	//INTERVALS
	let spawnInterval;
	let scoreInterval;

	return {
		UIinit: () => {
			let elements = {
				body: document.querySelector(DOMStrings.body),
				loadingE: document.querySelector(DOMStrings.loadingE),
				errorE: document.querySelector(DOMStrings.errorE),
				errorTextE: document.querySelector(DOMStrings.errorTextE),
			};
			setPhoto(elements);
		},
		getDOM: () => {
			return DOMStrings;
		},
		setMarsDataUI: (data) => {
			let fragment = document.createDocumentFragment();
			let container = document.querySelector(DOMStrings.solInfoE);
			let params = Object.keys(data);

			params.map((key) => {
				let p = document.createElement("p");
				p.textContent = data[key].name + data[key].info;

				if (key == "temperature") p.textContent += " °F";

				fragment.appendChild(p);
			});

			container.appendChild(fragment);
		},
		spawnObject: (data, playerData) => {
			spawnInterval = setInterval(() => {
				spawn(data, playerData);
			}, 4000);

			scoreInterval = setInterval(() => {
				playerData.score++;
				document.querySelector(
					DOMStrings.scoreE
				).innerHTML = `<p>Score: ${playerData.score}</p>`;
			}, 1000);
		},
		updateStatsUI: (data, stats, health) => {
			updateUI(data);
			if (data.health <= 0) gameOverUI(stats, health);
		},
	};
})();

// MAIN CONTROLLER
const controller = ((UI, DATA) => {
	const DOM = UI.getDOM();
	const marsData = DATA.getMarsData();
	const objectsData = DATA.getObjectsData();
	const playerData = DATA.getPlayerData();

	//INTERVALS
	let statsInterval;
	let healthInterval;

	const addEvents = () => {
		//START THE GAME
		document.getElementById(DOM.startBtn).addEventListener("click", () => {
			const body = document.querySelector(DOM.body),
				main = document.querySelector(DOM.mainE),
				gameContainer = document.querySelector(DOM.gameContainer);

			main.style.display = "none";
			body.style.background = `black url(./img/ground.png)`;
			body.style.backgroundSize = "180px 180px";
			gameContainer.style.display = "block";
			UI.setMarsDataUI(marsData);
			UI.spawnObject(objectsData, playerData);
			managePlayerStats();
			document.querySelector(DOM.scoreE).style.display = "flex";
		});

		let audio = new Audio("./sounds/bitSpace.mp3");
		audio.loop = true;
		let ready = false;

		audio.addEventListener("canplaythrough", () => {
			audio.play();
			ready = true;
		});

		document.getElementById(DOM.volumeE).addEventListener("click", (e) => {
			let target = e.target;
			if (target.classList[1].includes("up") && ready) {
				target.classList.remove("fa-volume-up");
				target.classList.add("fa-volume-mute");
				audio.pause();
			} else if (ready) {
				target.classList.remove("fa-volume-mute");
				target.classList.add("fa-volume-up");
				audio.play();
			}
		});
	};

	const getCurrentData = async () => {
		let obj = await getMarsData();
		if (obj.hasOwnProperty("status")) {
			document.querySelector(DOM.errorTextE).textContent = obj.status;
			document.querySelector(DOM.errorTextE).textContent += obj.statusText;
			document.querySelector(DOM.errorE).style.display = "block";
		} else {
			marsData.temperature = obj.temperature;
			marsData.date = obj.currentDate;
			marsData.season = obj.season;
		}
	};

	const managePlayerStats = () => {
		statsInterval = setInterval(() => {
			playerData.food -= 3;
			playerData.water -= 6;
			UI.updateStatsUI(playerData, statsInterval, healthInterval);
		}, 3000);

		healthInterval = setInterval(() => {
			if (playerData.food <= 10 || playerData.water <= 10) {
				playerData.health -= 20;
			} else if (playerData.food <= 50 || playerData.water <= 50) {
				playerData.health -= 10;
			} else {
				playerData.health -= 5;
			}
			UI.updateStatsUI(playerData, statsInterval, healthInterval);
		}, 9000);

		UI.updateStatsUI(playerData, statsInterval, healthInterval);
	};

	return {
		init: () => {
			UI.UIinit();
			addEvents();
			getCurrentData();
		},
	};
})(UIController, dataController);

controller.init();
