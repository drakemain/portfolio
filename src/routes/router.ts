import express from 'express';
import dotenv from 'dotenv';
import {google} from 'googleapis'; import nodemailer from 'nodemailer';

import DatabaseInterface from '../database';

declare module 'nodemailer' {
    interface TransportOptions {
        service?: string,
        auth?: Object
    }
}

dotenv.config();

const apiRouter = express.Router();
const db = new DatabaseInterface(process.env['DB_NAME'], process.env['DB_CRED']);
db.connect();

apiRouter.get('/about', async (_, res) => {
    const aboutContent = await db.getAbout();
    res.send(aboutContent);
});

apiRouter.get('/projects', async(_, res) => {
    const projects = await db.getProjects();
    res.send(projects);
});

apiRouter.get('/history', async(_, res) => {
    const history = await db.getWorkHistory();
    res.send(history);
});

apiRouter.post('/contact', async(req, res) => {
    let form: ContactForm;

    try {
        console.log(req.body);
        form = new ContactForm(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    const clientId = process.env['GMAIL_CLIENT_ID'];
    const clientSecret = process.env['GMAIL_CLIENT_SECRET'];
    const refreshToken = process.env['GMAIL_REFRESH_TOKEN'];
    const oauthClient = new google.auth.OAuth2(clientId, clientSecret);
    const user = process.env['GMAIL_SENDER'];
    oauthClient.setCredentials({refresh_token: refreshToken});
    const accessToken = await oauthClient.getAccessToken();
    const transporterOptions = {
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user,
            clientId,
            clientSecret,
            refreshToken,
            accessToken
        }
    };
    const mailOptions = {
        from: `${form.name} <${form.email}>`,
        to: process.env['CONTACT_INBOX'],
        subject: `[${form.name}<${form.email}>] ${form.subject}`,
        text: form.message,
        sender: form.email,
    };
    const transporter = nodemailer.createTransport(transporterOptions);

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }
        console.log('Message sent.', info);
        res.sendStatus(200);
    });
});


class ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;

    constructor(formData: any) {
        if (!formData.name) {
            throw new Error('Missing name.');
        }

        if (!formData.email) {
            throw new Error('Missing email.');
        }

        if (!formData.subject) {
            throw new Error('Missing subject.');
        }

        if (!formData.message) {
            throw new Error('Missing subject.');
        }

        if (!this.validateEmail(formData.email)) {
            throw new Error('Email is not formatted correctly.');
        }

        this.name = formData.name;
        this.email = formData.email;
        this.subject = formData.subject;
        this.message = formData.message;
    }

    private validateEmail(email: string): boolean {
        const rx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        return rx.test(email.toLowerCase());
    }
}

export default apiRouter;
