import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";
import { Email } from "@convex-dev/auth/providers/Email";
import { Resend } from "resend";

const ResendOTPPasswordReset = Email({
  id: "resend-otp",
  apiKey: process.env.RESEND_API_KEY,
  maxAge: 60 * 15,
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new Resend(provider.apiKey as string);
    const { error } = await resend.emails.send({
      from: "Solventio <hola@solventio.co>",
      to: [email],
      subject: "Restablece tu contraseña - Solventio",
      text: `Tu código de verificación es: ${token}`,
    });

    if (error) {
      throw new Error("Could not send password reset email");
    }
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({ reset: ResendOTPPasswordReset }),
    Google
  ],
});

