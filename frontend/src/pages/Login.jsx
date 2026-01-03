import { useState } from 'react';
import { api } from '../utils/api';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = isRegister
                ? await api.register(email, password)
                : await api.login(email, password);

            if (data.error) {
                setError(data.error);
                return;
            }

            if (isRegister) {
                setIsRegister(false)
                setError('');
                alert('Registration successfull! Please login.');
            } else {
                onLogin(data.token);
            }
        } catch (err) {
            setError('Something went wrong');
        }
    };

    return (
        <div className='auth-form'>
            <h2>{isRegister ? 'Register' : 'Login'}</h2>
            {error && <div className='error'>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type='submit'>
                    {isRegister ? 'Register' : 'Login'}
                </button>
            </form>
            <p>
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <a onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? 'Login' : 'Register'}
                </a>
            </p>
        </div>
    );
}

export default Login;