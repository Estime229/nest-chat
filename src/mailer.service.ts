import { link } from 'fs';
import { Resend } from 'resend';

export class MailerService {
  private readonly mailer: Resend;
  constructor() {
    this.mailer = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail({
    recipient,
    firstName,
  }: {
    recipient: string;
    firstName: string;
  }) {
    try {
      const { data } = await this.mailer.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [recipient],
        subject: `Bienvenu Idiot`,
        html: `<strong>Bienvenu ${firstName} sur nest js chat ! Idiot</strong>`,
      });
      console.log({ data });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendCreatedAccountEmail({
    recipient,
    firstName,
    token,
  }: {
    recipient: string;
    firstName: string;
    token: string;
  }) {
    try {
      const link = `${process.env.FRONTEND_URL}/auth/reset-password/${token}`;
      const { data } = await this.mailer.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [recipient],
        subject: `Pour renitialiser votre mot de passe `,
        html: `<strong>Bonjour ${firstName} voici votre lien de renitialisation ${link}</strong>`,
      });
      console.log({ data });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
