export function actualDateToAttribute(){
    try{
        const now = new Date();
        const DATESTATE = {
            year: now.getFullYear(),
            month: String(now.getMonth()+1).padStart(2, "0"),
            day: String(now.getDate()-1).padStart(2, "0"),
        }
        const currentDate = String(`${DATESTATE.year}-${DATESTATE.month}-${DATESTATE.day}`);
        return currentDate;
    }catch(error){
        console.error("Une erreur est survenue lors du formattage de la date locale", error);
    }
}