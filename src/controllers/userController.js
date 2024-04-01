const classService = require('../services/classService')
const emailService = require('../services/emailService')
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")
const keyMap = require('../utils/constant/keyMap')
const questionService = require('../services/questionService')
const examService = require('../services/examService')
const documentService = require('../services/documentService')
const examQuestionService = require('../services/examQuestionService')
const studentClassService = require('../services/studentClassService')
const userService = require('../services/userService')
const resultHistoryService = require('../services/resultHistoryService')
const resultExamService = require('../services/resultExamService')
const examInvigilatorService = require('../services/examInvigilatorService')
const notifyService = require('../services/notifyService')
const relationshipService = require('../services/relationshipService')

class userController {
    getListAssignmentsOfClassByClassId = async (req, res) => {
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

            let data = await examService.getListAssignmentsClassByClassId({ classId })
            let listExamId = data.map(item => item.id)
            let pointData = await resultHistoryService.getPointExamByListExamId({ listExamId })

            let arrData = data.map(item => {
                let point = -1
                pointData.forEach(eachExamPoint => {
                    if (eachExamPoint.examId === item.id) {
                        point = eachExamPoint.result
                    }
                })
                return {
                    ...item,
                    point: point
                }
            })

            return res.status(200).json({
                result: true,
                messageEN: "Get list assignments successfully",
                messageVI: "Lấy danh sách bài tập thành công",
                data: arrData,
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

    getListExamsOfClassByClassId = async (req, res) => {
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

            let data = await examService.getListExamsClassByClassId({ classId })
            let listExamId = data.map(item => item.id)
            let pointData = await resultHistoryService.getPointExamByListExamId({ listExamId })

            let arrData = data.map(item => {
                let point = -1
                pointData.forEach(eachExamPoint => {
                    if (eachExamPoint.examId === item.id) {
                        point = eachExamPoint.result
                    }
                })
                return {
                    ...item,
                    point: point
                }
            })
            return res.status(200).json({
                result: true,
                messageEN: "Get list exams successfully",
                messageVI: "Lấy danh sách bài thi thành công",
                data: arrData
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    getListDocumentsOfClassByClassId = async (req, res) => {
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

            let data = await documentService.getListDocumentsClassByClassId({ classId })

            return res.status(200).json({
                result: true,
                messageEN: "Get list exams successfully",
                messageVI: "Lấy danh sách bài thi thành công",
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

    getListQuestionsOfExamByExamId = async (req, res) => {
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

            let data = await examQuestionService.getListQuestionOfExamByExamId({ examId })

            return res.status(200).json({
                result: true,
                messageEN: "Get list question successfully",
                messageVI: "Lấy danh sách câu hỏi thành công",
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

    getContentAssignmentOfClassById = async (req, res) => {
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

            let dataQuestion = await examQuestionService.getListQuestionOfExamForGroup({ examId })
            let dataExam = await examService.getContentExamByExamId({ examId })

            return res.status(200).json({
                result: true,
                messageEN: "Get list question successfully",
                messageVI: "Lấy danh sách câu hỏi thành công",
                data: {
                    ...dataExam,
                    question: {
                        ...dataQuestion
                    }
                }
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    getListQuestionsOfExamByExamId = async (req, res) => {
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

            let dataQuestion = await examQuestionService.getListQuestionOfExamForGroup({ examId })

            return res.status(200).json({
                result: true,
                messageEN: "Get list question successfully",
                messageVI: "Lấy danh sách câu hỏi thành công",
                data: dataQuestion
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                error: error.message
            })
        }
    }

    getListClass = async (req, res) => {
        try {
            let userId = req.userId
            let data = await studentClassService.getListClassByStudentId({ studentId: userId })

            return res.status(200).json({
                result: true,
                messageEN: "Get list class successfully",
                messageVI: "Lấy danh sách lớp thành công",
                data: data
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
                messageEN: "Get information class successfully",
                messageVI: "Lấy thông tin lớp thành công",
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

    getAssignmentClass = async (req, res) => {
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

            let data = await examService.getListAssignmentsClassByClassId({ classId })

            return res.status(200).json({
                result: true,
                messageEN: "Get information class successfully",
                messageVI: "Lấy thông tin lớp thành công",
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

    searchStudent = async (req, res) => {
        try {
            let { search, classId } = req.query
            let userId = req.userId
            let roleId = req.roleId
            if (!search) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let listUserIdSkip
            if (roleId === keyMap.roleId.PARENTS) {
                listUserIdSkip = await relationshipService.getListStudentIdOfParents({ parentsId: userId })
            } else {
                listUserIdSkip = await studentClassService.getListStudentIdOfClass({ classId })
            }
            let data = await userService.searchStudent({ search, listUserIdSkip: listUserIdSkip })

            return res.status(200).json({
                result: true,
                messageEN: "Get information successfully",
                messageVI: "Lấy thông thành công",
                data: data
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

    searchTeacher = async (req, res) => {
        try {
            let { search } = req.query
            let userId = req.userId
            if (!search) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let data = await userService.searchTeacher({ search, userIdSkip: userId })

            return res.status(200).json({
                result: true,
                messageEN: "Get information successfully",
                messageVI: "Lấy thông tin thành công",
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

    getListStudentOfClass = async (req, res) => {
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
            let data = await studentClassService.getListStudentOfClass({ classId })

            return res.status(200).json({
                result: true,
                messageEN: "Get list student successfully",
                messageVI: "Lấy danh sách học sinh thành công",
                data
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

    handleOutClass = async (req, res) => {
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
            let check = await studentClassService.outClassByStudent({ classId, studentId: userId })
            if (!check) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Out of class failed",
                    messageVI: "Rời lớp thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Out of class successfully",
                messageVI: "Rời lớp thành công",
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

    getInforExamByClassId = async (req, res) => {
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
            let data = await examService.getInforExamByExamId({ examId })
            let dataInvigilator
            if (data.typeId === keyMap.examTypeId.EXAM) {
                dataInvigilator = await examInvigilatorService.getInforInvigilatorOfExam({ examId: data.id })
            }
            let checkIsDone = await resultHistoryService.isDone({ examId, studentId: userId })
            if (!data) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Get information failed",
                    messageVI: "Lấy thông tin thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Get information successfully",
                messageVI: "Lấy thông tin thành công",
                data,
                dataInvigilator: dataInvigilator,
                isDone: checkIsDone
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

    saveResultExamOrAssignmentToHistory = async (req, res) => {
        try {
            let { examId, studentId, result, time } = req.body
            let userId = req.userId
            if (!examId || !studentId || !result || !time) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkCreate = await resultHistoryService.saveResult({ examId, studentId, result, time })
            if (!checkCreate) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Save result failed",
                    messageVI: "Lưu kết quả bài làm thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Save result successfully",
                messageVI: "Lưu kết quả bài làm thành công",

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

    saveResultChoiseQuestion = async (req, res) => {
        try {
            let { dataChoise } = req.body
            let userId = req.userId
            if (!dataChoise) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkCreate = await resultExamService.saveListResultChoiseQuestion({ dataChoise })
            if (!checkCreate) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Save result question failed",
                    messageVI: "Lưu kết quả câu hỏi thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Save result question successfully",
                messageVI: "Lưu kết quả câu hỏi thành công",

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

    getListchoiseQuestionOfStudent = async (req, res) => {
        try {
            let { studentId, examId } = req.query
            let userId = req.userId
            if (!studentId || !examId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let data = await resultExamService.getListchoiseQuestionOfStudent({ studentId, examId })

            return res.status(200).json({
                result: true,
                messageEN: "Save result question successfully",
                messageVI: "Lưu kết quả câu hỏi thành công",
                data: data
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

    getMissionOfStudent = async (req, res) => {
        try {
            let { studentId } = req.query
            let userId = req.userId
            if (!studentId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let listClassIdIsDone = await resultHistoryService.getListExamIsDoneOfStudent({ studentId })
            listClassIdIsDone = listClassIdIsDone.map(item => item.examId)
            let listClassId = await studentClassService.getListClassIdByStudentId({ studentId })
            listClassId = listClassId.map(item => item.classId)

            let listExamIsNotDone = await examService.getListExamIsNotDoneByListClassId({ listClassId, listClassIdIsDone })


            return res.status(200).json({
                result: true,
                messageEN: "Get Information successfully",
                messageVI: "Lấy thông tin thành công",
                data: listExamIsNotDone,

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

    postNewNotify = async (req, res) => {
        try {
            let { receiverId, contentEN, contentVI, typeId, params } = req.body
            let userId = req.userId
            if (!receiverId || !contentEN || !contentVI || !typeId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let checkCreate = await notifyService.postNewNotify({ receiverId, senderId: userId, contentEN, contentVI, typeId, params })
            if (!checkCreate) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Post a new notifycation failed",
                    messageVI: "Tạo thông báo thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Post a new notifycation successfully",
                messageVI: "Tạo thông báo thành công",
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

    getListNotify = async (req, res) => {
        try {
            let userId = req.userId
            let data = await notifyService.getListNotify({ receiverId: userId })

            return res.status(200).json({
                result: true,
                messageEN: "Get a new notifycation successfully",
                messageVI: "Lấy thông báo thành công",
                data: data
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
            let userId = req.userId
            if (!search) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let classIsJoined = await studentClassService.getListClassIdIsJoined({ studentId: userId })
            let data = await classService.searchClassByName({ search, classIsJoined })

            return res.status(200).json({
                result: true,
                messageEN: "Get information successfully",
                messageVI: "Lấy thông tin thành công",
                data: data
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    deleteOneNotify = async (req, res) => {
        try {
            let { notifyId } = req.query
            let userId = req.userId
            if (!notifyId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            let checkDelete = await notifyService.deleteOneNotifyByNotifyId({ notifyId })
            if (!checkDelete) {
                return res.status(200).json({
                    result: false,
                    messageEN: "delete the notifycation failed",
                    messageVI: "Xóa thông báo thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "delete the notifycation successfully",
                messageVI: "Xóa thông báo thành công",
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    createNewInvigilator = async (req, res) => {
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

            let checkCreate = await examInvigilatorService.createNewInvigilator({ examId, invigilatorId })

            if (!checkCreate) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Set up an exam proctor failed",
                    messageVI: "Thiết lập giám thị coi thi thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Set up an exam proctor successfully",
                messageVI: "Thiết lập giám thị coi thi thành công",
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    getReviewResultOfStudentInExam = async (req, res) => {
        try {
            let { examId, classId } = req.query
            let userId = req.userId
            if (!examId || !classId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let studentOfClassData = await studentClassService.getListStudentDataOfClass({ classId })
            let dataPoint = await resultHistoryService.getListStudentPointByListExamId({ examId })
            studentOfClassData = studentOfClassData.map(item => {
                let point = -1
                let time
                dataPoint.forEach(eachPoint => {
                    if (eachPoint.studentId === item.id) {
                        point = eachPoint.result
                        time = eachPoint.time
                    }
                })
                return {
                    id: item.id,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    image: item.image,
                    phoneNumber: item.phoneNumber,
                    point: point,
                    time
                }
            })

            return res.status(200).json({
                result: true,
                messageEN: "Get information successfully",
                messageVI: "Lấy thông tin thành công",
                data: studentOfClassData,
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

    createRelationshipAccount = async (req, res) => {
        try {
            let { studentId, parentsId } = req.body
            let userId = req.userId
            if (!studentId || !parentsId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }
            let isCheckStudentExist = await relationshipService.checkStudentExist({ studentId })
            if (isCheckStudentExist) {
                return res.status(200).json({
                    result: false,
                    errCode: true,
                    messageEN: "This account has been linked by another account",
                    messageVI: "Tài khoản này đã được tài khoản khác liên kết",
                })
            }
            let checkCreate = await relationshipService.createNewRelationship({ studentId, parentsId })

            if (!checkCreate) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Set up the relationship failed",
                    messageVI: "Thiết lập quan hệ thất bại",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Set up the relationship successfully",
                messageVI: "Thiết lập quan hệ thành công",
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

    getListDataOfRelationshipAccount = async (req, res) => {
        try {
            // let { studentId, parentsId } = req.query
            let userId = req.userId
            // if (!studentId || !parentsId) {
            //     return res.status(200).json({
            //         result: false,
            //         messageEN: "Invalid information",
            //         messageVI: "Thiếu thông tin chuyền lên"
            //     })
            // }

            let data = await relationshipService.getListDataOfRelationshipAccount({ parentsId: userId })

            return res.status(200).json({
                result: true,
                messageEN: "get data of relationship successfully",
                messageVI: "Lấy dữ liệu quan hệ thành công",
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

    deleteOneRelationshipByRelationshipId = async (req, res) => {
        try {
            let { relationshipId } = req.query
            let userId = req.userId
            if (!relationshipId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            let checkDelete = await relationshipService.deleteOneRelationshipByRelationshipId({ relationshipId })
            if (!checkDelete) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Delete the relationship successfully",
                    messageVI: "Xóa quan hệ thành công",
                })
            }
            return res.status(200).json({
                result: true,
                messageEN: "Delete the relationship successfully",
                messageVI: "Xóa quan hệ thành công",
            })
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: "Có lỗi từ phía server",
                // error: error.message
            })
        }
    }

    getListClasOfStudentByParentsId = async (req, res) => {
        try {
            let { parentsId } = req.query
            let userId = req.userId
            if (!parentsId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            let data = await relationshipService.getListClassOfStudentByParentsId({ parentsId })
            const mergedMap = new Map();
            data.forEach(obj => {
                const key = JSON.stringify({
                    createdAt: obj.createdAt,
                    id: obj.id,
                    parentsId: obj.parentsId,
                    studentId: obj.studentId,
                    updatedAt: obj.updatedAt
                });

                if (!mergedMap.has(key)) {
                    const mergedObject = {};
                    mergedObject.classIdOfStudentData = obj.classIdOfStudentData ? [obj.classIdOfStudentData] : [];
                    mergedObject.createdAt = obj.createdAt;
                    mergedObject.id = obj.id;
                    mergedObject.parentsId = obj.parentsId;
                    mergedObject.studentId = obj.studentId;
                    mergedObject.studentOfParentData = obj.studentOfParentData;
                    mergedObject.updatedAt = obj.updatedAt;
                    mergedMap.set(key, mergedObject);
                } else {
                    const existingObject = mergedMap.get(key);
                    existingObject.classIdOfStudentData.push(obj.classIdOfStudentData);
                    mergedMap.set(key, existingObject);
                }
            });

            // Chuyển đổi Map thành một mảng các đối tượng đã gộp
            const mergedObjectsArray = Array.from(mergedMap.values());

            return res.status(200).json({
                result: true,
                messageEN: "get data  successfully",
                messageVI: "Lấy dữ liệu thành công",
                data: mergedObjectsArray
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

    getListStudentDataOfParents = async (req, res) => {
        try {
            let { parentsId } = req.query
            let userId = req.userId
            if (!parentsId) {
                return res.status(200).json({
                    result: false,
                    messageEN: "Invalid information",
                    messageVI: "Thiếu thông tin chuyền lên"
                })
            }

            let data = await relationshipService.getListDataOfRelationshipAccount({ parentsId })

            return res.status(200).json({
                result: true,
                messageEN: "get data  successfully",
                messageVI: "Lấy dữ liệu thành công",
                data: data
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
}


module.exports = new userController()