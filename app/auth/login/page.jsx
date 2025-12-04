'use client';
import React, { useState } from 'react';
import api from '../../../src/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');
            localStorage.setItem('token', data.token);
            router.push('/courses');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ maxWidth: 480 }}>
            <h2>Login</h2>
            <form onSubmit={submit}>
                <div>
                    <label>Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
