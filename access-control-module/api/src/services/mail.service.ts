import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';

@Injectable()
export class MailService {
	private mailgunClient;

	private MAILGUN_KEY: string;
	private MAILGUN_DOMAIN: string;
	private MAIL_FROM: string;
	private APP_NAME: string;

	constructor(private configService: ConfigService) {
		// Initialize environment variables in constructor
		this.MAILGUN_KEY = this.configService.get<string>(
			'config.mailgun.apiKey',
		);
		this.MAILGUN_DOMAIN = this.configService.get<string>(
			'config.mailgun.domain',
		);
		this.MAIL_FROM = this.configService.get<string>('config.mailFrom');
		this.APP_NAME = this.configService.get<string>('config.appName');

		// Initialize Mailgun client
		const mailgun = new Mailgun(FormData);
		this.mailgunClient = mailgun.client({
			username: 'api',
			key: this.MAILGUN_KEY,
		});
	}

	async sendPasswordResetMail(to: string, name: string, resetLink: string) {
		try {
			const htmlContent = `
				<div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
					<h2 style="color: #4CAF50;">Password Reset Request</h2>
					<p>Hello ${name.split(' ')[0]},</p>
					<p>We received a request to reset your password. If you did not make this request, you can ignore this email.</p>
					<p>To reset your password, click the link below:</p>
					<a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a>
					<p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
					<p>${resetLink}</p>
					<p>Thank you,<br>${this.APP_NAME} Team</p>
					<hr />
					<p style="font-size: 12px; color: #999;">If you did not request a password reset, please disregard this email.</p>
				</div>
				`;

			return await this.mailgunClient.messages.create(
				this.MAILGUN_DOMAIN,
				{
					from: this.MAIL_FROM,
					to,
					subject: 'Password Reset Request',
					html: htmlContent,
				},
			);
		} catch (error) {
			throw error;
		}
	}

	async sendUserInviteMail(
		to: string,
		name: string,
		inviteLink: string,
		role: string,
	) {
		try {
			const htmlContent = `
				<div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
					<h2 style="color: #4CAF50;">You're Invited to Join ${this.APP_NAME}</h2>
					<p>Hello ${name.split(' ')[0]},</p>
					<p>You've been invited to join ${this.APP_NAME} as a <strong>${role}</strong>.</p>
					<p>To get started, please accept your invitation by clicking the link below:</p>
					<a href="${inviteLink}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
					<p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
					<p>${inviteLink}</p>
					<p>We look forward to working with you!</p>
					<p>Best Regards,<br>${this.APP_NAME} Team</p>
					<hr />
					<p style="font-size: 12px; color: #999;">If you did not expect this invitation, please disregard this email.</p>
				</div>
				`;

			return await this.mailgunClient.messages.create(
				this.MAILGUN_DOMAIN,
				{
					from: this.MAIL_FROM,
					to,
					subject: `You're Invited to Join ${this.APP_NAME}`,
					html: htmlContent,
				},
			);
		} catch (error) {
			throw error;
		}
	}

	async sendRoleUpdateMail(to: string, name: string, newRole: string) {
		try {
			const APP_URL = 'http://localhost:3001/auth/login';

			const htmlContent = `
				<div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
					<h2 style="color: #4CAF50;">Your Role Has Been Updated on ${this.APP_NAME}</h2>
					<p>Hello ${name.split(' ')[0]},</p>
					<p>We wanted to let you know that your role on ${this.APP_NAME} has been updated to <strong>${newRole}</strong>.</p>
					<p>With this new role, you may have additional permissions and access to new features.</p>
					<p>Feel free to log in and explore your updated permissions:</p>
					<a href="${APP_URL}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Log In</a>
					<p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
					<p>${APP_URL}</p>
					<p>If you have any questions about your new role, please feel free to reach out to us.</p>
					<p>Best Regards,<br>${this.APP_NAME} Team</p>
					<hr />
					<p style="font-size: 12px; color: #999;">If you think this is a mistake, please contact our support team immediately.</p>
				</div>
			`;

			return await this.mailgunClient.messages.create(
				this.MAILGUN_DOMAIN,
				{
					from: this.MAIL_FROM,
					to,
					subject: `Your Role Has Been Updated on ${this.APP_NAME}`,
					html: htmlContent,
				},
			);
		} catch (error) {
			throw error;
		}
	}

	async sendProjectAssignmentMail(
		to: string,
		name: string,
		projectName: string,
	) {
		try {
			const APP_URL = 'http://localhost:3001/projects';

			const htmlContent = `
				<div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
					<h2 style="color: #4CAF50;">You've Been Assigned a New Project on ${this.APP_NAME}</h2>
					<p>Hello ${name.split(' ')[0]},</p>
					<p>We’re excited to inform you that you’ve been assigned to a new project: <strong>${projectName}</strong>.</p>
					<p>You can view the project details and get started by logging into the platform:</p>
					<a href="${APP_URL}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">View Project</a>
					<p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
					<p>${APP_URL}</p>
					<p>If you have any questions regarding this project, please feel free to reach out to your project manager or team.</p>
					<p>Best Regards,<br>${this.APP_NAME} Team</p>
					<hr />
					<p style="font-size: 12px; color: #999;">If you think this assignment is a mistake, please contact our support team.</p>
				</div>
			`;

			return await this.mailgunClient.messages.create(
				this.MAILGUN_DOMAIN,
				{
					from: this.MAIL_FROM,
					to,
					subject: `New Project Assignment on ${this.APP_NAME}`,
					html: htmlContent,
				},
			);
		} catch (error) {
			throw error;
		}
	}

	async sendProjectUnassignmentMail(
		to: string,
		name: string,
		projectName: string,
	) {
		try {
			const APP_URL = 'http://localhost:3001/projects';

			const htmlContent = `
				<div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
					<h2 style="color: #4CAF50;">Update on Your Project Assignment in ${this.APP_NAME}</h2>
					<p>Hello ${name.split(' ')[0]},</p>
					<p>We wanted to let you know that you have been unassigned from the project <strong>${projectName}</strong> in ${this.APP_NAME}.</p>
					<p>If you believe this change was made in error or have any questions, please don't hesitate to reach out to us.</p>
					<p>You can view your current project assignments by logging into your account:</p>
					<a href="${APP_URL}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">View My Projects</a>
					<p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
					<p>${APP_URL}</p>
					<p>Thank you for your continued contributions.</p>
					<p>Best Regards,<br>${this.APP_NAME} Team</p>
					<hr />
					<p style="font-size: 12px; color: #999;">If you did not expect this change, please contact our support team immediately.</p>
				</div>
			`;

			return await this.mailgunClient.messages.create(
				this.MAILGUN_DOMAIN,
				{
					from: this.MAIL_FROM,
					to,
					subject: `Project Unassignment Notification in ${this.APP_NAME}`,
					html: htmlContent,
				},
			);
		} catch (error) {
			throw error;
		}
	}
}
