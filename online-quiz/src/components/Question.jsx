import React from 'react';

export default function Question({ q, value, onChange, index }) {

    const displayNumber = index + 1; // <--- number based on shuffled order

    return (
        <div className="card">
            <h4>{displayNumber}. {q.text}</h4>

            {q.choices.map(c => (
                <div key={c.id} style={{ marginTop: '0.5rem' }}>
                    <label>
                        <input
                            type="radio"
                            name={q.id}
                            value={c.id}
                            checked={value === c.id}
                            onChange={(e) => onChange(q.id, e.target.value)}
                        />
                        {' '}{c.id}. {c.text}
                    </label>
                </div>
            ))}
        </div>
    );
}
