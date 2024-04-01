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

class roomVideoService {
    createNewRoom = async ({ examId, roomId, roomToken }) => {
        try {
            let checkCreate = await db.Room_Video.create({
                examId: examId,
                roomId: roomId,
                roomToken: roomToken
            })
            return checkCreate
        } catch (error) {
            throw error
        }
    }
}

module.exports = new roomVideoService()