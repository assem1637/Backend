import nodemailer from 'nodemailer';








const sendResetCodeToEmail = async (code, email, name) => {

    let transporter = nodemailer.createTransport({
        service: "outlook",
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASSWORD, // generated ethereal password
        },
    });


    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"E-Shop 👻" <support@eshop.com>', // sender address
        to: email, // list of receivers
        subject: `${name}, this is your PIN code ✔`, // Subject line
        text: `${name}, this is your PIN code`, // plain text body
        html: `
        
            <h2>Hi ${name},</h2>
            <br />
            <p>We have received a request to reset your E-Shop account password.</p>
            <br />
            <h3>${code}</h3>
            <br />
            <p>Enter this code to complete the password reset.</p>
            <br />
            <p>Thank you for helping us ensure your account is secure.</p>
            <br />
            <p>E-Shop Team</p>

        `, // html body
    });

};


export default sendResetCodeToEmail;


