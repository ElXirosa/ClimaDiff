import { dateToYear, formatterEcart, tagsFormater, secondeToHours, arrayNullChecker} from "./utils";
import { APIDATA, STATEMENT } from "./ui.js";
import { actualDateToAttribute } from "./dateFormatter.js";

export function updateAllValues(){
    if(arrayNullChecker(Object.values(APIDATA))){
        updateHeaderAllValue();
        updateTemperatures();
        updateHumPrecip();
        updateWind();
        updateSun();
        updateAtmo();
    }else{
        return;
    }
}

export function updateHeaderAllValue(){
    try{
        const previousYear = dateToYear(STATEMENT.date);
        const actualYear = dateToYear(actualDateToAttribute());
        document.querySelector(".sp-cityname").innerText = `${STATEMENT.ville}, ${STATEMENT.country.toUpperCase()}`;
        document.getElementById("sp-fullyear-before").innerText = previousYear;
        document.getElementById("p-full-before").innerHTML = `Il y a ${actualYear - previousYear} ans<br>${STATEMENT.date}`;
        document.getElementById("sp-fullyear-now").innerText = actualYear;
        document.getElementById("p-full-now").innerHTML = `Hier<br>${actualDateToAttribute()}`;

    }catch(error){
        console.error("Une erreur est survenue lors de l'update de l'header full value", error);
    }
}

export function updateTemperatures(){
    const arrayFromAPIDATA = Object.values(APIDATA)
    if(arrayFromAPIDATA.includes(null)){
        throw new Error("L'objet APIDATA est osbolète");
        return
        return;
    }
    try{
        const TEMPSBEFORE = {
            tempMax: parseFloat(APIDATA.dataBefore.daily.temperature_2m_max[0]),
            tempMin: parseFloat(APIDATA.dataBefore.daily.temperature_2m_min[0]),
            tempMoy: parseFloat(APIDATA.dataBefore.daily.temperature_2m_mean[0]),
            tempRes: parseFloat(APIDATA.dataBefore.daily.apparent_temperature_max[0])
        };
        const TEMPSNOW = {
            tempMax: parseFloat(APIDATA.dataNow.daily.temperature_2m_max[0]),
            tempMin: parseFloat(APIDATA.dataNow.daily.temperature_2m_min[0]),
            tempMoy: parseFloat(APIDATA.dataNow.daily.temperature_2m_mean[0]),
            tempRes: parseFloat(APIDATA.dataNow.daily.apparent_temperature_max[0])
        }
        const DIFFERENCES = {
            tempMax: formatterEcart((TEMPSNOW.tempMax - TEMPSBEFORE.tempMax), APIDATA.dataBefore.daily_units.temperature_2m_max),
            tempMin: formatterEcart((TEMPSNOW.tempMin - TEMPSBEFORE.tempMin), APIDATA.dataBefore.daily_units.temperature_2m_min),
            tempMoy: formatterEcart((TEMPSNOW.tempMoy - TEMPSBEFORE.tempMoy), APIDATA.dataBefore.daily_units.temperature_2m_mean),
            tempRes: formatterEcart((TEMPSNOW.tempRes - TEMPSBEFORE.tempRes), APIDATA.dataBefore.daily_units.apparent_temperature_max)
        }
        document.getElementById("box-temp").innerHTML = 
        `
                        <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${TEMPSBEFORE.tempMax}<em> °C</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fcc11a" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                        <span class="span-title-center">Température max</span>
                        ${tagsFormater(DIFFERENCES.tempMax)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${TEMPSNOW.tempMax}<em>°C</em></span>
                    </div>
                </div>
                <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${TEMPSBEFORE.tempMin}<em> °C</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fcc11a" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>
                        <span class="span-title-center">Température min</span>
                        ${tagsFormater(DIFFERENCES.tempMin)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${TEMPSNOW.tempMin}<em>°C</em></span>
                    </div>
                </div>
                <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${TEMPSBEFORE.tempMoy}<em> °C</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffca29" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thermometer-icon lucide-thermometer"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>
                        <span class="span-title-center">Température moy.</span>
                        ${tagsFormater(DIFFERENCES.tempMoy)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${TEMPSNOW.tempMoy}<em>°C</em></span>
                    </div>
                </div>
                <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${TEMPSBEFORE.tempRes}<em> °C</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fcc11a" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thermometer-sun-icon lucide-thermometer-sun"><path d="M12 2v2"/><path d="M12 8a4 4 0 0 0-1.645 7.647"/><path d="M2 12h2"/><path d="M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"/><path d="m4.93 4.93 1.41 1.41"/><path d="m6.34 17.66-1.41 1.41"/></svg>
                        <span class="span-title-center">Ressenti max</span>
                        ${tagsFormater(DIFFERENCES.tempRes)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${TEMPSNOW.tempRes}<em>°C</em></span>
                    </div>
                </div>
        `;
    }catch(error){
        console.error("Une erreur est survenue lors de l'update des températures", error);
    }
}

