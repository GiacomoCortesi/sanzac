import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const emailActions = {
  sendReservationAcceptedEmail: defineAction({
    input: z.object({
      to: z.string(),
      userName: z.string(),
    }),
    handler: async ({ to, userName }) => {
      try {
        const { data, error } = await resend.emails.send({
          from: "SanZak Studio <onboarding@reservations.couscousacolazione.com>",
          to: to,
          subject: `La tua prenotazione è stata accettata!`,
          html: `
            <h1>Ciao ${userName},</h1>
            <p>La tua prenotazione è stata accettata.</p>
            <p>Riceverai a breve una mail di conferma.</p>
            <p>Monitora lo stato <a href="https://sanzac.vercel.app">qui</a>.</p>
          `,
        });

        if (error) {
          console.error("Resend email error:", error);
          return { error: error.message };
        }

        console.log("Email sent successfully:", data);
        return { success: true, data };
      } catch (error) {
        console.error("Server error sending email:", error);
        return { error: "Failed to send email" };
      }
    },
  }),
  sendReservationConfirmedEmail: defineAction({
    input: z.object({
      to: z.string().email(),
      userName: z.string(),
    }),
    handler: async ({ to, userName }) => {
      try {
        const { data, error } = await resend.emails.send({
          from: "SanZak Studio <onboarding@reservations.couscousacolazione.com>",
          to: to,
          subject: `La tua prenotazione è stata confermata!`,
          html: `
            <h1>Ciao ${userName},</h1>
            <p>La tua prenotazione è stata confermata.</p>
          `,
        });

        if (error) {
          console.error("Resend email error:", error);
          return { error: error.message };
        }

        console.log("Email sent successfully:", data);
        return { success: true, data };
      } catch (error) {
        console.error("Server error sending email:", error);
        return { error: "Failed to send email" };
      }
    },
  }),
  sendReservationRequestEmail: defineAction({
    input: z.object({
      userName: z.string(),
    }),
    handler: async ({ userName }) => {
      try {
        const { data, error } = await resend.emails.send({
          from: "SanZak Studio <onboarding@reservations.couscousacolazione.com>",
          to: "vedimeglioquandosentiaps@gmail.com",
          subject: `Nuova richiesta di prenotazione!`,
          html: `
            <h1>${userName} ha richiesto una prenotazione dello studio.</h1>
            <p>Accetta o rifiuta la richiesta <a href="https://sanzac.vercel.app/login">qui</a>.</p>
          `,
        });

        if (error) {
          console.error("Resend email error:", error);
          return { error: error.message };
        }

        console.log("Email sent successfully:", data);
        return { success: true, data };
      } catch (error) {
        console.error("Server error sending email:", error);
        return { error: "Failed to send email" };
      }
    },
  }),
  sendReservationDeniedEmail: defineAction({
    input: z.object({
      to: z.string().email(),
      userName: z.string(),
    }),
    handler: async ({ to, userName }) => {
      try {
        const { data, error } = await resend.emails.send({
          from: "SanZak Studio <onboarding@reservations.couscousacolazione.com>",
          to: to,
          subject: `La tua prenotazione è stata rifiutata`,
          html: `
            <h1>Ciao ${userName},</h1>
            <p>Purtroppo abbiamo dovuto disdire la tua prenotazione.</p>
            <p>Per qualsiasi domanda non esitare a contattarci, via mail o sui nostri profili social.</p>
          `,
        });

        if (error) {
          console.error("Resend email error:", error);
          return { error: error.message };
        }

        console.log("Email sent successfully:", data);
        return { success: true, data };
      } catch (error) {
        console.error("Server error sending email:", error);
        return { error: "Failed to send email" };
      }
    },
  }),
};
