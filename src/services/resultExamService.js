const db = require('../models/index')
const argon2 = require('argon2')
const { Op } = require('sequelize');
const handleDeleteImageFile = require("../utils/handleDeleteImageFile")
const keyMap = require('../utils/constant/keyMap')
const moment = require('moment');
const examQuestionService = require('./examQuestionService');
require('dotenv').config()

class resultExamService {
    deleteResultOfExam = async ({ examId }) => {
        try {
            let checkDelete = await db.Result_Exam.destroy({
                where: { examId: examId }
            })
            return checkDelete
        } catch (error) {
            throw error
        }
    }

    saveListResultChoiseQuestion = async ({ dataChoise }) => {
        try {
            let checkCreate = await db.Result_Exam.bulkCreate(dataChoise)
            return checkCreate
        } catch (error) {
            throw error
        }
    }

    getListchoiseQuestionOfStudent = async ({ studentId, examId }) => {
        try {
            let data = await db.Result_Exam.findAll({
                where: { studentId, examId },
                include: [{
                    model: db.Question,
                    as: "questionOfResultExamData",
                }]
            })
            return data
        } catch (error) {
            throw error
        }
    }
}

module.exports = new resultExamService()