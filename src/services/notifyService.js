const db = require('../models/index')
const argon2 = require('argon2')
const handleDeleteImageFile = require("../utils/handleDeleteImageFile")
const { Op } = require('sequelize');
const keyMap = require('../utils/constant/keyMap');
const moment = require('moment');

require('dotenv').config()

class notifyService {
    postNewNotify = async ({ receiverId, senderId, contentVI, contentEN, typeId, params }) => {
        try {
            let checkCreate = await db.Notify.create({
                receiverId, senderId, contentVI, contentEN, params, typeId, time: moment().format(keyMap.timeType.HAVE_HOURS)
            })
            return checkCreate
        } catch (error) {
            throw error
        }
    }

    getListNotify = async ({ receiverId }) => {
        try {
            let data = await db.Notify.findAll({
                where: { receiverId },
                include: [
                    {
                        model: db.User,
                        as: "inforReceiverData",
                        attributes: ["id", "firstName", "lastName", "image"]
                    },
                    {
                        model: db.User,
                        as: "inforSenderData",
                        attributes: ["id", "firstName", "lastName", "image"]
                    }
                ]
            })
            return data
        } catch (error) {
            throw error
        }
    }

    deleteOneNotifyByNotifyId = async ({ notifyId }) => {
        try {
            let checkDelete = await db.Notify.destroy({
                where: { id: notifyId },

            })
            return checkDelete
        } catch (error) {
            throw error
        }
    }
}

module.exports = new notifyService()