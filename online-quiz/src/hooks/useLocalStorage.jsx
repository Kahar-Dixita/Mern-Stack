import { useState } from 'react';


export default function useLocalStorage(key, initialValue){
const [state, setState] = useState(()=> {
try{
const value = localStorage.getItem(key);
return value ? JSON.parse(value) : initialValue;
}catch(e){
return initialValue;
}
});


function setLocal(newValue){
try{
const valueToStore = typeof newValue === 'function' ? newValue(state) : newValue;
setState(valueToStore);
localStorage.setItem(key, JSON.stringify(valueToStore));
}catch(e){
console.error('useLocalStorage set error', e);
}
}


return [state, setLocal];
}