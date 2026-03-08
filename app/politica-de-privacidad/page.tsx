import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | LearnHub Solventio",
  description:
    "Conoce cómo LearnHub by Solventio recopila, usa y protege tus datos personales.",
  alternates: {
    canonical: "https://learnhub.solventio.co/politica-de-privacidad",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PoliticaPrivacidadPage() {
  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "7.5rem 1.25rem 4rem" }}>
      <h1 style={{ marginBottom: "0.75rem" }}>Política de Privacidad</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Última actualización: 8 de marzo de 2026
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h2>1. Responsable del tratamiento</h2>
        <p>
          Solventio S.A.S. es responsable del tratamiento de los datos personales
          recolectados a través de LearnHub by Solventio.
        </p>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>2. Datos que recopilamos</h2>
        <p>
          Podemos recopilar datos de identificación y contacto como nombre, correo
          electrónico, número de celular, empresa, cargo, intereses de aprendizaje
          y datos de uso de la plataforma.
        </p>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>3. Finalidades del tratamiento</h2>
        <p>Usamos los datos para:</p>
        <ul>
          <li>Gestionar el acceso a contenidos, videos y funcionalidades de LearnHub.</li>
          <li>Personalizar la experiencia y recomendaciones de contenido.</li>
          <li>Atender solicitudes, soporte y comunicaciones relacionadas al servicio.</li>
          <li>Enviar información comercial de Solventio cuando exista autorización.</li>
          <li>Mejorar seguridad, rendimiento y analítica de la plataforma.</li>
        </ul>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>4. Base legal</h2>
        <p>
          Tratamos tus datos con base en tu consentimiento, en la ejecución de la
          relación contractual de uso de la plataforma y en el cumplimiento de
          obligaciones legales aplicables.
        </p>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>5. Compartición de datos</h2>
        <p>
          Podemos compartir datos con proveedores tecnológicos que soportan la
          operación (por ejemplo, infraestructura, autenticación, analítica y
          correo), bajo acuerdos de confidencialidad y seguridad.
        </p>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>6. Conservación de la información</h2>
        <p>
          Conservamos los datos durante el tiempo necesario para cumplir las
          finalidades informadas, atender obligaciones legales y resolver
          requerimientos o reclamaciones.
        </p>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>7. Derechos del titular</h2>
        <p>
          Puedes solicitar acceso, actualización, rectificación, supresión y
          revocatoria del consentimiento, así como presentar consultas o reclamos
          sobre el tratamiento de tus datos.
        </p>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>8. Seguridad</h2>
        <p>
          Aplicamos medidas razonables de seguridad administrativas, técnicas y
          organizativas para proteger la información contra acceso no autorizado,
          pérdida o alteración.
        </p>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>9. Contacto</h2>
        <p>
          Para ejercer tus derechos o resolver dudas sobre privacidad, escríbenos
          a <a href="mailto:hola@solventio.co">hola@solventio.co</a>.
        </p>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>10. Cambios a esta política</h2>
        <p>
          Esta política puede actualizarse periódicamente. Publicaremos cualquier
          cambio en esta misma página con la fecha de última actualización.
        </p>
      </section>
    </main>
  );
}
