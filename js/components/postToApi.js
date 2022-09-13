export default async function postToApi(url, body){
    try{
        const response = await fetch(url, {
            method: "POST",
            body: body
        });
        return response.status;
    }
    catch (error) {
        console.log(error);    
    }
}