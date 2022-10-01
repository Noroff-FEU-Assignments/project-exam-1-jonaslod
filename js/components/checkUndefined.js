export default function checkUndefined(value, type = "", isEmbed = false) {
    if (!isEmbed) {
        return value ? value : `undefined${type}`;
    } else {
        return value && value.length > 0 ? value[0] : type;
    }
}
