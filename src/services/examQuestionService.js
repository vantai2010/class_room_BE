const db = require('../models/index')
const argon2 = require('argon2')
const { Op } = require('sequelize');
const handleDeleteImageFile = require("../utils/handleDeleteImageFile")
const keyMap = require('../utils/constant/keyMap')
require('dotenv').config()

class examQuestionService {
    getListQuestionOfExamByExamId = async ({ examId }) => {
        try {

            let data = await db.Exam_Question.findAll({
                where: {
                    examId: examId,
                },
                include: [
                    {
                        model: db.Question,
                        as: "examQuestionData"
                    }
                ]
            })
            return data
        } catch (error) {
            throw error
        }
    }

    getListQuestionOfExamForGroup = async ({ examId }) => {
        try {
            let data = await db.Exam_Question.findAll({
                where: {
                    examId: examId,
                },
                include: [
                    {
                        model: db.Question,
                        as: "examQuestionData"
                    }
                ]
            })
            data = data.map(item => item.examQuestionData)
            let dataCustom = { EASY: [], MEDIUM: [], HARD: [] }
            data.forEach(item => {
                dataCustom[item.typeId].push(item)
            })
            return dataCustom
        } catch (error) {
            throw error
        }
    }

    createListQuestionExam = async ({ examId, listQuestionId }) => {
        try {
            let data = listQuestionId.map(item => {
                return {
                    examId: examId,
                    questionId: item
                }
            });
            let checkCreateQuestionExam = await db.Exam_Question.bulkCreate(data)
            return checkCreateQuestionExam

        } catch (error) {
            throw error
        }
    }

    updateListQuestionExam = async ({ examId, listQuestionId }) => {
        try {
            let checkDelete = await db.Exam_Question.destroy({
                where: {
                    examId: examId
                }
            })
            if (!checkDelete) {
                return checkDelete
            }

            let data = listQuestionId.map(item => {
                return {
                    examId: examId,
                    questionId: item
                }
            });

            let checkCreate = await db.Exam_Question.bulkCreate(data)
            return checkCreate
        } catch (error) {
            throw error
        }
    }

    deleteQuestionExamByExamId = async ({ examId }) => {
        try {
            let checkDeleteQuestionExam = await db.Exam_Question.destroy({
                where: {
                    examId: examId
                }
            })
            return checkDeleteQuestionExam
        } catch (error) {
            throw error
        }
    }

}

module.exports = new examQuestionService()