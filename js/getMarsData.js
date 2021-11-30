const getMarsData = async () => {
  try {
    let obj = await fetch(
      "https://mars.nasa.gov/rss/api/?feed=weather&category=insight_temperature&feedtype=json&ver=1.0"
    );
    let json = await obj.json();
    const season = Object.entries(json)[0][1].Season;
    const temperature = Object.entries(json)[0][1]["AT"].av.toFixed(1);

    if (!obj.ok) throw { status: obj.status, statusText: obj.statusText };

    let currentDate = new Date();
    currentDate =
      currentDate.getFullYear() +
      "/" +
      (currentDate.getMonth() + 1) +
      "/" +
      currentDate.getDate();

    return {
      currentDate: {
        name: "Date: ",
        info: currentDate,
      },
      season: {
        name: "Season: ",
        info: season,
      },
      temperature: {
        name: "Temperature: ",
        info: temperature,
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
