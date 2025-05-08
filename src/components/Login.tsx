import React, { useState } from 'react';
import type { Language } from '../shared/types';
import { RegisterUserUseCase } from '../application/useCases/RegisterUserUseCase';
import { LoginUserUseCase } from '../application/useCases/LoginUserUseCase';
import { FirebaseAuthService } from '../infrastructure/firebase/FirebaseAuthService';
import { EmailService } from '../infrastructure/external/EmailService';

// Dependency Injection
const authService = new FirebaseAuthService();
const emailService = new EmailService();
const registerUserUseCase = new RegisterUserUseCase(authService, emailService);
const loginUserUseCase = new LoginUserUseCase(authService);

interface LoginProps {
    language: Language;
}

const Login: React.FC<LoginProps> = ({ language }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const texts = {
        fr: {
            loginTitle: 'Connexion',
            registerTitle: 'Inscription',
            name: 'Nom',
            email: 'Email',
            password: 'Mot de passe',
            login: 'Se connecter',
            register: 'S’inscrire',
            toggleLogin: 'Déjà un compte ? Se connecter',
            toggleRegister: 'Pas de compte ? S’inscrire',
            error: 'Erreur lors de la connexion ou de l’inscription. Vérifiez vos identifiants.',
            support: 'Support',
        },
        en: {
            loginTitle: 'Login',
            registerTitle: 'Register',
            name: 'Name',
            email: 'Email',
            password: 'Password',
            login: 'Log In',
            register: 'Register',
            toggleLogin: 'Already have an account? Log In',
            toggleRegister: 'No account? Register',
            error: 'Error during login or registration. Check your credentials.',
            support: 'Support',
        },
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isRegister) {
                await registerUserUseCase.execute({ name, email, password }, language);
                setName('');
                setEmail('');
                setPassword('');
                setIsRegister(false);
            } else {
                await loginUserUseCase.execute({ email, password });
            }
            //e.currentTarget.reset();
        } catch (err: any) {
            setError(texts[language].error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    {isRegister ? texts[language].registerTitle : texts[language].loginTitle}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {isRegister && (
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="name">
                                {texts[language].name}
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                            {texts[language].email}
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">
                            {texts[language].password}
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="btn-primary w-full hover:scale-105 transition-transform flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : null}
                        {isRegister ? texts[language].register : texts[language].login}
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        disabled={isLoading}
                    >
                        {isRegister ? texts[language].toggleLogin : texts[language].toggleRegister}
                    </button>
                </p>
                <p className="mt-2 text-center text-gray-600 text-sm">
                    {texts[language].support}:{' '}
                    <a href="https://wa.me/27734412228" className="text-blue-600 hover:text-blue-700">
                        +27 73 441 2228
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;