export default async function postToApi(url, method, body){
    try{
        await fetch(url, {
            method: method,
            body: body
        });
    }
    catch (error) {
        console.log(error);    
    }
}