const classService = require('../services/classService')
const emailService = require('../services/emailService')
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")
const keyMap = require('../utils/constant/keyMap')
const questionService = require('../services/questionService')
const examService = require('../services/examService')
const documentService = require('../services/documentService')
const studentClassService = require('../services/studentClassService')
const examInvigilatorService = require('../services/examInvigilatorService')
const roomVideoService = require('../services/roomVideoService')

class teacherController {
    createNewClassByTeacher = async (req, res) => {
        try {
            let { name, description, image, level } = req.body
            let userId = req.userId
            if (!name || !description || !level) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkNameClassExists = await classService.isNameClassExists({ name, teacherId: userId, type: keyMap.function.CREATE })
            if (checkNameClassExists) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Name class is already used",
                    messageVI: "Tên lớp đã được sử dụng"
                })
            }
            let checkCreateNewClass = await classService.createNewClass({ name, description, teacherId: userId, image: req.file?.filename, level })
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
                error: error.message
            })
        }
    }

    getQuestionByTeacher = async (req, res) => {
        try {
            let { typeId, level, search } = req.query
            let userId = req.userId
            if (!typeId || !level) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let listData = await questionService.getQuestions({ typeId, level, search, teacherId: userId })
            return res.status(200).json({
                result: true,
                messageEN: "Create new question successfully",
                messageVI: "Tạo câu hỏi mới thành công",
                data: listData
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    createNewQuestionByTeacher = async (req, res) => {
        try {
            let { questionPrompt, options, answer, typeId, level } = req.body
            let userId = req.userId
            if (!questionPrompt || !options || !answer || !typeId || !level) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkQuestionExists = await questionService.isQuestionExists({ teacherId: userId, questionPrompt, level, type: keyMap.function.CREATE })
            if (checkQuestionExists) {
                return res.status(200).json({
                    result: false,
                    messageEN: "this question is already exists",
                    messageVI: "Câu hỏi này đã tồn tại"
                })
            }
            let checkCreate = await questionService.createNewQuestion({ teacherId: userId, questionPrompt, options, answer, typeId, level })
            if (!checkCreate) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Create new question failed",
                    messageVI: "Tạo câu hỏi mới thất bại"
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Create new question successfully",
                messageVI: "Tạo câu hỏi mới thành công"
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    updateQuestionByTeacher = async (req, res) => {
        try {
            let { questionPrompt, options, answer, typeId, level, questionSelectedId } = req.body
            let userId = req.userId
            if (!questionPrompt || !options || !answer || !typeId || !level || !questionSelectedId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkQuestionExists = await questionService.isQuestionExists({ teacherId: userId, questionPrompt, level, type: keyMap.function.UPDATE, questionSelectedId })
            if (checkQuestionExists) {
                return res.status(200).json({
                    result: false,
                    messageEN: "this question is already exists",
                    messageVI: "Câu hỏi này đã tồn tại"
                })
            }
            let checkUpdate = await questionService.updateOneQuestion({ questionSelectedId, teacherId: userId, questionPrompt, options, answer, typeId, level })
            if (!checkUpdate) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Update question failed",
                    messageVI: "Cập nhật câu hỏi thất bại"
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Update question successfully",
                messageVI: "Cập nhật câu hỏi thành công"
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    deleteQuestionByTeacher = async (req, res) => {
        try {
            let { questionSelectedId } = req.query
            let userId = req.userId
            if (!questionSelectedId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            let checkDelete = await questionService.deleteOneQuestionById(questionSelectedId)
            if (!checkDelete) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Delete question failed",
                    messageVI: "Xoá câu hỏi thất bại"
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Delete question successfully",
                messageVI: "Xoá câu hỏi thành công"
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    createNewExamByTeacher = async (req, res) => {
        try {
            let { name, description, classId, dateFinish, typeId, statusId, timeLimit, listQuestionId } = req.body
            let userId = req.userId
            if (!name || !description || !classId || !dateFinish || !typeId || !statusId || !timeLimit || !listQuestionId || listQuestionId.length === 0) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkExamNameExists = await examService.isExamExists({ name, classId, type: keyMap.function.CREATE })
            if (checkExamNameExists) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Topic name is already exists",
                    messageVI: "Tên đề tài này đã tồn tại"
                })
            }
            let checkCreate = await examService.createNewExam({ teacherId: userId, name, description, timeLimit, classId, dateFinish, typeId, statusId, listQuestionId })
            if (!checkCreate) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Create new exam failed",
                    messageVI: "Tạo bài làm mới thất bại"
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Create new exam successfully",
                messageVI: "Tạo bài làm mới thành công",
                examId: checkCreate.id
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    updateOneExamByTeacher = async (req, res) => {
        try {
            let { examId, name, description, classId, timeLimit, dateFinish, typeId, statusId, listQuestionId, isUpdateQuestion } = req.body
            let userId = req.userId

            if (!examId || !name || !description || !classId || !timeLimit || !dateFinish || !typeId || !statusId || !listQuestionId || listQuestionId.length === 0) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkExamNameExists = await examService.isExamExists({ name, classId, type: keyMap.function.UPDATE })
            if (checkExamNameExists) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Topic name is already exists",
                    messageVI: "Tên đề tài này đã tồn tại"
                })
            }
            let checkUpdate = await examService.updateOneExam({ examId, teacherId: userId, name, description, timeLimit, classId, dateFinish, typeId, statusId, listQuestionId, isUpdateQuestion })
            if (!checkUpdate) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Update one exam failed",
                    messageVI: "Cập nhật bài làm thất bại"
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Update one exam successfully",
                messageVI: "Cập nhật bài làm thành công"
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                messageVI: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    updateOneExamInvigilatorByTeacher = async (req, res) => {
        try {
            let { examId, invigilatorId } = req.body
            let userId = req.userId

            if (!examId || !invigilatorId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkIsExist = await examInvigilatorService.checkIsExist({ examId, invigilatorId })
            if (checkIsExist) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Information is already exists",
                    messageVI: "Thông tin đã tồn tại"
                })
            }
            let checkUpdate = await examInvigilatorService.updateInvigilator({ examId, invigilatorId })
            if (!checkUpdate) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Updated exam proctor failed",
                    messageVI: "Cập nhật giám thị coi thi thất bại"
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Updated exam proctor successfully",
                messageVI: "Cập nhật giám thị coi thi thành công"
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                messageVI: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    getListClassByTeacher = async (req, res) => {
        try {
            let { search } = req.query
            let userId = req.userId
            // if (!name || !description || !classId || !dateUpload || !dateFinish || !typeId || !statusId || !listQuestionId) {
            //     return res.status(200).json({
            //         result: false,
            //         messageEN: "Invalid information",
            //         messageVI: "Thiếu thông tin chuyền lên"
            //     })
            // }

            let data = await classService.getListClassByTeacherId({ teacherId: userId, search })

            return res.status(200).json({
                result: true,
                messageEN: "Get list class successfully",
                messageVI: "Lấy danh sách lớp thành công",
                data: data
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    deleteOneExamByTeacher = async (req, res) => {
        try {
            let { examId } = req.query
            let userId = req.userId
            if (!examId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            let checkDelete = await examService.deleteOneExamByExamId({ examId })
            if (!checkDelete) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Delete exam failed",
                    messageVI: "Xóa bài thất bại",
                })
            }

            return res.status(200).json({
                result: true,
                messageEN: "Delete exam successfully",
                messageVI: "Xóa bài thành công",
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    postNewDocumentsByTeacher = async (req, res) => {
        try {
            let { classId } = req.query
            let userId = req.userId
            if (!classId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            let checkDelete = await documentService.postDocuments({ classId, files: req.files })
            if (!checkDelete) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Delete exam failed",
                    messageVI: "Xóa bài thất bại",
                })
            }

            return res.status(200).json({
                result: true,
                messageEN: "Delete exam successfully",
                messageVI: "Xóa bài thành công",
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    deleteOneDocumentByDocumentId = async (req, res) => {
        try {
            let { documentId, file } = req.query
            let userId = req.userId
            if (!documentId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkDeleteDocument = await documentService.deleteOneDocumentByDocumentId({ documentId, file })
            if (!checkDeleteDocument) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Delete document failed",
                    messageVI: "Xóa tài liệu thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Delete document successfully",
                messageVI: "Xóa tài liệu thành công",
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    deleteStudentOfClass = async (req, res) => {
        try {
            let { studentId, classId } = req.query
            let userId = req.userId
            if (!classId || !studentId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkDelete = await studentClassService.deleteOneStudentOfClass({ studentId, classId })
            if (!checkDelete) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Removing students from the class failed",
                    messageVI: "Xóa học sinh khỏi lớp thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Removing students from the class successfully",
                messageVI: "Xóa học sinh khỏi lớp thành công",
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    addNewStudentToClass = async (req, res) => {
        try {
            let { studentId, classId } = req.body
            let userId = req.userId
            if (!classId || !studentId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkStudentInClass = await studentClassService.isStudentInClass({ studentId, classId })
            if (checkStudentInClass) {
                return res.status(200).json({
                    result: false,
                    messageEN: "This student has attended the class before",
                    messageVI: "Học sinh này đã tham gia lớp trước đó",
                })
            }
            let checkCreate = await studentClassService.addNewStudentToClass({ studentId, classId })
            if (!checkCreate) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Add new student to class failed",
                    messageVI: "Thêm học sinh vào lớp thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Add new student to class successfully",
                messageVI: "Thêm học sinh vào lớp thành công",
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    getInforClassByClassId = async (req, res) => {
        try {
            let { classId } = req.query
            let userId = req.userId
            if (!classId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let data = await classService.getInforClassByClassId({ classId })
            return res.status(200).json({
                result: true,
                messageEN: "Get information of class successfully",
                messageVI: "Lấy thông tin lớp thành công",
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    updateInforClassByClassId = async (req, res) => {
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
                error: error.message
            })
        }
    }

    deleteClassByClassId = async (req, res) => {
        try {
            let { classId } = req.query
            let userId = req.userId
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
                    messageEN: "Delete class failed",
                    messageVI: "Xoá lớp thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Delete class successfully",
                messageVI: "Xoá lớp thành công",
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    getListExamsOfInvigilatorByTeacherId = async (req, res) => {
        try {
            let userId = req.userId

            let data = await examInvigilatorService.getLigetListExamsOfInvigilatorByInvigilatorId({ invigilatorId: userId })

            return res.status(200).json({
                result: true,
                messageEN: "Get information successfully",
                messageVI: "Lấy danh thông tin thành công",
                data: data
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    openExamByTeacher = async (req, res) => {
        try {
            let { examId } = req.body
            let userId = req.userId
            if (!examId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkUpdate = await examService.openExamByExamId({ examId })
            if (!checkUpdate) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Update information failed",
                    messageVI: "Cập nhật thông tin thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Update information successfully",
                messageVI: "Cập nhật thông tin thành công",
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    createRoomVideoByTeacher = async (req, res) => {
        try {
            let { examId, roomId, roomToken } = req.body
            let userId = req.userId
            if (!examId || !roomId || !roomToken) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkUpdate = await roomVideoService.createNewRoom({ examId, roomId, roomToken })
            if (!checkUpdate) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Create information failed",
                    messageVI: "Tạo thông tin thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Create information successfully",
                messageVI: "Tạo thông tin thành công",
            })
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

module.exports = new teacherController()