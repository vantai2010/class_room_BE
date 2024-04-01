const db = require('../models/index')
const argon2 = require('argon2')
const { Op } = require('sequelize');
const handleDeleteImageFile = require("../utils/handleDeleteImageFile")
const keyMap = require('../utils/constant/keyMap')
require('dotenv').config()

class questionService {
    //Create teacherId, questionPrompt, level, type 
    //Update teacherId, questionPrompt, level, type, questionSelectedId
    isQuestionExists = async ({ teacherId, questionPrompt, level, type, questionSelectedId }) => {
        try {
            let questionFind
            if (type === keyMap.function.CREATE) {
                questionFind = await db.Question.findOne({
                    where: {
                        teacherId: teacherId,
                        questionPrompt: questionPrompt,
                        level: level,
                    }
                })
            } else if (type === keyMap.function.UPDATE) {
                questionFind = await db.Question.findOne({
                    where: {
                        teacherId: teacherId,
                        questionPrompt: questionPrompt,
                        level: level,
                        id: {
                            [Op.ne]: questionSelectedId
                        }
                    }
                })
                console.log(questionFind, "ssssssssssss")
            }
            return questionFind
        } catch (error) {
            throw error
        }
    }

    getQuestions = async ({ typeId, level, search, teacherId }) => {
        try {
            let optionSearch = {
                typeId: typeId,
                level: level,
                teacherId: teacherId
            }
            if (search) {
                optionSearch.questionPrompt = {
                    [Op.iLike]: `%${search}%`
                }
            }
            let listData = await db.Question.findAll({
                where: optionSearch
            })
            return listData
        } catch (error) {
            throw error
        }
    }

    createNewQuestion = async ({ teacherId, questionPrompt, options, answer, typeId, level }) => {
        try {
            let checkCreate = await db.Question.create({
                teacherId: teacherId,
                questionPrompt: questionPrompt,
                options: options,
                answer: answer,
                typeId: typeId,
                level: level
            })
            return checkCreate
        } catch (error) {
            throw error
        }
    }

    updateOneQuestion = async ({ questionSelectedId, teacherId, questionPrompt, options, answer, typeId, level }) => {
        try {
            let questionSelected = await db.Question.findOne({ where: { id: questionSelectedId } })
            questionSelected.teacherId = teacherId
            questionSelected.questionPrompt = questionPrompt
            questionSelected.options = options
            questionSelected.answer = answer
            questionSelected.typeId = typeId
            questionSelected.level = level
            let checkUpdate = await questionSelected.save()
            return checkUpdate
        } catch (error) {
            throw error
        }
    }

    deleteOneQuestionById = async (questionSelectedId) => {
        try {
            let checkDelete = await db.Question.destroy({
                where: { id: questionSelectedId }
            })
            return checkDelete
        } catch (error) {
            throw error
        }
    }
}

module.exports = new questionService()