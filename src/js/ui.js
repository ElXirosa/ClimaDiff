import { fetchMeteo, fetchMeteoHourly, rechercherVilles } from "./api.js";
import { actualDateToAttribute } from "./dateFormatter.js";
import { calculerEcart, dateToYear, formatterEcart, secondeToHours, tagsFormater } from "./utils.js";
import { updateHeaderAllValue, updateTemperatures, updateHumPrecip, updateWind, updateSun, updateAtmo, updateAllValues} from "./section.js"

export const STATEMENT = {
    ville: null,
    latitude: null,
    longitude: null,
    country: null,
    date: null,
}

export const APIDATA = {
    dataBefore: null,
    dataNow: null
}

const inputVille = document.getElementById("ville");
const navVille = document.getElementById("nav-ville");
const ulVille = document.getElementById("ul-ville");
const inputDate = document.getElementById("date");
const boxError = document.getElementById("box-error");

afficherSuggestion();
selectionUser()


async function afficherSuggestion(){
    try{
        inputVille.addEventListener("input", async () => {
            if(!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(inputVille.value)){
                boxError.innerText = "caractère non pris en charge ! veuillez réssayer";
                boxError.classList.remove("inactive");
                return;
            }
            if(inputVille.value.length < 2){
                navVille.classList.add("inactive");
                return;
            }else{
                boxError.classList.add("inactive");
                let listeVilles = "";
                navVille.classList.remove("inactive");
                let villes = await rechercherVilles(inputVille.value);
                villes.forEach((ville) => {
                    listeVilles += `<li data-lat="${ville.latitude}" data-lon="${ville.longitude}" data-vil="${ville.name}" data-cou="${ville.country}">${ville.name}(${ville.admin2}, ${ville.country})</li>`;
                });
                ulVille.innerHTML = listeVilles;
            }
        });
    }catch(error){
        console.error("Une erreur est survenue lors de l'affichage des suggestions", error);
    }
}

function selectionUser(){
    try{
        ulVille.addEventListener("click", (event) =>{
            if(event.target.tagName === "LI"){
                STATEMENT.latitude = event.target.dataset.lat;
                STATEMENT.longitude = event.target.dataset.lon;
                STATEMENT.ville = event.target.dataset.vil;
                STATEMENT.country = event.target.dataset.cou;
                inputVille.value = event.target.innerText;
                navVille.classList.add("inactive");
            }
        });

        const actualDate = actualDateToAttribute();
        const actualYear = actualDateToAttribute().slice(0, 4);
        inputDate.setAttribute("max", actualDateToAttribute());
        inputDate.addEventListener("change", () =>{
            let actualDateSplitted = actualDate.split("-").join("");
            let inputDateSplitted = inputDate.value.split("-").join("");
            const datetest = new Date();
            if(inputDate.value.slice(0, 4) < actualYear - 20 || inputDateSplitted > actualDateSplitted){
                boxError.innerText = "Vous ne pouvez sélectionner une date de plus de 20 ans !"
                boxError.classList.remove("inactive");
                inputDate.value = "";
                return
            }else{
                boxError.classList.add("inactive");
                STATEMENT.date = inputDate.value;
            }
        });
    }catch(error){
        console.error("Une erreur est survenue lors de la selection de la suggestion", error);
    }
}

const btnSubmit = document.getElementById("submit");
btnSubmit.addEventListener("click", () => {
    let arrayFromSTATEMENT = Object.values(STATEMENT);
    if(arrayFromSTATEMENT.includes(null)){
        boxError.innerText = "Une erreur s'est produite !";
        boxError.classList.remove("inactive");
        throw new Error("Une valeur STATEMENT est null");
        return;
    }else{
        boxError.classList.add("inactive");
        inputVille.value = "";
        inputDate.value = ""
        dataApiReceipe();
    }
});

async function dataApiReceipe(){
    let arrayFromSTATEMENT = Object.values(STATEMENT);
    if(arrayFromSTATEMENT.includes(null)){
        throw new Error("L'objet qui contient les paramètres d'appel API sont obsolètes");
        return;
    }
    try{
        const [previousData, actualData, hourlyPreviousData, hourlyActualData] = await Promise.all([
            fetchMeteo(STATEMENT.latitude, STATEMENT.longitude, STATEMENT.date),
            fetchMeteo(STATEMENT.latitude, STATEMENT.longitude, actualDateToAttribute()),
            fetchMeteoHourly(STATEMENT.latitude, STATEMENT.longitude, STATEMENT.date),
            fetchMeteoHourly(STATEMENT.latitude, STATEMENT.longitude, actualDateToAttribute())
        ]);
        APIDATA.dataBefore = previousData;
        APIDATA.dataNow = actualData;
        updateChart(hourlyPreviousData, hourlyActualData);
        renderCards(previousData, actualData);
        updateAllValues();
    }catch(error){
        console.error("Une erreur est survenue lors de l'attribution de la réponse API", error);
    }

    
}

