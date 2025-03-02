import {TIMEOUT_SEC as timeoutSec} from './config.js';
import 'regenerator-runtime';

const timeout=function(seconds){
    return new Promise(function(_, reject){
        setTimeout(
            reject.bind(null,new Error(`Request took too long! Timeout after ${seconds} second/s`))
        ,seconds*1000)
    });
};

export const AJAX=async function(url,uploadData=undefined){
    try{
        const fetchPro=uploadData?fetch(url,{
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(uploadData)
        }):fetch(url);
        const res = await Promise.race([fetchPro,timeout(timeoutSec)]);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    }
    catch (err){
        throw err;
    }
};


export const getJSON=async function(url){
    try{
    const res = await Promise.race([fetch(url),timeout(timeoutSec)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
    }
    catch (err){
        throw err;
    }
}




export const sendJSON=async function(url,recData){
    try{
        const res = await Promise.race([fetch(url,{
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(recData)
        }),timeout(timeoutSec)]);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    }
    catch (err){
        throw err;
    }
}