export function updateHumPrecip(){
    const arrayFromAPIDATA = Object.values(APIDATA)
    if(arrayFromAPIDATA.includes(null)){
        throw new Error("L'objet APIDATA est osbolète");
        return;
    }
    try{
        const PRECIPBEFORE = {
            humMoy: parseFloat(APIDATA.dataBefore.daily.relative_humidity_2m_mean[0]),
            precip: parseFloat(APIDATA.dataBefore.daily.precipitation_sum[0]),
            snow: parseFloat(APIDATA.dataBefore.daily.snowfall_sum[0])
        };
        const PRECIPNOW = {
            humMoy: parseFloat(APIDATA.dataNow.daily.relative_humidity_2m_mean[0]),
            precip: parseFloat(APIDATA.dataNow.daily.precipitation_sum[0]),
            snow: parseFloat(APIDATA.dataNow.daily.snowfall_sum[0])
        }
        const DIFFERENCES = {
            humMoy: formatterEcart((PRECIPNOW.humMoy - PRECIPBEFORE.humMoy), APIDATA.dataBefore.daily_units.relative_humidity_2m_mean),
            precip: formatterEcart((PRECIPNOW.precip - PRECIPBEFORE.precip), APIDATA.dataBefore.daily_units.precipitation_sum),
            snow: formatterEcart((PRECIPNOW.snow - PRECIPBEFORE.snow), APIDATA.dataBefore.daily_units.snowfall_sum),
        }
        document.getElementById("humid-and-precip").innerHTML = 
        `
                <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${PRECIPBEFORE.humMoy}<em> %</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-droplets-icon lucide-droplets"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>
                        <span class="span-title-center">Humidité moy.</span>
                        ${tagsFormater(DIFFERENCES.humMoy)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${PRECIPNOW.humMoy}<em>%</em></span>
                    </div>
                </div>
                <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${PRECIPBEFORE.precip}<em> mm</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-hail-icon lucide-cloud-hail"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v2"/><path d="M8 14v2"/><path d="M16 20h.01"/><path d="M8 20h.01"/><path d="M12 16v2"/><path d="M12 22h.01"/></svg>
                        <span class="span-title-center">Précipitations</span>
                        ${tagsFormater(DIFFERENCES.precip)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${PRECIPNOW.precip}<em>mm</em></span>
                    </div>
                </div>
                <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${PRECIPBEFORE.snow}<em>cm</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-snowflake-icon lucide-snowflake"><path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/><path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/><path d="m17 21-3-6h-4"/><path d="m17 3-3 6 1.5 3"/><path d="M2 12h6.5L10 9"/><path d="m20 10-1.5 2 1.5 2"/><path d="M22 12h-6.5L14 15"/><path d="m4 10 1.5 2L4 14"/><path d="m7 21 3-6-1.5-3"/><path d="m7 3 3 6h4"/></svg>
                        <span class="span-title-center">Couverture neige</span>
                        ${tagsFormater(DIFFERENCES.snow)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${PRECIPNOW.snow}<em>cm</em></span>
                    </div>
                </div>
        `;
    }catch(error){
        console.error("Une erreur est survenue lors de l'update des précipitations et humidités", error);
    }
}

