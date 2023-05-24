import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {email, nombre, token} = datos;

    const info = await transporter.sendMail({
        from: "APM - Asistente de Pedidos Musicales",
        to: email,
        subject: "Confirmación de registro de cuenta",
        text: "Confirmación de registro de cuenta",
        html: ` <p> Hola ${nombre}, te enviamos este email para confirmar tu registro en APM - Asistente de Pedidos Musicales </p>
                <p> Tu cuenta ya se encuentra lista, para confirmarla solo tienes que hacerle click en el siguiente enlace <a href="${process.env.FRONTEND_URL}/user/cliente/${token}">Enlace AQUÍ</a></p>

                <p> Si tu no creaste esta cuenta, puedes ignorar este mensaje</p> 
              `
    });

    console.log('Mensaje Enviado : %s', info.messageId);
};

export default emailRegistro;