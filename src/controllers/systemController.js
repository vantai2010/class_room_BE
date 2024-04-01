const db = require("../models/index")
const userService = require('../services/userService')
const emailService = require('../services/emailService')
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")
const keyMap = require("../utils/constant/keyMap")
const fs = require("fs")
const path = require("path")

class systemController {
    handleLogin = async (req, res) => {
        try {
            let { email, password } = req.body
            if (!email || !password) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            let checkEmailExists = await userService.getUserByEmail(email)
            if (!checkEmailExists) {
                return res.status(200).json({
                    result: false,
                    messageEN: "This account does not exist",
                    messageVI: "Tài khoản này không tồn tại"
                })
            }
            let checkPass = await argon2.verify(checkEmailExists.password, password)
            if (!checkPass) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Pass validation failed",
                    messageVI: "Mật khẩu không chính xác"
                })
            }
            let token = jwt.sign({ userId: checkEmailExists.id, roleId: checkEmailExists.roleId }, process.env.ACCESS_TOKEN_SECRET)

            return res.status(200).json({
                result: true,
                messageEN: "Login successfully",
                messageVI: "Đăng nhập thành công",
                token: token,
                data: {
                    id: checkEmailExists.id,
                    email: checkEmailExists.email,
                    roleId: checkEmailExists.roleId,
                    firstName: checkEmailExists.firstName,
                    lastName: checkEmailExists.lastName,
                    phoneNumber: checkEmailExists.phoneNumber,
                    image: checkEmailExists.image,
                }
            })
        } catch (error) {
            console.log("dddddddddddd", error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    handleLoginWithToken = async (req, res) => {
        try {
            let user = await userService.getUserByUserId(req.userId)
            if (!user) {
                return res.status(200).json({
                    result: false,
                    messageEN: "This account does not exist",
                    messageVI: "Tài khoản này không tồn tại"
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Login successfully",
                messageVI: "Đăng nhập thành công",
                token: token,
                data: {
                    id: user.id,
                    email: user.email,
                    roleId: user.roleId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phoneNumber: user.phoneNumber,
                    image: user.image,
                }
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    handleRegisterAccount = async (req, res) => {
        try {
            let { email, password, roleId, language } = req.body
            if (!email || !password || !roleId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkEmailExists = await userService.getUserByEmail(email)
            if (checkEmailExists) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Email already exists",
                    messageVI: "Email này đã được sử dụng"
                })
            }
            let checkCreateAccount = await userService.createNewAccount({ email, password, roleId })
            if (!checkCreateAccount) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Create new account failed",
                    messageVI: "Tạo mới tài khoản thất bại"
                })
            }
            emailService.sendEmailRegister({
                receiverEmail: email,
                language: language ? language : keyMap.VI
            })
            return res.status(200).json({
                result: true,
                messageEN: "Register successfully, Please check your email to complete the registration procedure",
                messageVI: "Tạo tài khoản thành công, vui lòng check email để hoàn thành thủ tục đăng ký"
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }

    }

    handleRegisterAccountInformation = async (req, res) => {
        try {
            let { firstName, lastName, email, genderId, phoneNumber } = req.body
            if (!firstName || !lastName || !email || !genderId || !phoneNumber) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkUpdateInformations = await userService.UpdateInformation({ email, firstName, lastName, image: req.file?.filename, genderId, phoneNumber })
            if (!checkUpdateInformations) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Register imformation failed",
                    messageVI: "Đăng ký thông tin tài khoản thất bại"
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Register imformation successfully",
                messageVI: "Đăng ký thông tin tài khoản thành công"
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }

    }

    handleSendEmailForgotPass = async (req, res) => {
        try {
            let { email, language } = req.body
            if (!email) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkEmail = await userService.getUserByEmail(email)
            if (!checkEmail) {
                return res.status(200).json({
                    result: false,
                    messageEN: "This account does not exist",
                    messageVI: "Tài khoản này không tồn tại",
                })
            }
            // let userPhoneNumber = await userService.getPhoneNumber(email)
            emailService.sendEmailForgotPassword({ receiverEmail: email, phoneNumber: checkEmail.phoneNumber, language: language ? language : keyMap.VI })
            return res.status(200).json({
                result: true,
                messageEN: "Please check your email to recover your password",
                messageVI: "Vui lòng kiểm tra email để có thể thực hiện việc lấy lại mật khẩu",
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    handleChangePass = async (req, res) => {
        try {
            let { email, newPassword, phoneNumber } = req.body
            if (!email || !newPassword || !phoneNumber) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkVerifyIdentity = await userService.checkVerifyIdentity({ email, phoneNumber })
            if (!checkVerifyIdentity) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Password change failed because user authentication was incorrect",
                    messageVI: "Thay mật khẩu thất bại vì xác thực người dùng không đúng",
                })
            }
            let checkChangePass = await userService.changePass({ email, newPassword })
            if (!checkChangePass) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Change your pasword failed",
                    messageVI: "Thay mật khẩu thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Change your pasword successfully",
                messageVI: "Thay mật khẩu thành công",
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    dowloadFile = async (req, res) => {
        try {
            let { fileName } = req.query
            console.log(fileName)
            if (!fileName) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            const filePath = path.resolve(__dirname, "../../public/Documents/", fileName);
            return res.download(filePath, fileName, (err) => {
                if (err) {
                    console.log(err);
                    return res.status(404).json({
                        result: false,
                        message: "Không tìm thấy tệp",
                        // error: err.message
                    });
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    postNewNotify = async (req, res) => {
        try {
            let { receiverId, senderId, content } = req.body
            if (!receiverId || !senderId || !content) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            return res.status(200).json({
                result: true,
                messageEN: "Change your pasword successfully",
                messageVI: "Thay mật khẩu thành công",
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    sendEmail = async (req, res) => {
        try {
            let { typeId, receiverEmail, language } = req.body
            console.log("da cahya", typeId, receiverEmail, language)
            if (typeId === keyMap.emailTypeId.SEND_TO_INVIGILATOR) {
                emailService.sendEmailToInvigilator({ receiverEmail, language })
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

}

module.exports = new systemController()