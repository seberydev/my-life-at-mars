const setPhoto = async (elements) => {
	try {
		let obj = await fetch(
			"http://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?sol=1000"
		);
		let res = await obj.json();

		if (!obj.ok) throw { status: obj.status, statusText: obj.statusText };

		elements.body.style.background = `black url(${res.photos[690].img_src}) no-repeat`;
		elements.body.style.backgroundSize = "cover";

		elements.loadingE.style.display = "none";
	} catch (err) {
		elements.errorTextE.textContent = err.status || "ERROR: ";
		elements.errorTextE.textContent += err.statusText || "UNKNOWN";
		elements.errorE.style.display = "block";
	}
};

export default setPhoto;
