export default function checkUndefined(value, type = ""){
    if(value){return value;}
    else{return `undefined${type}`;}
}