export function updateWind(){
    const arrayFromAPIDATA = Object.values(APIDATA)
    if(arrayFromAPIDATA.includes(null)){
        throw new Error("L'objet APIDATA est osbolète");
        return;
    }
    try{
        const WINDBEFORE = {
            windMoy: parseFloat(APIDATA.dataBefore.daily.wind_gusts_10m_max[0]),
            windSpe: parseFloat(APIDATA.dataBefore.daily.wind_speed_10m_max[0]),
            windDir: parseFloat(APIDATA.dataBefore.daily.wind_direction_10m_dominant[0])
        };
        const WINDNOW = {
            windMoy: parseFloat(APIDATA.dataNow.daily.wind_gusts_10m_max[0]),
            windSpe: parseFloat(APIDATA.dataNow.daily.wind_speed_10m_max[0]),
            windDir: parseFloat(APIDATA.dataNow.daily.wind_direction_10m_dominant[0])
        }
        const DIFFERENCES = {
            windMoy: formatterEcart((WINDNOW.windMoy - WINDBEFORE.windMoy), APIDATA.dataBefore.daily_units.wind_gusts_10m_max),
            windSpe: formatterEcart((WINDNOW.windSpe - WINDBEFORE.windSpe), APIDATA.dataBefore.daily_units.wind_speed_10m_max),
            windDir: formatterEcart((WINDNOW.windDir - WINDBEFORE.windDir), APIDATA.dataBefore.daily_units.wind_direction_10m_dominant)
        }
        document.getElementById("box-wind").innerHTML = 
        `
                <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${WINDBEFORE.windMoy}<em>km/h</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wind-icon lucide-wind"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg>
                        <span class="span-title-center">Vent moyen</span>
                        ${tagsFormater(DIFFERENCES.windMoy)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${WINDNOW.windMoy}<em>km/h</em></span>
                    </div>
                </div>
                <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${WINDBEFORE.windSpe}<em>km/h</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-fan-icon lucide-fan"><path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/><path d="M12 12v.01"/></svg>
                        <span class="span-title-center">Rafales max</span>
                        ${tagsFormater(DIFFERENCES.windSpe)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${WINDNOW.windSpe}<em>km/h</em></span>
                    </div>
                </div>
                <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${WINDBEFORE.windDir}<em>°</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-compass-icon lucide-compass"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/></svg>
                        <span class="span-title-center">Direction dominante</span>
                        ${tagsFormater(DIFFERENCES.windDir)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${WINDNOW.windDir}<em>°</em></span>
                    </div>
                </div>
        `;
    }catch(error){
        console.error("Une erreur est survenue lors de l'update des vents", error);
    }
}

export function updateSun(){
        const arrayFromAPIDATA = Object.values(APIDATA)
    if(arrayFromAPIDATA.includes(null)){
        throw new Error("L'objet APIDATA est osbolète");
        return;
    }
    try{
        const SUNBEFORE = {
            sunTime: secondeToHours(parseFloat(APIDATA.dataBefore.daily.sunshine_duration[0])),
            radSunMax: parseFloat(APIDATA.dataBefore.daily.shortwave_radiation_sum[0]),
            cloudCover: parseFloat(APIDATA.dataBefore.daily.cloud_cover_mean[0])
        };
        const SUNNOW = {
            sunTime: secondeToHours(parseFloat(APIDATA.dataNow.daily.sunshine_duration[0])),
            radSunMax: parseFloat(APIDATA.dataNow.daily.shortwave_radiation_sum[0]),
            cloudCover: parseFloat(APIDATA.dataNow.daily.cloud_cover_mean[0])
        }
        const DIFFERENCES = {
            sunTime: formatterEcart((SUNNOW.sunTime - SUNBEFORE.sunTime), "h"),
            radSunMax: formatterEcart((SUNNOW.radSunMax - SUNBEFORE.radSunMax), APIDATA.dataBefore.daily_units.shortwave_radiation_sum),
            cloudCover: formatterEcart((SUNNOW.cloudCover - SUNBEFORE.cloudCover), APIDATA.dataBefore.daily_units.cloud_cover_mean)
        }
        document.getElementById("sun-and-rays").innerHTML = 
        `
                <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${SUNBEFORE.sunTime}<em>h</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fdc91f" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-medium-icon lucide-sun-medium"><circle cx="12" cy="12" r="4"/><path d="M12 3v1"/><path d="M12 20v1"/><path d="M3 12h1"/><path d="M20 12h1"/><path d="m18.364 5.636-.707.707"/><path d="m6.343 17.657-.707.707"/><path d="m5.636 5.636.707.707"/><path d="m17.657 17.657.707.707"/></svg>
                        <span class="span-title-center">Heures d'ensoleillement</span>
                        ${tagsFormater(DIFFERENCES.sunTime)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${SUNNOW.sunTime}<em>h</em></span>
                    </div>
                </div>
                <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${SUNBEFORE.radSunMax}<em>MJ/m²</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fdc91f" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-solar-panel-icon lucide-solar-panel"><path d="M11 2h2"/><path d="m14.28 14-4.56 8"/><path d="m21 22-1.558-4H4.558"/><path d="M3 10v2"/><path d="M6.245 15.04A2 2 0 0 1 8 14h12a1 1 0 0 1 .864 1.505l-3.11 5.457A2 2 0 0 1 16 22H4a1 1 0 0 1-.863-1.506z"/><path d="M7 2a4 4 0 0 1-4 4"/><path d="m8.66 7.66 1.41 1.41"/></svg>
                        <span class="span-title-center">Rayonnement max</span>
                        ${tagsFormater(DIFFERENCES.radSunMax)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${SUNNOW.radSunMax}<em>MJ/m²</em></span>
                    </div>
                </div>
                <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${SUNBEFORE.cloudCover}<em>%</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fdc91f" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-fog-icon lucide-cloud-fog"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7"/><path d="M17 21H9"/></svg>
                        <span class="span-title-center">Couverture nuageuse</span>
                        ${tagsFormater(DIFFERENCES.cloudCover)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${SUNNOW.cloudCover}<em>%</em></span>
                    </div>
                </div>
        `;
    }catch(error){
        console.error("Une erreur est survenue lors de l'update de l'ensoleillement", error);
    }
}

