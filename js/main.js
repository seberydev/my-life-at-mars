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
		},
		water: {
			url: "./img/water.svg",
		},
		shield: {
			url: "./img/shield.svg",
		},
		littleAlien: {
			url: "./img/littleAlien.svg",
		},
	};

	return {
		getMarsData: () => {
			return marsData;
		},
		getObjectsData: () => {
			return objectsData;
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
	};

	let hands = document.getElementById(DOMStrings.handsE);

	const spawn = (data) => {
		let spawnContainer = document.querySelector(DOMStrings.spawnContainer);
		let object = document.createElement("img");
		let randomPosX = Math.floor(Math.random() * 60) + 20; //20% - 80%;
		let randomPosY = Math.floor(Math.random() * 30) + 10; //10% - 40%
		let randomKey = Object.keys(data)[
			Math.floor(Math.random() * Object.keys(data).length)
		];

		object.src = data[randomKey].url;
		object.style.position = "absolute";
		object.style.width = "40px";
		object.style.left = `${randomPosX}%`;
		object.style.top = `${randomPosY}%`;
		object.style.cursor = "pointer";
		object.addEventListener("click", (e) => {
			e.target.parentNode.removeChild(e.target);
			hands.classList.add("move-hands");
			setTimeout(() => {
				hands.classList.remove("move-hands");
			}, 1000);
		});

		spawnContainer.appendChild(object);
	};

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

				if (key == "temperature") p.textContent += " C°";

				fragment.appendChild(p);
			});

			container.appendChild(fragment);
		},
		spawnObject: (data) => {
			setInterval(() => {
				spawn(data);
			}, 4000);
		},
	};
})();

// MAIN CONTROLLER
const controller = ((UI, DATA) => {
	const DOM = UI.getDOM();
	const marsData = DATA.getMarsData();
	const objectsData = DATA.getObjectsData();

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
			UI.spawnObject(objectsData);
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

	return {
		init: () => {
			UI.UIinit();
			addEvents();
			getCurrentData();
		},
	};
})(UIController, dataController);

controller.init();
