const db = require('../models/index')
const argon2 = require('argon2')
const { Op } = require('sequelize');
const handleDeleteDocumentFile = require("../utils/handleDeleteDocumentFile")
const keyMap = require('../utils/constant/keyMap')
const moment = require('moment')
require('dotenv').config()

class documentService {
    getListDocumentsClassByClassId = async ({ classId }) => {
        try {

            let documents = await db.Document.findAll({
                where: {
                    classId: classId,
                },
            })
            return documents
        } catch (error) {
            throw error
        }
    }

    postDocuments = async ({ classId, files }) => {
        try {
            let now = moment().format(keyMap.timeType.NO_HOURS)
            let documents
            if (files) {
                let data = files.map(file => {
                    return {
                        file: file.filename,
                        classId: classId,
                        dateUpload: now
                    }
                })
                documents = await db.Document.bulkCreate(data)
            }
            return documents
        } catch (error) {
            throw error
        }
    }

    deleteOneDocumentByDocumentId = async ({ documentId, file }) => {
        try {
            let checkDelete = await db.Document.destroy({
                where: { id: documentId }
            })
            handleDeleteDocumentFile([file])
            return checkDelete
        } catch (error) {
            throw error
        }
    }

    deleteDocumentOfClass = async ({ classId }) => {
        try {
            let dataSelected = await db.Document.findAll({
                where: { classId: classId }
            })
            let arrFiles = dataSelected.map(data => data.file)
            handleDeleteDocumentFile(arrFiles)
            let checkDelete = await db.Document.destroy({
                where: { classId: classId }
            })
            return checkDelete
        } catch (error) {
            throw error
        }
    }
}

module.exports = new documentService()