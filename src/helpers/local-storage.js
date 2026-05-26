export function saveLocalStorage(llave, valor){
    localStorage.setItem(llave, JSON.stringify(valor))
}

export function getLocalStorage(llave){
    let user = JSON.parse(localStorage.getItem(llave))
    return user
}

export function removeLocalStorage(llave){
    localStorage.removeItem(llave)
}