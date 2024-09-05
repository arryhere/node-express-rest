import httpStatus from 'http-status';
import nodemailer from 'nodemailer';
import Exception from '../helpers/error.helper.js';
import { log_info } from '../helpers/log.helper.js';
import { config } from './config.js';

export async function send_email(subject: string, html: string, to_email: string) {
  try {
    const mail_transport = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      auth: { user: config.smtp.username, pass: config.smtp.password },
    });

    const res = await mail_transport.sendMail({
      from: config.email.from,
      to: to_email,
      replyTo: config.email.from,
      subject: subject,
      html: html,
    });

    log_info('email log', { res });
  } catch (error) {
    throw new Exception('Failed to send email', httpStatus.INTERNAL_SERVER_ERROR, {});
  }
}
