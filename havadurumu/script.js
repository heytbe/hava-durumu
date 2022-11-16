let searchinput = document.querySelector("#search"),
    labelsearch = document.querySelector("label"),
    searchresult = document.querySelector(".searchresult"),
    body = document.querySelector("body"),
    tumsayfa = document.querySelector(".tumsayfaalani");

let apikey = "apikey";

searchinput.addEventListener("keyup",havadurumu);
searchinput.addEventListener("keydown",havadurumu);

async function havadurumu(){
    let value = this.value;
    if(value.length > 0){
        let link = await fetch("http://api.weatherapi.com/v1/search.json?key="+apikey+"&q="+value);
        let json = await link.json();
        searchlistele(json,value);
    }
}

function searchlistele(json,value){
    let html;
    if(json.length > 0){
        let jsonfilter = json.filter(response => response.region.toLowerCase() || response.name.toLowerCase() === value.toLowerCase);
        if (jsonfilter.length > 0){
            searchresult.style.display = "inline-block";
            searchresult.innerHTML = "";
            jsonfilter.forEach((value,key)=>{
                html = `<div class="result" data-city="${value.name}">
                    <span class="city">${value.name}</span>
                    <span class="region">${value.region}</span>
                </div>`;
                searchresult.insertAdjacentHTML("beforeend",html);
            });
        }else{
            searchresult.innerHTML = "";
        }
    }else{
        searchresult.style.display = "none";
        searchresult.innerHTML = "";
        searchresult.style.display = "inline-block";
        html = `<div class="result">
                    <span class="centertext">Sonuç Yok</span>
                    </div>`;
        searchresult.insertAdjacentHTML("beforeend",html);
        body.addEventListener("click",()=>{
           searchresult.style.display ="none";
        });
    }
}

function random(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

async function apiimage(value){
    let apikeytwo = "apikey";
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apikeytwo,
            'X-RapidAPI-Host': 'bing-image-search1.p.rapidapi.com'
        }
    };

    let link = await fetch('https://bing-image-search1.p.rapidapi.com/images/search?q='+value, options);
    let result = await link.json();
    return result;

}

searchresult.addEventListener("click",background);
function background(e){
    let targetdiv = e.target;
    sehirler(targetdiv.getAttribute("data-city"))
    apiimage(targetdiv.getAttribute("data-city")).then(result =>{
        let randomint = random(0,result.value.length);
        tumsayfa.style.backgroundImage = `url("${result.value[randomint].contentUrl}")`;
    });
}

async function sehirler(search){
    fetch("http://api.weatherapi.com/v1/current.json?key="+apikey+"&q="+search+"&aqi=yes")
        .then(response => response.json())
        .then(sonuc => hava(sonuc));
}

function hava(sonuc){
    console.log(sonuc);
    let date = document.querySelector(".headertext small"),
    temp = document.querySelector(".main .derece"),
    icon = document.querySelector(".header img"),
    wind = document.querySelector(".footer .input .wind"),
    humidity = document.querySelector(".footer .input .humidity"),
    basinc = document.querySelector(".footer .input .basinc");
    date.textContent = sonuc.current.last_updated;
    temp.textContent = sonuc.current.temp_c;
    icon.setAttribute("src","http:"+sonuc.current.condition.icon);
    wind.textContent = sonuc.current.wind_kph;
    humidity.textContent = sonuc.current.humidity;
    basinc.textContent = sonuc.current.pressure_in;
}