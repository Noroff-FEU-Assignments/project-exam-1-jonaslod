export default async function fetchFromApi(url){
    try{
        const response = await fetch(url);
        return response.json();
    }
    catch(error){
        console.log(error);
    }
}