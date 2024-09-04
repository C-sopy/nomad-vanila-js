const API_KEY =
  "HgAO0%2BEOZK9p23soEXzEvWp0H8aupgtkzY7BUJrFjlmi%2Fsd8j6UbUCsVrYvLhBj4zcU0fhb96%2B6uuO4CCGXm9A%3D%3D"; // 기상청 api key

// navigator.geolocation.getCurrentPosition() 브라우저에서 위치 좌표 찍어줌
function onGeoOK(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  //   console.log(`lat ${lat}, long ${long}`);
  dfs_xy_conv("toXY", lat, long);
}
// fetch()함수...
function onGeoError() {
  alert("위치를 찾을 수 없습니다");
}

navigator.geolocation.getCurrentPosition(onGeoOK, onGeoError);

function dfs_xy_conv(code, v1, v2) {
  // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
  var RE = 6371.00877; // 지구 반경(km)
  var GRID = 5.0; // 격자 간격(km)
  var SLAT1 = 30.0; // 투영 위도1(degree)
  var SLAT2 = 60.0; // 투영 위도2(degree)
  var OLON = 126.0; // 기준점 경도(degree)
  var OLAT = 38.0; // 기준점 위도(degree)
  var XO = 43; // 기준점 X좌표(GRID)
  var YO = 136; // 기1준점 Y좌표(GRID)

  var DEGRAD = Math.PI / 180.0;
  var RADDEG = 180.0 / Math.PI;

  var re = RE / GRID;
  var slat1 = SLAT1 * DEGRAD;
  var slat2 = SLAT2 * DEGRAD;
  var olon = OLON * DEGRAD;
  var olat = OLAT * DEGRAD;

  var sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  var rs = {};
  if (code == "toXY") {
    rs["lat"] = v1;
    rs["lng"] = v2;
    var ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);
    var theta = v2 * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;
    rs["x"] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs["y"] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  } else {
    rs["x"] = v1;
    rs["y"] = v2;
    var xn = v1 - XO;
    var yn = ro - v2 + YO;
    ra = Math.sqrt(xn * xn + yn * yn);
    if (sn < 0.0) -ra;
    var alat = Math.pow((re * sf) / ra, 1.0 / sn);
    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

    if (Math.abs(xn) <= 0.0) {
      theta = 0.0;
    } else {
      if (Math.abs(yn) <= 0.0) {
        theta = Math.PI * 0.5;
        if (xn < 0.0) -theta;
      } else theta = Math.atan2(xn, yn);
    }
    var alon = theta / sn + olon;
    rs["lat"] = alat * RADDEG;
    rs["lng"] = alon * RADDEG;
  }
  const nx = rs.x;
  const ny = rs.y;
  //   console.log(`toXY된 nx: ${nx}, ny: ${ny}`);
  getWetherInfo(nx, ny);
}

async function getWetherInfo(nx, ny) {
  const currentDate = new Date();

  // 현재 날짜 구하기 (YYYYMMDD)
  const year = currentDate.getFullYear().toString();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const day = ("0" + currentDate.getDate()).slice(-2);
  const base_date = year + month + day;

  // 현재 시간의 30분 전 시간:
  const agoTime = new Date(currentDate.getTime() - 30 * 60000);

  // 현재 시간 구하기 (0000 형태)
  const hours = ("0" + agoTime.getHours()).slice(-2);
  const minutes = ("0" + agoTime.getMinutes()).slice(-2);
  const base_time = hours + minutes;

  const urlNsct = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${API_KEY}&numOfRows=10&pageNo=1&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}&dataType=json`;
  const urlFcst = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${API_KEY}&numOfRows=1000&pageNo=1&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}&dataType=json`;
  await fetch(urlNsct)
    .then((response) => response.json())
    .then((data) => {
      const nsctData = data.response.body.items.item;
      const degree = nsctData[3].obsrValue;
      const degreeSpan = document.querySelector("#weather span:first-child");
      degreeSpan.innerText = `${degree}℃`;
    });

  await fetch(urlFcst)
    .then((response) => response.json())
    .then((data) => {
      const fcstData = data.response.body.items.item;
      let skyStatus = fcstData[18].fcstValue;
      switch (skyStatus) {
        case "1":
          skyStatus = "맑음";
          break;
        case "3":
          skyStatus = "구름 많음";
          break;
        case "4":
          skyStatus = "흐림";
          break;
      }
      const skySpan = document.querySelector("#weather span:last-child");
      skySpan.innerText = skyStatus;
    });
}
