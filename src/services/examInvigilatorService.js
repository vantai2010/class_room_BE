const db = require('../models/index')
const argon2 = require('argon2')
const { Op } = require('sequelize');
const handleDeleteImageFile = require("../utils/handleDeleteImageFile")
const keyMap = require('../utils/constant/keyMap');
const examService = require('./examService');
const notifyService = require('./notifyService');
require('dotenv').config()

class examInvigilatorService {
    checkIsExist = async ({ examId, invigilatorId }) => {
        try {
            let data = await db.Exam_Invigilator.findOne({
                where: { examId: examId, invigilatorId: invigilatorId },
            })
            return data
        } catch (error) {
            throw error
        }
    }

    getListInvigilatorIdIdByExamId = async ({ examId }) => {
        try {
            let data = await db.Exam_Invigilator.findAll({
                where: { examId: examId },
                attributes: ["invigilatorId"]
            })
            data = data.map(item => item.invigilatorId)
            return data
        } catch (error) {
            throw error
        }
    }

    getListInvigilatorDataByExamId = async ({ examId }) => {
        try {
            let data = await db.Exam_Invigilator.findOne({
                where: { examId: examId },
                include: [{
                    model: db.User,
                    as: "invigilatorOfExamData",
                    attributes: ["id", "email", "firstName", "lastName", "phoneNumber", "image"]
                }]
            })
            return data
        } catch (error) {
            throw error
        }
    }

    getInforInvigilatorOfExam = async ({ examId }) => {
        try {
            let dataInvigilator = await db.Exam_Invigilator.findOne({
                where: { examId: examId },
                include: [{
                    model: db.User,
                    as: "invigilatorOfExamData",
                    attributes: ["id", "firstName", "lastName", "image", "phoneNumber", "email"]
                }]
            })
            return dataInvigilator
        } catch (error) {
            throw error
        }

    }

    getLigetListExamsOfInvigilatorByInvigilatorId = async ({ invigilatorId }) => {
        try {
            let data = await db.Exam_Invigilator.findAll({
                where: { invigilatorId: invigilatorId },
                include: [{
                    model: db.Exam,
                    as: "examOfInvigilatorData",
                }]
            })
            return data
        } catch (error) {
            throw error
        }
    }

    createNewInvigilator = async ({ examId, invigilatorId }) => {
        try {
            let checkCreate = await db.Exam_Invigilator.create({ examId, invigilatorId })
            let dataExam = await db.Exam.findOne({ where: { examId } })
            if (dataExam) {
                notifyService.postNewNotify({
                    receiverId: invigilatorId,
                    contentEN: `You have been assigned as a proctor for exam ${dataExam.name}`,
                    contentVI: `Bạn đã được chỉ định làm giám thị cho bài thi ${dataExam.name}`,
                    typeId: keyMap.notifyTypeIf.NOTIFY,
                })
            }
            return checkCreate
        } catch (error) {
            throw error
        }
    }

    updateInvigilator = async ({ examId, invigilatorId }) => {
        try {
            let checkCreate
            let checkDel = await db.Exam_Invigilator.destroy({ where: { examId } })
            if (checkDel) {
                checkCreate = await db.Exam_Invigilator.create({ examId, invigilatorId })
                let dataExam = await db.Exam.findOne({ where: { id: examId } })
                if (dataExam) {
                    notifyService.postNewNotify({
                        receiverId: invigilatorId,
                        contentEN: `You have been assigned as a proctor for exam ${dataExam.name}`,
                        contentVI: `Bạn đã được chỉ định làm giám thị cho bài thi ${dataExam.name}`,
                        typeId: keyMap.notifyTypeIf.NOTIFY,
                    })
                }
            }
            return checkCreate
        } catch (error) {
            throw error
        }
    }
}

module.exports = new examInvigilatorService()