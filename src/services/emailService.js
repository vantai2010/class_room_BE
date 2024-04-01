const nodemailer = require('nodemailer');
const keyMap = require('../utils/constant/keyMap');
require('dotenv').config()

let sendEmailToInvigilator = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    let infor = await transporter.sendMail({
        from: '"SMART LEARN" <chuvantai2002@gmail.com>',
        to: dataSend.receiverEmail,
        subject: dataSend.language === keyMap.EN ? 'Notifycation' : 'Thông báo',
        html: getBodyHtmlEmail(dataSend)
    })
}

let getBodyHtmlEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === keyMap.VI) {
        result = `
        <p>Bạn đã được chỉ định làm giám thị cho bài thi trong ứng dụng của SMART LEARN vui lòng vào website để kiểm tra</p>
    `
    } else {
        result = `
        <p>You have been assigned as a proctor for the test in the SMART LEARN application, please go to the website to check</p>
        `
    }

    return result
}

let getBodyHTMLEmailResetPassword = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>xin chào</h3>
        <p>Bạn nhận được email này vì bạn có nhu cầu lấy lại mật khẩu</p>
        <p>Bạn vui lòng nhấn vào link bên dưới để đặt lại mật khẩu của mình<p>
        <div>Xin chân thành cảm ơn quý khách đã tin tưởng xử dụng dịch vụ của chúng tôi</div>
        <a href="${dataSend}">click here</a>
    `
    } else {
        result = `
        <h3>hello</h3>
         <p>You received this email because you need to reset your password</p>
         <p>Please click the link below to reset your password<p>
         <div>Thank you very much for trusting our service</div>
         <a href="${dataSend}">click here</a>
        `
    }

    return result
}


let sendAttachment = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    let infor = await transporter.sendMail({
        from: '"Công ty sức khỏe zephyous" <chuvantai2002@gmail.com>',
        to: dataSend.email,
        subject: dataSend.language === 'en' ? 'The Result of appointment appointment' : 'Kết quả đặt lịch khám bệnh',
        html: getBodyHtmlSendRemedyEmail(dataSend),
        attachments: [
            {
                filename: 'hoadon.png',
                content: dataSend.image.split("base64,")[1],
                encoding: 'base64'
            }
        ]
    })
}

let sendEmailResetPassword = async (dataSend) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    let infor = await transporter.sendMail({
        from: '"Thư viện eagleClup" <chuvantai2002@gmail.com>',
        to: dataSend.reciverEmail,
        subject: dataSend.language === 'en' ? 'Reset Password' : 'Đặt lại mật khẩu',
        html: getBodyHTMLEmailResetPassword(dataSend)

    })
}

let getBodyHTMLRegisterEmail = (dataSend) => {
    console.log(dataSend)
    let result = ''
    if (dataSend.language === keyMap.VI) {
        result = `
        <h3>xin chào</h3>
        <p>Bạn nhận được email này vì bạn đã đăng ký tài khoản smart learn chúng tôi</p>
        <p>Bên dưới có một đường link để đấn đến thủ tục tiếp theo trong quá trình đăng ký tài khoản của chúng tôi bạn vui lòng vào và nhập đầy đủ thông tin cá nhân của bản thân.<p>
        <a href="${process.env.URL_FRONT_END}/register/extra-infor/${dataSend.receiverEmail}/${dataSend.language}">click here</a>
        <div>Xin chân thành cảm ơn quý khách đã tin tưởng xử dụng dịch vụ của chúng tôi</div>
    `
    } else {
        result = `
        <h3>hello</h3>
        <p>You received this email because you signed up for an account with our smart learn</p>
        <p>There is a link below to go to the next step in our account registration process. Please enter and fill in your personal information.<p>
        <a href="${process.env.URL_FRONT_END}/register/extra-infor/${dataSend.receiverEmail}/${dataSend.language}">click here</a>
        <div>Thank you very much for trusting our service</div>
        `
    }

    return result
}

let sendEmailRegister = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    let infor = await transporter.sendMail({
        from: '"SMART LEARN" <chuvantai2002@gmail.com>',
        to: dataSend.receiverEmail,
        subject: dataSend.language === keyMap.EN ? 'Account registration procedure' : 'Thủ tục đăng ký tài khoản',
        html: getBodyHTMLRegisterEmail(dataSend)
    })
}

let getBodyHTMLEmailForgotPassword = (dataSend) => {
    let result = ''
    if (dataSend.language === keyMap.VI) {
        result = `
        <h3>xin chào</h3>
        <p>Bạn nhận được email này vì bạn có nhu cầu lấy lại mật khẩu</p>
        <p>Bạn vui lòng nhấn vào link bên dưới để đặt lại mật khẩu của mình<p>
        <a href="${process.env.URL_FRONT_END}/auth/forgot-password/${dataSend.receiverEmail}/${dataSend.phoneNumber}/${dataSend.language}">click here</a>
        <div>Xin chân thành cảm ơn quý khách đã tin tưởng xử dụng dịch vụ của chúng tôi</div>
    `
    } else {
        result = `
        <h3>hello</h3>
         <p>You received this email because you need to reset your password</p>
         <p>Please click the link below to reset your password<p>
         <a href="${process.env.URL_FRONT_END}/auth/forgot-password/${dataSend.receiverEmail}/${dataSend.phoneNumber}/${dataSend.language}">click here</a>
         <div>Thank you very much for trusting our service</div>
        `
    }

    return result
}

let sendEmailForgotPassword = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    let infor = await transporter.sendMail({
        from: '"SMART LEARN" <chuvantai2002@gmail.com>',
        to: dataSend.receiverEmail,
        subject: dataSend.language === keyMap.EN ? 'Forgot your password' : 'Quên mật khẩu',
        html: getBodyHTMLEmailForgotPassword(dataSend)
    })
}


module.exports = {
    sendEmailToInvigilator,
    sendAttachment,
    sendEmailResetPassword,
    sendEmailRegister,
    sendEmailForgotPassword,
}