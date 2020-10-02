const getMarsData = async () => {
	try {
		let obj = await fetch(
			"https://api.nasa.gov/insight_weather/?api_key=Zl2IWXW5Yzn5aBXakvxptsiGtUnFCORaVFmYxhZK&feedtype=json&ver=1.0?"
		);
		let json = await obj.json();

		if (!obj.ok) throw { status: obj.status, statusText: obj.statusText };

		let sol = json["652"];
		let currentDate = new Date();
		currentDate =
			currentDate.getFullYear() +
			"-" +
			(currentDate.getMonth() + 1) +
			"-" +
			currentDate.getDate();

		return {
			currentDate: {
				name: "Date: ",
				info: currentDate,
			},
			season: {
				name: "Season: ",
				info: sol.Season,
			},
			temperature: {
				name: "Temperature: ",
				info: sol.AT.av.toFixed(1),
			},
		};
	} catch (err) {
		return {
			status: err.status || "ERROR: ",
			statusText: err.statusText || "UNKNOWN",
		};
	}
};

export default getMarsData;
