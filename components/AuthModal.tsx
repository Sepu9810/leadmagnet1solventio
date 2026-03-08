"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

type AuthMode = "login" | "register" | "profile" | "forgot_password" | "reset_password";

export function AuthModal() {
    const { user, signIn, signUp, signInWithGoogle } = useAuth();
    const { signIn: convexSignIn } = useAuthActions();
    const updateProfile = useMutation(api.users.updateProfile);
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<AuthMode>("register");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Step 1 states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);

    // Forgot / Reset states
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Step 2 profile states
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [goal, setGoal] = useState("");
    const [phone, setPhone] = useState("");

    // Listen for external triggers via data-open-auth-modal
    useEffect(() => {
        const handleTrigger = (event: Event) => {
            const target = event.target as HTMLElement | null;
            if (!target) return;

            const trigger = target.closest("[data-open-auth-modal]");
            if (!trigger) return;

            event.preventDefault();
            setError("");

            const reqMode = trigger.getAttribute("data-auth-mode") as AuthMode | null;
            if (reqMode) {
                setMode(reqMode);
            } else {
                setMode("register");
            }

            setIsOpen(true);
        };

        document.addEventListener("click", handleTrigger);
        return () => document.removeEventListener("click", handleTrigger);
    }, []);

    // Enforce Step 2 if user is logged in but hasn't completed profile
    useEffect(() => {
        if (user && !user.profileCompleted) {
            setMode("profile");
            setIsOpen(true);
        }
    }, [user]);

    const closeModal = () => {
        if (isLoading) return;
        setIsOpen(false);
        setError("");
        setEmail("");
        setPassword("");
        setDisplayName("");
        setAcceptPrivacy(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            if (mode === "profile") {
                if (!company.trim() || !role.trim() || !goal.trim() || !phone.trim()) {
                    setError("Por favor completa todos los campos del perfil");
                    setIsLoading(false);
                    return;
                }
                await updateProfile({ company, role, goal, phone });
                setIsOpen(false);
                setError("");
            } else if (mode === "register") {
                if (!displayName.trim()) {
                    setError("Ingresa tu nombre");
                    setIsLoading(false);
                    return;
                }
                if (!acceptPrivacy) {
                    setError("Debes aceptar la Política de Privacidad para registrarte.");
                    setIsLoading(false);
                    return;
                }
                const result = await signUp(email, password, displayName);
                if (result.error) {
                    setError(result.error);
                } else {
                    closeModal();
                }
            } else if (mode === "login") {
                const result = await signIn(email, password);
                if (result.error) {
                    setError(result.error);
                } else {
                    closeModal();
                }
            } else if (mode === "forgot_password") {
                if (!email.trim()) {
                    setError("Ingresa tu correo");
                    setIsLoading(false);
                    return;
                }
                try {
                    await convexSignIn("password", { email, flow: "reset" });
                    setMode("reset_password");
                    setError("");
                } catch {
                    setError("Error al enviar el correo. Revisa tu dirección.");
                }
            } else if (mode === "reset_password") {
                if (!newPassword.trim() || !resetCode.trim()) {
                    setError("Ingresa el código y la nueva contraseña");
                    setIsLoading(false);
                    return;
                }
                try {
                    await convexSignIn("password", { email, code: resetCode, newPassword, flow: "reset-verification" });
                    closeModal();
                } catch {
                    setError("Código inválido o contraseña muy corta.");
                }
            }
        } catch {
            setError("Ocurrió un error inesperado, revisa tus datos.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } catch (e: unknown) {
            console.error("GOOGLE AUTH ERROR:", e);
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const currentStep = mode === "profile" ? 2 : 1;

    return (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Autenticación">
            <div className="modal-card auth-modal-card">

                {/* Step Indicator — only visible in profile mode (step 2) */}
                {mode === "profile" && (
                    <div className="auth-step-indicator">
                        <div className={`auth-step ${currentStep >= 1 ? "auth-step-done" : ""}`}>
                            <div className="auth-step-circle">
                                {currentStep > 1 ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : "1"}
                            </div>
                            <span className="auth-step-label">Cuenta</span>
                        </div>
                        <div className="auth-step-line" />
                        <div className={`auth-step ${currentStep >= 2 ? "auth-step-active" : ""}`}>
                            <div className="auth-step-circle">2</div>
                            <span className="auth-step-label">Perfil</span>
                        </div>
                    </div>
                )}

                <div className="modal-header">
                    <div>
                        <h3>
                            {mode === "profile"
                                ? "Casi listo"
                                : mode === "register"
                                    ? "Crea tu cuenta"
                                    : mode === "forgot_password"
                                        ? "Recuperar cuenta"
                                        : mode === "reset_password"
                                            ? "Nueva contraseña"
                                            : "Bienvenido de vuelta"}
                        </h3>
                        <p>
                            {mode === "profile"
                                ? "Completa estos datos para personalizar tu experiencia."
                                : mode === "register"
                                    ? "Regístrate para acceder a todo el contenido de video y chat IA."
                                    : mode === "forgot_password"
                                        ? "Ingresa tu correo y te enviaremos un código de recuperación."
                                        : mode === "reset_password"
                                            ? "Revisa tu correo e ingresa el código junto con tu nueva contraseña."
                                            : "Inicia sesión para continuar aprendiendo."}
                        </p>
                    </div>
                    <button
                        className="close-btn"
                        type="button"
                        onClick={closeModal}
                        aria-label="Cerrar"
                        style={{ zIndex: 50, position: 'absolute', top: '15px', right: '15px' }}
                    >
                        ×
                    </button>
                </div>

                {mode !== "profile" && mode !== "forgot_password" && mode !== "reset_password" && (
                    <>
                        {/* Google OAuth Button */}
                        <button
                            className="google-auth-btn"
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span>Continuar con Google</span>
                        </button>

                        <div className="auth-divider">
                            <span>o con correo electrónico</span>
                        </div>
                    </>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        {mode === "profile" ? (
                            <>
                                <div className="field-wrap">
                                    <label htmlFor="auth-company">Nombre de tu empresa</label>
                                    <input
                                        id="auth-company"
                                        name="company"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        placeholder="Tu empresa"
                                        required
                                    />
                                </div>
                                <div className="field-wrap">
                                    <label htmlFor="auth-role">Cargo en la empresa</label>
                                    <input
                                        id="auth-role"
                                        name="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        placeholder="Ej. Fundador, Analista, etc."
                                        required
                                    />
                                </div>
                                <div className="field-wrap" style={{ gridColumn: '1 / -1' }}>
                                    <label htmlFor="auth-goal">¿Sobre qué cosas te gustaría aprender?</label>
                                    <textarea
                                        id="auth-goal"
                                        name="goal"
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value)}
                                        placeholder="Breve explicación de tu meta..."
                                        rows={2}
                                        style={{ width: "100%", padding: "0.8rem", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "var(--text)", fontFamily: "inherit", fontSize: "0.95rem", resize: "vertical" }}
                                        required
                                    />
                                </div>
                                <div className="field-wrap" style={{ gridColumn: '1 / -1' }}>
                                    <label htmlFor="auth-phone">Número Celular</label>
                                    <PhoneInput
                                        id="auth-phone"
                                        international
                                        defaultCountry="CO"
                                        value={phone}
                                        onChange={(value) => setPhone(value ?? "")}
                                        className="phone-input-field"
                                        required
                                    />
                                </div>
                            </>
                        ) : mode === "reset_password" ? (
                            <>
                                <div className="field-wrap">
                                    <label htmlFor="auth-code">Código de verificación</label>
                                    <input
                                        id="auth-code"
                                        name="resetCode"
                                        value={resetCode}
                                        onChange={(e) => setResetCode(e.target.value)}
                                        placeholder="Código recibido"
                                        required
                                    />
                                </div>
                                <div className="field-wrap">
                                    <label htmlFor="auth-new-password">Nueva contraseña</label>
                                    <input
                                        id="auth-new-password"
                                        type="password"
                                        name="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Mínimo 6 caracteres"
                                        minLength={6}
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                {mode === "register" && (
                                    <div className="field-wrap">
                                        <label htmlFor="auth-name">Nombre</label>
                                        <input
                                            id="auth-name"
                                            name="displayName"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="Tu nombre"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="field-wrap">
                                    <label htmlFor="auth-email">Correo electrónico</label>
                                    <input
                                        id="auth-email"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="correo@ejemplo.com"
                                        required
                                    />
                                </div>

                                {mode !== "forgot_password" && (
                                    <div className="field-wrap">
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <label htmlFor="auth-password">Contraseña</label>
                                            {mode === "login" && (
                                                <button
                                                    type="button"
                                                    style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}
                                                    onClick={() => {
                                                        setMode("forgot_password");
                                                        setError("");
                                                    }}
                                                >
                                                    ¿Olvidaste tu contraseña?
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            id="auth-password"
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Mínimo 6 caracteres"
                                            minLength={6}
                                            required
                                        />
                                    </div>
                                )}

                                {mode === "register" && (
                                    <label className="checkbox-row-improved" htmlFor="auth-privacy-consent">
                                        <input
                                            id="auth-privacy-consent"
                                            type="checkbox"
                                            checked={acceptPrivacy}
                                            onChange={(e) => setAcceptPrivacy(e.target.checked)}
                                            required
                                        />
                                        <span>
                                            Acepto la{" "}
                                            <Link href="/politica-de-privacidad" target="_blank" rel="noopener noreferrer">
                                                Política de Privacidad
                                            </Link>{" "}
                                            y autorizo el tratamiento de mis datos.
                                        </span>
                                    </label>
                                )}
                            </>
                        )}
                    </div>

                    {error && (
                        <div className="error-text" style={{ marginTop: "0.8rem" }}>
                            <p style={{ margin: 0 }}>{error}</p>
                        </div>
                    )}

                    <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
                        <button className="submit-btn" type="submit" disabled={isLoading}>
                            {isLoading
                                ? "Cargando..."
                                : mode === "profile"
                                    ? "Completar perfil"
                                    : mode === "register"
                                        ? "Crear cuenta"
                                        : mode === "forgot_password"
                                            ? "Enviar código"
                                            : mode === "reset_password"
                                                ? "Guardar contraseña"
                                                : "Iniciar sesión"}
                        </button>
                    </div>
                </form>

                {mode !== "profile" && (
                    <p className="auth-switch-text" style={{ textAlign: "center" }}>
                        {mode === "register" ? (
                            <>
                                ¿Ya tienes cuenta?{" "}
                                <button
                                    type="button"
                                    className="auth-switch-btn"
                                    onClick={() => {
                                        setMode("login");
                                        setError("");
                                    }}
                                >
                                    Inicia sesión
                                </button>
                            </>
                        ) : mode === "forgot_password" || mode === "reset_password" ? (
                            <>
                                <button
                                    type="button"
                                    className="auth-switch-btn"
                                    onClick={() => {
                                        setMode("login");
                                        setError("");
                                    }}
                                >
                                    Volver a iniciar sesión
                                </button>
                            </>
                        ) : (
                            <>
                                ¿No tienes cuenta?{" "}
                                <button
                                    type="button"
                                    className="auth-switch-btn"
                                    onClick={() => {
                                        setMode("register");
                                        setError("");
                                    }}
                                >
                                    Regístrate
                                </button>
                            </>
                        )}
                    </p>
                )}
            </div>
        </div>
    );
}
