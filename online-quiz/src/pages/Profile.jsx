import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';


export default function Profile() {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email] = useState(user?.email || '');
    const [message, setMessage] = useState('');


    function save() {
        updateUser({ id: user.id, name, email, role: user.role });
        setMessage('Saved');
    }


    return (
        <div className="container">
            <div className="card" style={{ maxWidth: 600 }}>
                <h3>Profile</h3>
                {message && <div className="small">{message}</div>}
                <div className="form-row"><label>Name</label><input value={name} onChange={e => setName(e.target.value)} /></div>
                <div className="form-row"><label>Email</label><input value={email} disabled /></div>
                <button className="btn btn-primary" onClick={save}>Save</button>
            </div>
        </div>
    );
}