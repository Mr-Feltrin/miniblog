import styles from './Login.module.css';
import { useAuthentication } from '../../hooks/useAuthentication';
import { useState, useEffect } from 'react';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, error: authError, loading } = useAuthentication();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const user = {
            email,
            password
        }
        const res = await login(user);
    }

    useEffect(() => {
        if (authError) {
            setError(authError);
        }
    }, [authError]);

    return (
        <div className={styles.login}>
            <h1>Entrar</h1>
            <p>Faça o login para poder utilizar o sistema</p>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>E-mail:</span>
                    <input type="email" name='email' required placeholder='E-mail do usuário' value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    <span>Senha:</span>
                    <input type="password" name='password' required placeholder='Insira sua senha' value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button className='btn' disabled={loading}>{!loading ? "Entrar" : "Aguarde"}</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    )
}

export default Login;