export default async function postToApi(url, method, body){
    try{
        const response = await fetch(url, {
            method: method,
            body: body
        });
        return response.status;
    }
    catch (error) {
        console.log(error);    
    }
}