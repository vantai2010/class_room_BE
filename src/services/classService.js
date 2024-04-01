const db = require('../models/index')
const argon2 = require('argon2')
const { Op } = require('sequelize');
const handleDeleteImageFile = require("../utils/handleDeleteImageFile")
const keyMap = require('../utils/constant/keyMap')
const moment = require('moment');
const examService = require('./examService');
const documentService = require('./documentService');
const studentClassService = require('./studentClassService');
require('dotenv').config()

class classService {
    //Create name, teacherId, type
    //Update name, teacherId, type, classSelectedId
    isNameClassExists = async ({ name, teacherId, type, classSelectedId }) => {
        try {
            if (type === keyMap.function.CREATE) {
                let checkNameExist = await db.Class.findOne({
                    where: {
                        name: name,
                        teacherId: teacherId
                    }
                })
                return checkNameExist
            } else if (type === keyMap.function.UPDATE) {
                let nameClassSelected = await db.Class.findOne({
                    where: {
                        name: name,
                        teacherId: teacherId,
                        id: {
                            [Op.ne]: classSelectedId
                        }
                    },
                })
                return nameClassSelected
            }
        } catch (error) {
            throw error
        }
    }

    createNewClass = async ({ name, description, image, teacherId, level }) => {
        try {
            let now = moment().format(keyMap.timeType.NO_HOURS)
            let checkCreate = await db.Class.create({
                name: name,
                description: description,
                image: image,
                teacherId: teacherId,
                dateCreate: now,
                level: +level
            })
            return checkCreate
        } catch (error) {
            throw error
        }
    }

    updateInforClass = async ({ classId, name, teacherId, description, image, newImage, level }) => {
        try {
            let imageUpdate
            if (newImage) {
                handleDeleteImageFile([image])
                imageUpdate = newImage
            }
            let dataSelected = await db.Class.findOne({ where: { id: classId } })
            dataSelected.name = name
            dataSelected.description = description
            dataSelected.image = imageUpdate
            dataSelected.level = level
            dataSelected.teacherId = teacherId
            let checkUpdate = await dataSelected.save()
            return checkUpdate
        } catch (error) {
            throw error
        }
    }

    getListClassByTeacherId = async ({ teacherId, search }) => {
        try {
            let options = { teacherId: teacherId }
            if (search) {
                options.name = {
                    [Op.iLike]: `%${search}%`
                }
            }
            let listClass = await db.Class.findAll({
                where: options,
            })
            return listClass
        } catch (error) {
            throw error
        }
    }

    getInforClassByClassId = async ({ classId }) => {
        try {
            let data = await db.Class.findOne({ where: { id: classId } })
            return data
        } catch (error) {
            throw error
        }
    }

    deleteClassByClassId = async ({ classId }) => {
        try {
            let dataSelected = await db.Class.findOne({ where: { id: classId } })
            handleDeleteImageFile([dataSelected.image])
            let data = await db.Class.destroy({ where: { id: classId } })
            let checkDeleteExam = await examService.deleteExamOfClass({ classId })

            let checkDeleteDocumentOfClass = await documentService.deleteDocumentOfClass({ classId })

            let checkDeleteStudentOfClass = await studentClassService.deleteStudentOfClass({ classId })

            return data
        } catch (error) {
            throw error
        }
    }

    searchClassByName = async ({ search, classIsJoined }) => {
        console.log('>>> check dat', search)
        try {
            let options = {}
            if(classIsJoined){
                options.name = {
                    [Op.iLike]: `%${search}%`
                }
                options.id = {
                    [Op.notIn]: classIsJoined
                }
            }else{
                options.name = {
                    [Op.iLike]: `%${search}%`
                }
            }
            let data = await db.Class.findAll({
                where: options,
                include: [
                    {
                        model: db.User,
                        as: "teacherOfClassData",
                        attributes: ["id", "firstName", "lastName", "image", "email"]
                    }
                ]
            })
            return data
        } catch (error) {
            throw error
        }
    }

    getAllClass = async () => {
        try {

            let listClass = await db.Class.findAll({
                include: [
                    {
                        model: db.User,
                        as: "teacherOfClassData",
                        attributes: ["id", "firstName", "lastName", "email"]
                    }
                ]
            })
            return listClass
        } catch (error) {
            throw error
        }
    }
}

module.exports = new classService()