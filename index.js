const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccess=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const errorInfo=document.querySelector(".error-info");
console.log(errorInfo);
let currentTab=userTab;
const API_key='36b5e1986972b661834d4e17d0204359';
currentTab.classList.add("current-tab");
getFromSessionStorage();
function switchTab(clickedTab)
{
  if(clickedTab!=currentTab)
  {
      currentTab.classList.remove("current-tab");
      currentTab=clickedTab;
      currentTab.classList.add("current-tab"); 
      errorInfo.classList.remove("active");
      if(!searchForm.classList.contains("active"))
      {
        grantAccess.classList.remove("active");
        userInfoContainer.classList.remove("active");
        searchForm.classList.add("active");
      }
      else
      {
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getFromSessionStorage();
      }
  }
}
userTab.addEventListener("click",()=>{
    switchTab(userTab);
})
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})
 function  getFromSessionStorage()
 {
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        grantAccess.classList.add("active");
    }
    else
    {
        const cordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(cordinates);
    }
 }
 async function fetchUserWeatherInfo(cordinates)
 {
    const {lat,lon}=cordinates;
    grantAccess.classList.remove("active");
    loadingScreen.classList.add("active");
    try
    {  
        const res=  await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const data=await res.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderweatherInfo(data);
    }
    catch(err)
    {
      loadingScreen.classList.remove("active");
    }
 }
 function renderweatherInfo(weatherInfo)
 {   const code=`${weatherInfo?.cod}`;
     const CityName=document.querySelector("[data-cityName]");
     const countryIcon=document.querySelector("[data-countryIcon]");
     const desc=document.querySelector("[data-weatherDesc]");
     const weatherIcon=document.querySelector("[data-weatherIcon]");
     const temp=document.querySelector("[data-temp]");
     const windSpeed=document.querySelector("[data-windSpeed]");
     const humidity=document.querySelector("[data-humidity]");
     const cloud=document.querySelector("[data-cloudiness]");
     CityName.innerText=weatherInfo?.name;
     let country=`${weatherInfo?.sys?.country.toLowerCase()}`;
     countryIcon.src=`https://flagcdn.com/144x108/${country}.png`;
     desc.innerText=weatherInfo?.weather?.[0]?.description;
     let weather=`${weatherInfo?.weather?.[0]?.icon}`;
     weatherIcon.src=`https://openweathermap.org/img/w/${weather}.png`;
     let temp1=`${weatherInfo?.main?.temp-273.15}`;
     temp1=parseFloat(temp1);
     temp1=temp1.toFixed(2);
     temp.innerText=`${temp1}°c`;
     windSpeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
     humidity.innerText=`${weatherInfo?.main?.humidity} %`;
     cloud.innerText=`${weatherInfo?.clouds?.all} %`;
 }
 const grantAccesBtn=document.querySelector("[data-grantaccess]");
 grantAccesBtn.addEventListener("click",getLocation);
 function getLocation()
 {
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
       console.log("Acces denied");
    }
 }
 function showPosition(position)
 {
    const userCordinates={
        lat: position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCordinates));
    fetchUserWeatherInfo(userCordinates);
 }

 const searchInput=document.querySelector("[data-searchInput]");
 const searchButton=document.querySelector(".btn1");

 searchButton.addEventListener("click",(e)=>{
    let cityName=searchInput.value;
    errorInfo.classList.remove("active");
    if(cityName==="")
    return;
    else
    fetchSearchWeatherInfo(cityName);
 })
async function fetchSearchWeatherInfo(city)
{
        loadingScreen.classList.add("active");
        userInfoContainer.classList.remove("active");
        grantAccess.classList.remove("active");
        try
        {
          const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
          if(response.status==404)
          {
            loadingScreen.classList.remove("active");
            errorInfo.classList.add("active");
          }
          else{
          const data=await response.json();
          loadingScreen.classList.remove("active");
          userInfoContainer.classList.add("active");
          renderweatherInfo(data);
          }
        }
        catch(err)
        {
          
        }
}