export function updateAtmo(){
            const arrayFromAPIDATA = Object.values(APIDATA)
    if(arrayFromAPIDATA.includes(null)){
        throw new Error("L'objet APIDATA est osbolète");
        return;
    }
    try{
        const ATMOBEFORE = {
            atmoPress: parseFloat(APIDATA.dataBefore.daily.pressure_msl_mean[0]),
            pointRos: parseFloat(APIDATA.dataBefore.daily.dew_point_2m_mean[0]),
            atmoPressSurf: parseFloat(APIDATA.dataBefore.daily.surface_pressure_mean[0])
        };
        const ATMONOW = {
            atmoPress: parseFloat(APIDATA.dataNow.daily.pressure_msl_mean[0]),
            pointRos: parseFloat(APIDATA.dataNow.daily.dew_point_2m_mean[0]),
            atmoPressSurf: parseFloat(APIDATA.dataNow.daily.surface_pressure_mean[0])
        }
        const DIFFERENCES = {
            atmoPress: formatterEcart((ATMONOW.atmoPress - ATMOBEFORE.atmoPress), APIDATA.dataBefore.daily_units.pressure_msl_mean),
            pointRos: formatterEcart((ATMONOW.pointRos - ATMOBEFORE.pointRos), APIDATA.dataBefore.daily_units.dew_point_2m_mean),
            atmoPressSurf: formatterEcart((ATMONOW.atmoPressSurf - ATMOBEFORE.atmoPressSurf), APIDATA.dataBefore.daily_units.surface_pressure_mean)
        }
        document.getElementById("pressure-and-atmo").innerHTML = 
        `
                <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${ATMOBEFORE.atmoPress}<em>hPa</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a51d2d" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-gauge-icon lucide-circle-gauge"><path d="M15.6 2.7a10 10 0 1 0 5.7 5.7"/><circle cx="12" cy="12" r="2"/><path d="M13.4 10.6 19 5"/></svg>
                        <span class="span-title-center">Pression atm. (mer)</span>
                        ${tagsFormater(DIFFERENCES.atmoPress)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${ATMONOW.atmoPress}<em>hPa</em></span>
                    </div>
                </div>
                <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${ATMOBEFORE.pointRos}<em>°C</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a51d2d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bubbles-icon lucide-bubbles"><path d="M7.001 15.085A1.5 1.5 0 0 1 9 16.5"/><circle cx="18.5" cy="8.5" r="3.5"/><circle cx="7.5" cy="16.5" r="5.5"/><circle cx="7.5" cy="4.5" r="2.5"/></svg>
                        <span class="span-title-center">Point de rosée</span>
                        ${tagsFormater(DIFFERENCES.pointRos)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${ATMONOW.pointRos}<em>°C</em></span>
                    </div>
                </div>
                <div class="box-allvalues">
                    <div class="value-box">
                            <div class="left-value-wrapper">
                                <span class="sp-stat-value">${ATMOBEFORE.atmoPressSurf}<em>hPa</em></span>
                            </div>
                    </div>
                    <div class="box-center-allvalue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a51d2d" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                        <span class="span-title-center">Pression atm. (surface)</span>
                        ${tagsFormater(DIFFERENCES.atmoPressSurf)}
                    </div>
                    <div class="value-box">
                        <span class="sp-stat-value">${ATMONOW.atmoPressSurf}<em>hPa</em></span>
                    </div>
                </div>
        `;
    }catch(error){
        console.error("Une erreur est survenue lors de l'update de l'atmosphère", error);
    }
}