function renderCards(previousData, actualData){
    try{
        const boxDiffTemp = document.getElementById("box-diff-temp");
        const spTemperature = document.getElementById("temp-diff-value");
        const descTemperature = document.getElementById("desc-temp-diff");
        const boxDiffHumi = document.getElementById("box-diff-humi");
        const spHumidity = document.getElementById("temp-hum-value");
        const descHumidity = document.getElementById("desc-hum-diff");
        const boxDiffWind = document.getElementById("box-diff-wind");
        const spWind = document.getElementById("temp-vent-value");
        const descWind = document.getElementById("desc-vent-diff");

        const diffTemp = calculerEcart(actualData.daily.temperature_2m_max[0], previousData.daily.temperature_2m_max[0]);
        const diffHumi = calculerEcart(actualData.daily.relative_humidity_2m_mean[0], previousData.daily.relative_humidity_2m_mean[0]);
        const diffWind = calculerEcart(actualData.daily.wind_speed_10m_max[0], previousData.daily.wind_speed_10m_max[0]);

        updateCard(diffTemp,spTemperature, descTemperature, boxDiffTemp);
        updateCard(diffHumi,spHumidity, descHumidity, boxDiffHumi);
        updateCard(diffWind,spWind, descWind, boxDiffWind);

        spTemperature.innerText = formatterEcart(parseFloat(diffTemp), previousData.daily_units.temperature_2m_max);
        spHumidity.innerText = formatterEcart(parseFloat(diffHumi), previousData.daily_units.relative_humidity_2m_mean);
        spWind.innerText = formatterEcart(parseFloat(diffWind), previousData.daily_units.wind_speed_10m_max);
    }catch(error){
        console.error("Une erreur est survenue lors de l'affichage des valeurs", error);
    }
}

function updateCard(difference, spValueTarget, spDescTarget, boxTarget){
    try{
            let isNegative = null;
    if(difference < 0 ){
        isNegative = true;
    }else{
        isNegative = false;
    }

    switch(isNegative){
        case true:
            spDescTarget.innerText = `De moins qu'en ${STATEMENT.date.slice(0, 4)}.`;
            spValueTarget.classList.remove("positive");
            spValueTarget.classList.add("negative");
            boxTarget.classList.remove("positive");
            boxTarget.classList.add("negative");
            break;
        case false:
            spDescTarget.innerText = `De plus qu'en ${STATEMENT.date.slice(0, 4)}.`;
            spValueTarget.classList.remove("negative");
            spValueTarget.classList.add("positive");
            boxTarget.classList.remove("negative");
            boxTarget.classList.add("positive");
            break;
        default:
              spDescTarget.innerText = `Aucunes différences avec ${STATEMENT.date.slice(0, 4)}.`;
    }
    }catch(error){
        console.error("Une erreur est survenue lors du design des cards", error);
    }
}

async function updateChart(previousDataHourly, actualDataHourly){
    try{
        chart.data.datasets[0].data = actualDataHourly.hourly.temperature_2m;
        chart.data.datasets[1].data = previousDataHourly.hourly.temperature_2m;
        chart.data.datasets[1].label = `Le ${STATEMENT.date}`;
        chart.update();
    }catch(error){
        console.error("Une erreur est survenue lors de la mise à jour du graphique", error);
    }
}

const ctx = document.getElementById("main-graph");
const totalDuration = 2000;

const animation = {
  x: {
    type: 'number',
    easing: 'linear',
    duration: (ctx) => totalDuration / ctx.chart.data.labels.length,
    from: NaN,
    delay: (ctx) => ctx.index * (totalDuration / ctx.chart.data.labels.length),
  },
  y: {
    type: 'number',
    easing: 'linear',
    duration: (ctx) => totalDuration / ctx.chart.data.labels.length,
    from: (ctx) => {
    if (ctx.index === 0) return ctx.chart.scales.y.getPixelForValue(0)
    const prev = ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1]
    if (!prev) return ctx.chart.scales.y.getPixelForValue(0)
    return prev.getProps(['y'], true).y
    },
    delay: (ctx) => ctx.index * (totalDuration / ctx.chart.data.labels.length),
  }
}

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'],
    datasets: [
      {
        label: "Aujourd'hui",
        data: [12, 15, 13, 18, 24, 28, 80, 27, 22, 18, 14, 12],
        borderColor: '#5a9fff',
        borderWidth: 1.5,
        radius: 0, // pas de points
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Il y a X ans',
        data: [12, 15, 13, 18, 24, 28, 30, 27, 22, 18, 14, 12],
        borderColor: '#ff7e67',
        borderWidth: 1.5,
        radius: 0,
        fill: false,
        tension: 0.4,
        borderDash: [6, 3],
      }
    ]
  },
  options: {
    scales: {
        x: {
            ticks: {
                color: "#dde4f4",
                font: {
                    family: "Urbanist",
                    size: 12,
                }
            }
        },
    y: {
        ticks: {
            color: "#dde4f4",
            font: {
                family: "Urbanist",
                size: 12,
            },
            callback: (val) => val + "°C"
        }
    }
    },
    animation,
    interaction: { intersect: false },
    plugins: {
      legend: { display: false }
    },
    responsive: true,
    maintainAspectRatio: false,
  }
});
