import { actualDateToAttribute } from "./dateFormatter.js";

let actualDate = actualDateToAttribute();

export async function rechercherVilles(nomVille) {
    try{
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${nomVille}&count=5&language=fr`);
        const data = await response.json();
        return data.results ?? [];
    }catch(error){
        console.error("Une erreur est survenue lors de la récupération de la ville via l'API", error);
    }
}

export async function fetchMeteo(latitude, longitude, date){
    try{
        console.log(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${date}&end_date=${date}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_max,precipitation_sum,snowfall_sum,sunshine_duration,wind_direction_10m_dominant,shortwave_radiation_sum,cloud_cover_mean,relative_humidity_2m_mean,pressure_msl_mean,wind_speed_10m_max,wind_gusts_10m_max,dew_point_2m_mean,surface_pressure_mean`);
        const response = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${date}&end_date=${date}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_max,precipitation_sum,snowfall_sum,sunshine_duration,wind_direction_10m_dominant,shortwave_radiation_sum,cloud_cover_mean,relative_humidity_2m_mean,pressure_msl_mean,wind_speed_10m_max,wind_gusts_10m_max,dew_point_2m_mean,surface_pressure_mean`);
        const data = await response.json()
        return data ?? [];
    }catch(error){
        console.error("Une erreur est survenue lors de la récupération des données API", error);
    }
}

export async function fetchMeteoHourly(latitude, longitude, date){
    try{
        const response = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${date}&end_date=${date}&hourly=temperature_2m`);
        const data = await response.json();
        return data ?? [];
    }catch(error){
        console.error("Une erreur est survenue lors de la récupération de l'api Hourly", error);
    }
}