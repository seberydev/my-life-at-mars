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
			let spawnContainer = document.querySelector(DOMStrings.spawnContainer);
			let object = document.createElement("img");
			object.src = data.bottle.url;
			object.style.position = "absolute";
			object.style.width = "40px";
			object.style.left = "50%";
			object.style.top = "0";
			object.style.cursor = "pointer";
			object.addEventListener("click", (e) => {
				e.target.parentNode.removeChild(e.target);
			});

			spawnContainer.appendChild(object);
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
			UI.spawnObject(objectsData);
		},
	};
})(UIController, dataController);

controller.init();
