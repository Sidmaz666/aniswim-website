export default function queryString(obj) {
    const params = new URLSearchParams();
    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            obj[key].forEach(value => {
                params.append(key, value);
            });
        } else {
            params.append(key, obj[key]);
        }
    }
    
    return decodeURIComponent(params.toString());
}
