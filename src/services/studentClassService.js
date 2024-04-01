const db = require('../models/index')
const argon2 = require('argon2')
const { Op } = require('sequelize');
const handleDeleteImageFile = require("../utils/handleDeleteImageFile")
const keyMap = require('../utils/constant/keyMap')
require('dotenv').config()

class studentClassService {
    isStudentInClass = async ({ classId, studentId }) => {
        try {
            let check = await db.Student_Class.findOne({
                where: { classId: classId, studentId: studentId }
            })
            return check
        } catch (error) {
            throw error
        }
    }

    getListStudentOfClass = async ({ classId }) => {
        try {
            let student = await db.Student_Class.findAll({
                where: { classId: classId },
                include: [
                    {
                        model: db.User,
                        as: "studentClassData",
                        attributes: ["id", "email", "firstName", "lastName", "image"],
                    },
                    {
                        model: db.Relationship,
                        as: "parentIdOfStudentData",
                        attributes: ["id", "parentsId"],
                        include: [{
                            model: db.User,
                            as: "parentOfStudentData",
                            attributes: ["id", "firstName", "lastName", "email", "phoneNumber", "image"],
                        }]
                    }
                ]
            })
            return student
        } catch (error) {
            throw error
        }
    }

    deleteOneStudentOfClass = async ({ classId, studentId }) => {
        try {
            console.log(classId, studentId)
            let checkDelete = await db.Student_Class.destroy({
                where: { classId: classId, studentId: studentId },
            })
            return checkDelete
        } catch (error) {
            throw error
        }
    }

    addNewStudentToClass = async ({ classId, studentId }) => {
        try {
            let checkCreate = await db.Student_Class.create({
                classId: classId, studentId: studentId
            })
            return checkCreate
        } catch (error) {
            throw error
        }
    }

    getListClassByStudentId = async ({ studentId }) => {
        try {
            let student = await db.Student_Class.findAll({
                where: { studentId: studentId },
                include: [
                    {
                        model: db.Class,
                        as: "classOfStudentData",
                        include: [{
                            model: db.User,
                            as: "teacherOfClassData",
                            attributes: ["id", "image", "firstName", "lastName"]
                        }]
                    }
                ]
            })
            let data = student.map(item => {
                return item.classOfStudentData
            })
            return data
        } catch (error) {
            throw error
        }
    }

    getListClassIdIsJoined = async ({ studentId }) => {
        try {
            let student = await db.Student_Class.findAll({
                where: { studentId: studentId },

            })
            let data = student.map(item => item.classId)
            return data
        } catch (error) {
            throw error
        }
    }

    getListClassIdByStudentId = async ({ studentId }) => {
        try {
            let student = await db.Student_Class.findAll({
                where: { studentId: studentId },
                attributes: ["classId"]
            })

            return student
        } catch (error) {
            throw error
        }
    }

    getListStudentIdOfClass = async ({ classId }) => {
        try {
            let data = await db.Student_Class.findAll({
                where: { classId: classId },
            })
            data = data.map(item => item.studentId)
            return data
        } catch (error) {
            throw error
        }
    }


    getListStudentDataOfClass = async ({ classId }) => {
        try {
            let data = await db.Student_Class.findAll({
                where: { classId: classId },
                include: [
                    {
                        model: db.User,
                        as: "studentClassData",
                        attributes: ["id", "firstName", "lastName", "phoneNumber", "image"]
                    }
                ],
            })
            data = data.map(item => item.studentClassData)
            return data
        } catch (error) {
            throw error
        }
    }

    deleteStudentOfClass = async ({ classId }) => {
        try {
            let checkDelete = await db.Student_Class.destroy({
                where: {
                    classId: classId
                },
            })
            return checkDelete
        } catch (error) {
            throw error
        }
    }

    outClassByStudent = async ({ studentId, classId }) => {
        try {
            let checkDelete = await db.Student_Class.destroy({
                where: {
                    studentId: studentId,
                    classId: classId
                },
            })
            return checkDelete
        } catch (error) {
            throw error
        }
    }
}

module.exports = new studentClassService()