import setPhoto from "./setMarsPhoto.js";

// UI CONTROLLER
const UIController = (() => {
	return {
		UIinit: () => {
			let elements = {
				body: document.querySelector("body"),
				loadingE: document.querySelector(".loading-container"),
				errorE: document.querySelector(".error-loading-container"),
				errorTextE: document.querySelector(".error-loading-container div p"),
			};
			setPhoto(elements);
		},
	};
})();

// MAIN CONTROLLER
const controller = ((UI) => {
	return {
		init: () => {
			UI.UIinit();
		},
	};
})(UIController);

controller.init();
