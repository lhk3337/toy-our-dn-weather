const apiUrl = async (x: number, y: number, islowHightemper: boolean) => {
  const url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst"; /*단기예보조회*/
  // function nowHour() {
  //   // 초단기 예보 날씨 api 데이터가 정시 기준으로 45분 이후에 새로 업데이트 함
  //   // 45분전이면 1시간 전 시간을, 45분보다 크면 현재 시간을 가져온다.
  //   const min = new Date().getMinutes();

  //   if (min < 45) {
  //     const time = (new Date().getHours() - 1).toString().padStart(2, "0");
  //     if (time === "-1") {
  //       //00:00일때 처리하기
  //       return "23:30";
  //     } else {
  //       return time + "30";
  //     }
  //   } else {
  //     const time = new Date().getHours().toString().padStart(2, "0");
  //     return time + "30";
  //   }
  // }

  function times() {
    const hours = Number(new Date().toLocaleString("en-GB", { hour: "numeric", timeZone: "Asia/Seoul" } as any));

    let result;
    if (hours < 2) {
      result = 23;
    } else {
      result = hours - ((hours + 1) % 3);
    }
    return result < 10 ? result.toString().padStart(2, "0") + "00" : result.toString() + "00";
  }

  const getToday = () => {
    const date = new Date();
    const year = date.toLocaleString("en-GB", { year: "numeric", timeZone: "Asia/Seoul" } as any);
    const month = date.toLocaleString("en-GB", { month: "numeric", timeZone: "Asia/Seoul" } as any).padStart(2, "0");

    if (times() === "2300") {
      const day = (Number(date.toLocaleDateString("en-GB", { day: "2-digit", timeZone: "Asia/Seoul" })) - 1)
        .toString()
        .padStart(2, "0");
      return `${year}${month}${day}`;
    } else {
      const day = date.toLocaleDateString("en-GB", { day: "2-digit", timeZone: "Asia/Seoul" }).padStart(2, "0");
      return `${year}${month}${day}`;
    }
  };
  if (islowHightemper) {
    let queryParams = "?" + encodeURIComponent("serviceKey") + "=" + process.env.SERVICE_KEY;
    queryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /**/
    queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("158"); /**/
    queryParams += "&" + encodeURIComponent("dataType") + "=" + encodeURIComponent("JSON"); /**/
    queryParams +=
      "&" + encodeURIComponent("base_date") + "=" + encodeURIComponent(getToday()); /*오늘 날짜를 yyyymmdd로 표현 */
    queryParams += "&" + encodeURIComponent("base_time") + "=" + encodeURIComponent("0200"); /* 예보 발표 시간  */
    queryParams += "&" + encodeURIComponent("nx") + "=" + encodeURIComponent(x); /**/
    queryParams += "&" + encodeURIComponent("ny") + "=" + encodeURIComponent(y); /**/
    return (await fetch(url + queryParams)).json();
  } else {
  }
  let queryParams = "?" + encodeURIComponent("serviceKey") + "=" + process.env.SERVICE_KEY;
  queryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /**/
  queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("115"); /**/
  queryParams += "&" + encodeURIComponent("dataType") + "=" + encodeURIComponent("JSON"); /**/
  queryParams +=
    "&" + encodeURIComponent("base_date") + "=" + encodeURIComponent(getToday()); /*오늘 날짜를 yyyymmdd로 표현 */
  queryParams += "&" + encodeURIComponent("base_time") + "=" + encodeURIComponent(times()); /* 예보 발표 시간  */
  queryParams += "&" + encodeURIComponent("nx") + "=" + encodeURIComponent(x); /**/
  queryParams += "&" + encodeURIComponent("ny") + "=" + encodeURIComponent(y); /**/

  return (await fetch(url + queryParams)).json();
};
export default apiUrl;
