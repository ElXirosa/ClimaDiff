export function calculerEcart(valeurPasse, valeurPresente){
    const difference = valeurPasse - valeurPresente;
    return difference.toFixed(1);
}

export function formatterEcart(difference, unite){
    if(Number.isNaN(difference) || difference === null){
        return "N/A";
    }
    let valeurFormatee = null;
    let description = null;
    if(difference > 0){
        valeurFormatee = `+${difference.toFixed(1)}${unite}`;
    }else{
        valeurFormatee = `${difference.toFixed(1)}${unite}`;
    }
    return valeurFormatee
}

export function dateToYear(date){
    const year = date.slice(0, 4);
    return year;
}

export function tagsFormater(diff){
    try{
        let tagHtml = "";
        if(parseFloat(diff) === 0){
            tagHtml = `<span class="sp-diff-value similar">identique</span>`;
            return tagHtml;
        }
        if(diff.includes("+")){
            tagHtml = `<span class="sp-diff-value">${diff}</span>`;
        }else{
            tagHtml = `<span class="sp-diff-value negative">${diff}</span>`;
        }
        return tagHtml;
    }catch(error){
        console.error("Une erreur est survenue lors du formatage du tag différence", error, diff);
    }
}

export function secondeToHours(secondes){
    try{
        const hours = (secondes / 3600).toFixed(1);
        return hours;
    }catch(error){
        console.error("Une erreur s'est produite lors de la conversion des secondes en heures", error);
    }
}

export function arrayNullChecker(array){
    if(array.includes(null)){
        console.error(`Les valeures du tableau contiennent un null`);
        return false;
    }else{
        return true;
    }
}
