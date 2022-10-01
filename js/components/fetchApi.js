export default async function fetchApi(url, options = { method: "GET" }, returnJson = true) {
    const response = await fetch(url, options);
    return returnJson ? response.json() : response.status;
}
