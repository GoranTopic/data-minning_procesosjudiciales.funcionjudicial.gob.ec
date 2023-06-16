// make a fucntion that return true if a given string any symbols
let hasSymbols = 
    string => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(string)

export default hasSymbols
