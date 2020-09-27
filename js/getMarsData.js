const getMarsData = async () => {
	try {
		let obj = await fetch(
			"https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0"
		);
		let json = await obj.json();

		if (!obj.ok) throw { status: obj.status, statusText: obj.statusText };

		let sol = json["652"];

		return {
			currentDate: {
				name: "Date: ",
				info: sol.Last_UTC.substring(0, 10),
			},
			season: {
				name: "Season: ",
				info: sol.Season,
			},
			temperature: {
				name: "Temperature: ",
				info: ((sol.AT.av - 32) * (5 / 9)).toFixed(2),
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
