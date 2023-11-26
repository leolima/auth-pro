import { cpf, cnpj } from 'cpf-cnpj-validator'; 

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const telRegex = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/

export const urlRegex = /((https:\/\/))(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/

export const timeDiff = (date_now, date_future) => {
    var delta = Math.abs(date_future - date_now) / 1000;

    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    var seconds = delta % 60;
    return `${days} dia(s), ${hours} hora(s), ${minutes} minuto(s), ${Number(seconds).toFixed(0)} segundo(s)`;
}

export const validaCpfCnpj = (val) => {
    const num = val.replace(/\D/g, "");
    if(`${num}`.length === 11)
        return cpf.isValid(num);

    if(`${num}`.length === 14)
        return cnpj.isValid(num);

    return false;
}

// 16/08/2023  -> 2023-07-16
export const dateBrToBD = (strDate) => {
    return strDate.split('/').reverse().join('-')
}

// '17/08/2023 14:57' -> 2023-08-17 14:57:00
export const fulldateBrToBD = (strDate) => {
    const arr = strDate.split(' ')
    return `${dateBrToBD(arr[0])} ${arr[1]}:00`;
}
// '17/08/2023 14:57' -> 2023-09-26T04:59:12.000Z
export const fulldateBrToBDCopy = (strDate) => {
    const arr = strDate.split(' ')
    return `${dateBrToBD(arr[0])}T${arr[1]}:00.000Z`;
}

export const dateClassToBD = (date: Date) => {
    const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
    const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

    return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const getNextPaymentDate = (datetime) => {
    const date = new Date(datetime);
    date.setDate(date.getDate() + 30)
    return dateClassToBD(date);
}

export function generateCode() {
    var minm = 100000;
    var maxm = 999999;
    return `${Math.floor(Math.random() * (maxm - minm + 1)) + minm}`;
}