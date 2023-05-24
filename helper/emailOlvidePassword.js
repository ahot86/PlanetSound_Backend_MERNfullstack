import nodemailer from 'nodemailer';

const emailOlvidePassword = async (data) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {email, nombre, token} = data;

    const info = await transporter.sendMail({
        from: "APM - Asistente de Pedidos Musicales",
        to: email,
        subject: "Información para generar un nuevo password",
        text: "Información para generar un nuevo password",
        html: ` <p>Hola ${nombre}, te hemos enviado este email para que puedas generar tu nuevo password</p>
                <p>A continuación solo tienes que hacer click en el siguiente enlace <a href="${process.env.FRONTEND_URL}/user/cliente/olvide-password/${token}">Enlace AQUÍ</a></p>

                <p> Si tu no solicitaste este email, puedes ignorar este mensaje</p> 
              `
    });

    console.log('Mensaje Enviado : %s', info.messageId);    
};

export default emailOlvidePassword;