import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { db } from "../firebase/config";

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    // Cleanup / deal with memory leak
    const [cancelled, setCancelled] = useState(false);
    const auth = getAuth();

    function checkIfIsCancelled() {
        if (cancelled) {
            return;
        }
    }

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    const logOut = () => {
        checkIfIsCancelled();
        signOut(auth);
    }

    const login = async (data) => {
        checkIfIsCancelled();
        setLoading(true);
        setError(false);
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            setLoading(false);
        }
        catch (error) {
            let systemErrorMessage;
            console.log(error.message);
            if (error.message.includes("invalid-credential")) {
                systemErrorMessage = "Usuário ou senha incorretos";
            }
            else {
                systemErrorMessage = "Ocorreu um erro interno do sistema, por favor tente novamente mais tarde";
            }
            setError(systemErrorMessage);
            setLoading(false);
        }
    }

    const createUser = async (data) => {
        checkIfIsCancelled();
        setLoading(true);
        setError(null);
        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            await updateProfile(user, { displayName: data.displayName });
            setLoading(false);
            return user;
        }
        catch (e) {
            let systemErrorMessage;
            if (e.message.includes("password")) {
                systemErrorMessage = "A senha precisa conter ao menos 6 caracteres";
            }
            else if (e.message.includes("email-already")) {
                systemErrorMessage = "Email ja está cadastrado";
            }
            else {
                systemErrorMessage = "Ocorreu um erro, tente mais tarde";
            }
            setError(systemErrorMessage);
            setLoading(false);
        }
    }
    return { auth, createUser, error, loading, logOut, login }
}