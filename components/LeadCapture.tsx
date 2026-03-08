"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { ArrowRightIcon, BookIcon } from "@/components/icons";
import { leadPayloadSchema } from "@/lib/schemas";

type FormValues = {
  nombre: string;
  email: string;
  celular: string;
  rolTrabajo: string;
  usoTecnologia: string;
  consentimiento: boolean;
};

const stepOneSchema = leadPayloadSchema.pick({
  nombre: true,
  email: true,
  celular: true
});

const stepTwoSchema = leadPayloadSchema.pick({
  rolTrabajo: true,
  usoTecnologia: true,
  consentimiento: true
});

const initialForm: FormValues = {
  nombre: "",
  email: "",
  celular: "",
  rolTrabajo: "",
  usoTecnologia: "",
  consentimiento: false
};

export function LeadCapture({ hideDefaultTrigger = false }: { hideDefaultTrigger?: boolean }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<FormValues>(initialForm);
  const [error, setError] = useState("");

  const openModal = () => {
    setError("");
    setStep(1);
    setIsOpen(true);
  };

  useEffect(() => {
    const handleExternalTrigger = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      const trigger = target.closest("[data-open-lead-modal]");
      if (!trigger) {
        return;
      }

      event.preventDefault();
      setError("");
      setStep(1);
      setIsOpen(true);
    };

    document.addEventListener("click", handleExternalTrigger);

    return () => {
      document.removeEventListener("click", handleExternalTrigger);
    };
  }, []);

  const closeModal = () => {
    if (isLoading) {
      return;
    }

    setIsOpen(false);
    setStep(1);
  };

  const goToStepTwo = () => {
    setError("");

    const parsed = stepOneSchema.safeParse({
      nombre: form.nombre,
      email: form.email,
      celular: form.celular
    });

    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean)[0];

      setError(firstError ?? "Completa tus datos de contacto");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (step === 1) {
      goToStepTwo();
      return;
    }

    const stepTwoValidation = stepTwoSchema.safeParse({
      rolTrabajo: form.rolTrabajo,
      usoTecnologia: form.usoTecnologia,
      consentimiento: form.consentimiento
    });

    if (!stepTwoValidation.success) {
      const firstError = Object.values(stepTwoValidation.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean)[0];

      setError(firstError ?? "Completa los datos para continuar");
      return;
    }

    const parsed = leadPayloadSchema.safeParse(form);
    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean)[0];

      setError(firstError ?? "Revisa los campos del formulario");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data)
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message ?? "No pudimos completar el registro");
      }

      setForm(initialForm);
      setIsOpen(false);
      setStep(1);
      router.push("/gracias");
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "No pudimos completar el registro";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!hideDefaultTrigger && (
        <div className="dual-actions">
          <button className="primary-btn" type="button" onClick={openModal}>
            <BookIcon className="btn-icon" />
            Acceder a la Clase Gratuita
          </button>
        </div>
      )}

      {isOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Registro">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h3>Accede al video completo</h3>
                <p>
                  Regístrate en menos de 1 minuto y recibe por correo el enlace del video,
                  junto con la opción de agendar una cita estratégica con Solventio.
                </p>
              </div>
              <button className="close-btn" type="button" onClick={closeModal} aria-label="Cerrar">
                ×
              </button>
            </div>

            <div className="progress-stepper centered" aria-label="Progreso del formulario">
              <div className="progress-step">
                <span className="progress-label">Paso 1</span>
                <span className="progress-node active" aria-hidden="true">
                  1
                </span>
              </div>
              <span className={`progress-line ${step === 2 ? "active" : ""}`} aria-hidden="true" />
              <div className="progress-step">
                <span className="progress-label">Paso 2</span>
                <span className={`progress-node ${step === 2 ? "active" : ""}`} aria-hidden="true">
                  2
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className="form-grid">
                  <div className="field-wrap">
                    <label htmlFor="nombre">Nombre completo</label>
                    <input
                      id="nombre"
                      name="nombre"
                      value={form.nombre}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, nombre: event.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="field-wrap">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, email: event.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="field-wrap">
                    <label htmlFor="celular">Número de celular</label>
                    <PhoneInput
                      id="celular"
                      international
                      defaultCountry="CO"
                      value={form.celular}
                      onChange={(value) =>
                        setForm((prev) => ({ ...prev, celular: value ?? "" }))
                      }
                      className="phone-input-field"
                    />
                  </div>
                </div>
              ) : (
                <div className="form-grid">
                  <div className="field-wrap">
                    <label htmlFor="rolTrabajo">¿En qué trabajas?</label>
                    <input
                      id="rolTrabajo"
                      name="rolTrabajo"
                      value={form.rolTrabajo}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, rolTrabajo: event.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="field-wrap">
                    <label htmlFor="usoTecnologia">
                      ¿Cómo te gustaría usar más tecnología en tu negocio o trabajo?
                    </label>
                    <textarea
                      id="usoTecnologia"
                      name="usoTecnologia"
                      value={form.usoTecnologia}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, usoTecnologia: event.target.value }))
                      }
                      required
                    />
                  </div>

                  <label className="checkbox-row-improved" htmlFor="consentimiento">
                    <input
                      id="consentimiento"
                      type="checkbox"
                      checked={form.consentimiento}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, consentimiento: event.target.checked }))
                      }
                      required
                    />
                    <span>
                      Acepto el tratamiento de datos y autorizo contacto comercial de Solventio, de acuerdo con la{" "}
                      <Link href="/politica-de-privacidad" target="_blank" rel="noopener noreferrer">
                        Política de Privacidad
                      </Link>.
                    </span>
                  </label>
                </div>
              )}

              {error ? (
                <div className="error-text">
                  <p>{error}</p>
                  {/* Optional: Show full debug info if it's a JSON string or similar */}
                </div>
              ) : null}

              <p className="helper">
                Enviaremos el acceso al correo registrado y un enlace para agendar tu cita.
              </p>

              <div className="dual-actions right-align" style={{ marginTop: "1rem" }}>
                {step === 2 ? (
                  <button
                    className="secondary-btn"
                    type="button"
                    onClick={() => {
                      setError("");
                      setStep(1);
                    }}
                    disabled={isLoading}
                  >
                    Volver
                  </button>
                ) : null}

                <div className={`form-submit-wrap`}>
                  <button className="submit-btn" type="submit" disabled={isLoading}>
                    {step === 1 ? (
                      <>
                        Continuar
                        <ArrowRightIcon className="btn-icon" />
                      </>
                    ) : isLoading ? (
                      "Enviando..."
                    ) : (
                      <>
                        Registrarme y recibir acceso
                        <ArrowRightIcon className="btn-icon" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
