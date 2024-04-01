const db = require('../models/index')
const argon2 = require('argon2')
const { Op } = require('sequelize');
const handleDeleteImageFile = require("../utils/handleDeleteImageFile")
const keyMap = require('../utils/constant/keyMap')
const moment = require('moment');
const examQuestionService = require('./examQuestionService');
require('dotenv').config()

class resultHistoryService {
    deleteResultExamHistory = async ({ examId }) => {
        try {
            let checkDelete = await db.Result_History.destroy({
                where: { examId: examId }
            })
            return checkDelete
        } catch (error) {
            throw error
        }
    }

    isDone = async ({ examId, studentId }) => {
        try {
            let check = await db.Result_History.findOne({
                where: { examId, studentId }
            })

            return check ? true : false
        } catch (error) {
            throw error
        }
    }

    saveResult = async ({ examId, studentId, result, time }) => {
        try {
            let checkCreate = await db.Result_History.create({
                examId, studentId, result, time
            })
            return checkCreate
        } catch (error) {

        }
    }

    getPointExamByListExamId = async ({ listExamId }) => {
        try {
            let data = await db.Result_History.findAll({
                where: {
                    examId: {
                        [Op.in]: listExamId
                    }
                },
                attributes: ["examId", "result"]
            })
            return data
        } catch (error) {

        }
    }

    getListExamIsDoneOfStudent = async ({ studentId }) => {
        try {
            let data = await db.Result_History.findAll({
                where: {
                    studentId: studentId
                },
                attributes: ["examId"]
            })
            return data
        } catch (error) {

        }
    }

    getListStudentPointByListExamId = async ({ examId }) => {
        try {
            let data = await db.Result_History.findAll({
                where: {
                    examId: examId
                },
            })
            return data
        } catch (error) {

        }
    }
}

module.exports = new resultHistoryService()