document.addEventListener("DOMContentLoaded", () => {
  const fetchAirPollution = async () => {
    try {
      const response = await fetch("/api/data");
      const data = await response.json();

      const pollutantNames = {
        co: "Carbon Monoxide (CO)",
        no2: "Nitrogen dioxide (NO2)",
        no: "Nitrogen monoxide (NO)",
        o3: "Ozone (O3)",
        so2: "Sulphur dioxide (SO2)",
        pm2_5: "particulates (PM2.5)",
        pm10: "particulates (PM10)",
        nh3: "Ammonia (NH3)",
      };

      const healthParameter = {
        good: {
          "Air Purifier": "Turn Off",
          "N95 Mask": "Recommended",
          "Stay Indoor": "Recommended",
          "Car Filter": "Recommended",
        },
        moderate: {
          "Air Purifier": "Turn On",
          "N95 Mask": "Recommended",
          "Stay Indoor": "Recommended",
          "Car Filter": "Recommended",
        },
        bad: {
          "Air Purifier": "Turn On",
          "N95 Mask": "Must",
          "Stay Indoor": "Must",
          "Car Filter": "Must",
        },
      };

      const pollutantCard = `
              ${Object.entries(data.list[0].components)
                .map(([item, value]) => {
                  const abbreviation = pollutantNames[item];
                  return `<div class="pollutant">
                      <h2>${value} ppb</h2>
                      <p>${abbreviation}</p>
                  </div>`;
                })
                .join("")}
          `;

      const aqi = `
              ${Object.entries(data.list[0].main)
                .map(([item, value]) => {
                  return `
                  <h3>${item.toUpperCase()}</h3>
                  <p class="aqi-val">${value}</p>
                  `;
                })
                .join("")}
          `;

      function timeConverter() {
        const { dt } = data.list[0];
        const unix = new Date(dt * 1000);
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const getYear = unix.getFullYear();
        const getMonth = months[unix.getMonth()];
        const getDate = unix.getDate();
        const getHour = unix.getHours();
        const getMinute = '0' + unix.getMinutes();
        const getCalendarDate = getDate + "/" + getMonth + "/" + getYear;
        const getTime = getHour + ":" + getMinute.substring(1);
        return `
                  <h2>Last Updated:</h2>
                  <time class="date">${getCalendarDate}</time><br />
                  <time>${getTime}</time>
                `;
      }

      function renderHealth() {
        const getAqi = data.list[0].main.aqi;
        let parameter;

        if (getAqi <= 50) {
          parameter = "good";
        } else if (getAqi > 50 && getAqi <= 100) {
          parameter = "moderate";
        } else {
          parameter = "bad";
        }

        return `
          ${Object.entries(healthParameter[parameter])
            .map(
              ([key, value]) => `
              <div class="health">
                <h3>${key}</h3>
                <div>
                  <p>${value}</p>
                </div>
              </div>
            `
            )
            .join("")}
        `;
      }

      const item = document.querySelector(".item");
      const lastUpdate = document.querySelector(".item:nth-child(5)");
      const aqiScore = document.querySelector(".aqi-score");
      const warning = document.querySelector(".warnings");
      item.innerHTML = pollutantCard;
      aqiScore.innerHTML = aqi;
      lastUpdate.innerHTML = timeConverter();
      warning.innerHTML = renderHealth();

      function map() {
        const map = L.map("map").setView([data.coord.lat, data.coord.lon], 13);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        const marker = L.marker([data.coord.lat, data.coord.lon]).addTo(map);
        marker
          .bindPopup(
            "<b>マツモト 臨時 駐車場, 伏見向日線</b><br/><b>Minami Ward, Muko, Kyoto Prefecture</b>"
          )
          .openPopup();
      }

      map();
    } catch (error) {
      console.error("error fetching data:", error);
    }
  };

  fetchAirPollution();
});
