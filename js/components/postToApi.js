export default async function postToApi(url, options){
    try{
        const response = await fetch(url, options);
        return response.status;
    }
    catch(error){
        console.log(error);
    }
}