const db = require("../models/index")
const userService = require('../services/userService')
const emailService = require('../services/emailService')
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")
const keyMap = require("../utils/constant/keyMap")
const classService = require("../services/classService")
const questionService = require("../services/questionService")
const examService = require("../services/examService")

class adminController {
    getAllUsers = async (req, res) => {
        try {
            // let { parentsId } = req.query
            // let userId = req.userId
            // if (!parentsId) {
            //     return res.status(200).json({
            //         result: false,
            //         messageEN: "Invalid information",
            //         messageVI: "Thiếu thông tin chuyền lên"
            //     })
            // }

            let data = await userService.getAllUsers()

            return res.status(200).json({
                result: true,
                messageEN: "get data  successfully",
                messageVI: "Lấy dữ liệu thành công",
                data
            })
        } catch (error) {
            console.log("sss", error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    deleteUserById = async (req, res) => {
        try {
            let { userId } = req.query
            if (!userId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            let checkDelete = await userService.deleteUserById({ userId })
            if (!checkDelete) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Delete data  successfully",
                    messageVI: "Xóa dữ liệu thành công",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Delete data  successfully",
                messageVI: "Xóa dữ liệu thành công",
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    createNewUserByAdmin = async (req, res) => {
        try {
            let { email, password, firstName, lastName, roleId, image, genderId, phoneNumber } = req.body
            if (!email || !firstName || !lastName || !roleId || !genderId || !phoneNumber || !password) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkExists = await userService.checkAccountExist({ email, type: keyMap.function.CREATE })
            if (checkExists) {
                return res.status(200).json({
                    result: false,
                    messageEN: "This email is already in use",
                    messageVI: "Email này đã được sử dụng",
                })
            }
            let checkCreate = await userService.createNewUserByAdmin({ email, firstName, password, lastName, roleId, image: req.file?.filename, genderId, phoneNumber })
            if (!checkCreate) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Create data  failed",
                    messageVI: "Thêm dữ liệu thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Create data  successfully",
                messageVI: "Thêm dữ liệu thành công",
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    updateOneUserByAdmin = async (req, res) => {
        try {
            let { email, userId, firstName, lastName, roleId, image, genderId, phoneNumber } = req.body
            if (!email || !userId || !firstName || !lastName || !genderId || !phoneNumber) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            // let checkExists = await userService.checkAccountExist({ email, type: keyMap.function.UPDATE, userId })
            // if (checkExists) {
            //     return res.status(200).json({
            //         result: false,
            //         messageEN: "This email is already in use",
            //         messageVI: "Email này đã được sử dụng",
            //     })
            // }
            let checkCreate = await userService.UpdateInformation({ email, firstName, lastName, roleId, image: req.file?.filename, genderId, phoneNumber })
            if (!checkCreate) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Create data  failed",
                    messageVI: "Thêm dữ liệu thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Create data  successfully",
                messageVI: "Thêm dữ liệu thành công",
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    getAllClass = async (req, res) => {
        try {
            // let { parentsId } = req.query
            // let userId = req.userId
            // if (!parentsId) {
            //     return res.status(200).json({
            //         result: false,
            //         messageEN: "Invalid information",
            //         messageVI: "Thiếu thông tin chuyền lên"
            //     })
            // }

            let data = await classService.getAllClass()

            return res.status(200).json({
                result: true,
                messageEN: "get data  successfully",
                messageVI: "Lấy dữ liệu thành công",
                data
            })
        } catch (error) {
            console.log("sss", error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    createNewClass = async (req, res) => {
        try {
            let { name, description, image, level, teacherId } = req.body
            if (!name || !description || !level || !teacherId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkNameClassExists = await classService.isNameClassExists({ name, teacherId, type: keyMap.function.CREATE })
            if (checkNameClassExists) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Name class is already used",
                    messageVI: "Tên lớp đã được sử dụng"
                })
            }
            let checkCreateNewClass = await classService.createNewClass({ name, description, teacherId, image: req.file?.filename, level })
            if (!checkCreateNewClass) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Create new class failed",
                    messageVI: "Tạo mới lớp thất bại"
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Create new class successfully",
                messageVI: "Tạo mới lớp thành công"
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    updateClass = async (req, res) => {
        try {
            let { classId, name, description, image, level, newImage } = req.body
            let userId = req.userId
            if (!classId || !name || !description || !level) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkExist = await classService.isNameClassExists({ name, teacherId: userId, type: keyMap.function.UPDATE, classSelectedId: classId })
            if (checkExist) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Name class already exists",
                    messageVI: "Tên lớp này đã tồn tại",
                })
            }
            let checkUpdate = await classService.updateInforClass({ classId, name, teacherId: userId, description, image, newImage: req.file?.filename, level })
            if (!checkUpdate) {
                return res.status(200).json({
                    result: true,
                    messageEN: "Update information of class failed",
                    messageVI: "Cập nhật thông tin lớp thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Update information of class successfully",
                messageVI: "Cập nhật thông tin lớp thành công",
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    deleteOneClass = async (req, res) => {
        try {
            let { classId } = req.query
            if (!classId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            let checkDelete = await classService.deleteClassByClassId({ classId })
            if (!checkDelete) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Delete data  failed",
                    messageVI: "Xóa dữ liệu thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Delete data  successfully",
                messageVI: "Xóa dữ liệu thành công",
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }
    getAllQuestion = async (req, res) => {
        try {
            // let { parentsId } = req.query
            // let userId = req.userId
            // if (!parentsId) {
            //     return res.status(200).json({
            //         result: false,
            //         messageEN: "Invalid information",
            //         messageVI: "Thiếu thông tin chuyền lên"
            //     })
            // }

            let data = await questionService.getAllQuestion()

            return res.status(200).json({
                result: true,
                messageEN: "get data  successfully",
                messageVI: "Lấy dữ liệu thành công",
                data
            })
        } catch (error) {
            console.log("sss", error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }
    createOneQuestion = async (req, res) => {
        console.log(">>> chay vao dau", req)
        try {
            let { teacherId ,questionPrompt, options, answer, typeId, level } = req.body
            if (!teacherId || !questionPrompt || !options || !answer || !typeId || !level) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            let checkQuestionExists = await questionService.isQuestionExists({ teacherId, questionPrompt, level,type: keyMap.function.CREATE })
            if (checkQuestionExists) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Question is already exists",
                    messageVI: "Câu hỏi đã tồn tại"
                })
            }
            let checkCreateNewClass = await questionService.createOneQuestion({teacherId ,questionPrompt, options, answer, typeId, level})
            if (!checkCreateNewClass) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Create new question failed",
                    messageVI: "Tạo mới câu hỏi thất bại"
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Create new question successfully",
                messageVI: "Tạo mới câu hỏi thành công",
            })

            
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
            })
        }
    }
    updateOneQuestion = async (req, res) => {
        try {
            let {questionId, teacherId ,questionPrompt, options, answer, typeId, level } = req.body
        console.log(">>> chec", questionId)
            
            let userId = req.userId
            if ( !questionId || !teacherId || !questionPrompt || !options || !answer || !typeId || !level) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkExist = await questionService.isQuestionExists({ questionPrompt, level , teacherId: teacherId, type: keyMap.function.UPDATE, questionSelectedId: questionId })
            if (checkExist) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Name question already exists",
                    messageVI: "Câu hỏi này đã tồn tại",
                })
            }
            let checkUpdate = await questionService.updateOneQuestion({ questionSelectedId : questionId, teacherId, questionPrompt, options, answer, typeId, level })
            if (!checkUpdate) {
                return res.status(200).json({
                    result: true,
                    messageEN: "Update information of question failed",
                    messageVI: "Cập nhật thông tin câu hỏi thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Update information of question successfully",
                messageVI: "Cập nhật thông tin câu hỏi thành công",
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }
    deleteOneQuestion = async (req, res) => {
        try {
            let { questionId } = req.query
            if (!questionId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            let checkDelete = await questionService.deleteOneQuestionById({ questionSelectedId: questionId })
            if (!checkDelete) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Delete data  failed",
                    messageVI: "Xóa dữ liệu thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Delete data  successfully",
                messageVI: "Xóa dữ liệu thành công",
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }


    getServiceAllExam = async (req, res) => {
        try {
            // let { parentsId } = req.query
            // let userId = req.userId
            // if (!parentsId) {
            //     return res.status(200).json({
            //         result: false,
            //         messageEN: "Invalid information",
            //         messageVI: "Thiếu thông tin chuyền lên"
            //     })
            // }
            console.log(">>> chay vao day")

            let data = await examService.getAllFindExam()

            return res.status(200).json({
                result: true,
                messageEN: "get data  successfully",
                messageVI: "Lấy dữ liệu thành công",
                data
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }
    searchClassByName = async (req, res) => {
        try {
            let { search } = req.query
            console.log(">>> check searck", search)
            let userId = req.userId
            if (!search) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            let data = await classService.searchClassByName({search})
            return res.status(200).json({
                result: true,
                messageEN: "get data  successfully",
                messageVI: "Lấy dữ liệu thành công",
                data
            })
        } catch (error) {
            console.log("sss", error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
            })
        }
    }
    getQuestionsTeacher = async (req, res) => {
        try {
            let { typeId, level, teacherId } = req.query
            let userId = req.userId
            if (!typeId || !level || !teacherId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            let data = await questionService.getQuestions({ typeId, level, teacherId })

            return res.status(200).json({
                result: true,
                messageEN: "get data  successfully",
                messageVI: "Lấy dữ liệu thành công",
                data
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }


}


module.exports = new adminController()