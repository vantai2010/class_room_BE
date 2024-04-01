const db = require('../models/index')
const argon2 = require('argon2')
const { Op } = require('sequelize');
const handleDeleteImageFile = require("../utils/handleDeleteImageFile")
const keyMap = require('../utils/constant/keyMap')
const moment = require('moment');
const examQuestionService = require('./examQuestionService');
require('dotenv').config()

class relationshipService {
    checkStudentExist = async ({ studentId }) => {
        try {
            let checkExists = await db.Relationship.findOne({
                where: { studentId }
            })
            return checkExists
        } catch (error) {
            throw error
        }
    }

    getListStudentIdOfParents = async ({ parentsId }) => {
        try {
            let data = await db.Relationship.findAll({
                where: { parentsId }
            })
            data = data.map(item => item.studentId)
            return data
        } catch (error) {
            throw error
        }
    }

    getListClassOfStudentByParentsId = async ({ parentsId }) => {
        try {
            let data = await db.Relationship.findAll({
                where: { parentsId },
                include: [
                    {
                        model: db.Student_Class,
                        as: "classIdOfStudentData",
                        attributes: ["id", "classId"],
                        include: [{
                            model: db.Class,
                            as: "classOfstudentData",
                            include: [
                                {
                                    model: db.User,
                                    as: "teacherOfClassData",
                                    // attributes: ["id", "firs", "last", "emai", "imag", "phon"]
                                }
                            ]
                        }]
                    },
                    {
                        model: db.User,
                        as: "studentOfParentData",
                        attributes: ["id", "firstName", "lastName", "email", "image"]
                    }
                ]
            })
            return data
        } catch (error) {
            throw error
        }
    }

    createNewRelationship = async ({ studentId, parentsId }) => {
        try {
            let checkCreate = await db.Relationship.create(
                { studentId, parentsId }
            )
            return checkCreate
        } catch (error) {
            throw error
        }
    }

    getListDataOfRelationshipAccount = async ({ parentsId }) => {
        try {
            let data = await db.Relationship.findAll({
                where: { parentsId },
                include: [{
                    model: db.User,
                    as: "studentOfParentData",
                    attributes: ["id", "firstName", "lastName", "image", "phoneNumber"]
                }]
            })
            return data
        } catch (error) {
            throw error
        }
    }

    deleteOneRelationshipByRelationshipId = async ({ relationshipId }) => {
        try {
            let checkDelete = await db.Relationship.destroy({
                where: { id: relationshipId }

            })
            return checkDelete
        } catch (error) {
            throw error
        }
    }
}

module.exports = new relationshipService()