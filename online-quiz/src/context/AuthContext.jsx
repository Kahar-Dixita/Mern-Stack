import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';


const AuthContext = createContext();


export function AuthProvider({ children }){
// users stored in localStorage 'qa_users'
const [users, setUsers] = useLocalStorage('qa_users', []);
const [user, setUser] = useLocalStorage('qa_current_user', null);


useEffect(() => {
  if (users.length === 0) {
    const admin = {
      id: 'admin-1',
      name: 'admin',
      email: 'harshil@gmail.com',
      password: 'harshil123',
      role: 'admin'
    };
    setUsers([admin]);
  }
}, [users]);



function register({ name, college, email, password }){
if(users.find(u=>u.email === email)){
throw new Error('Email already registered');
}
const newUser = { id: 'u-'+Date.now(), name, college, email, password, role: 'user' };
const next = [...users, newUser];
setUsers(next);
setUser({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });
return newUser;
}


function login({ email, password }){
const found = users.find(u=>u.email === email && u.password === password);
if(!found) throw new Error('Invalid credentials');
const authUser = { id: found.id, name: found.name, email: found.email, role: found.role };
setUser(authUser);
return authUser;
}


function logout(){
setUser(null);
}


function updateUser(updated){
const next = users.map(u=> u.id === updated.id ? { ...u, ...updated } : u);
setUsers(next);
if(user && user.id === updated.id){
setUser({ id: updated.id, name: updated.name, email: updated.email, role: updated.role });
}
}


function deleteUser(id) {
  const userToDelete = users.find(u => u.id === id);
  if (userToDelete?.role === 'admin') {
    alert("Admin account cannot be deleted!");
    return;
  }

  const next = users.filter(u => u.id !== id);
  setUsers(next);
  if (user && user.id === id) setUser(null);
}



return (
<AuthContext.Provider value={{ users, user, register, login, logout, updateUser, deleteUser, setUsers }}>
{children}
</AuthContext.Provider>
);
}


export function useAuth(){
return useContext(AuthContext);
}


export default function useAuthHook(){
return useAuth();
}