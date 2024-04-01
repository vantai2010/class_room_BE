const db = require('../models/index')
const argon2 = require('argon2')
const handleDeleteImageFile = require("../utils/handleDeleteImageFile")
const { Op } = require('sequelize');
const keyMap = require('../utils/constant/keyMap');

require('dotenv').config()

class userService {
    getUserByEmail = async (email) => {
        try {
            const user = await db.User.findOne({ where: { email: email } });
            return user; // Chuyển đổi giá trị thành boolean và trả về
        } catch (error) {
            throw error; // Ném lỗi để xử lý ở nơi gọi hàm này
        }

    }

    getUserByUserId = async (userId) => {
        try {
            const user = await db.User.findOne({ where: { id: userId } });
            return user;
        } catch (error) {
            throw error;
        }

    }

    getPhoneNumber = async (email) => {
        try {
            const userPhoneNumber = await db.User.findOne({ where: { email: email }, attributes: ["phoneNumber"] });
            return userPhoneNumber
        } catch (error) {
            throw error
        }
    }

    checkAccountExist = async ({ email, type, userId }) => {
        try {
            if (type === keyMap.function.CREATE) {
                const user = await db.User.findOne({
                    where: { email: email }
                })
                return user

            } else if (type === keyMap.function.UPDATE) {
                const user = await db.User.findOne({
                    where: {
                        email: email,
                        id: {
                            [Op.ne]: userId

                        }
                    }
                })
                return user
            }
        } catch (error) {
            throw error
        }
    }

    createNewAccount = async ({ email, password, roleId }) => {
        try {
            let passwordHashed = await argon2.hash(password)
            const user = await db.User.create({
                email: email,
                password: passwordHashed,
                roleId: roleId
            })
            return user
        } catch (error) {
            throw error
        }
    }

    UpdateInformation = async ({ email, firstName, password, lastName, image, genderId, phoneNumber }) => {
        try {
            let userSelected = await db.User.findOne({ where: { email: email } })
            if (image) {
                if (userSelected.image) {
                    handleDeleteImageFile([userSelected.image])
                }
            }
            if (password) {
                password = await argon2.hash(password)
            }
            userSelected.firstName = firstName
            userSelected.password = password
            userSelected.lastName = lastName
            userSelected.phoneNumber = phoneNumber
            userSelected.image = image !== undefined ? image : userSelected.image;
            userSelected.genderId = genderId
            let checkUpdate = await userSelected.save()
            return checkUpdate
        } catch (error) {
            throw error
        }
    }

    checkVerifyIdentity = async ({ email, phoneNumber }) => {
        try {
            const userSelected = await db.User.findOne({ where: { email: email, phoneNumber: phoneNumber } });
            return userSelected
        } catch (error) {
            throw error
        }
    }

    changePass = async ({ email, newPassword }) => {
        try {
            const userSelected = await db.User.findOne({ where: { email: email } });
            let passHashed = await argon2.hash(newPassword)
            userSelected.password = passHashed
            let checkUpdate = await userSelected.save()
            return checkUpdate
        } catch (error) {
            throw error
        }
    }

    searchStudent = async ({ search, listUserIdSkip }) => {
        try {
            if (listUserIdSkip) {
                let data = await db.User.findAll({
                    where: {
                        [Op.or]: [
                            { firstName: { [Op.iLike]: `%${search}%` } },
                            { lastName: { [Op.iLike]: `%${search}%` } },
                            { email: { [Op.iLike]: `%${search}%` } }
                        ],
                        roleId: keyMap.roleId.STUDENT,
                        id: {
                            [Op.notIn]: listUserIdSkip
                        }
                    },
                    attributes: ["id", "email", "firstName", "lastName", "image"]
                })
                return data
            } else {

                let data = await db.User.findAll({
                    where: {
                        [Op.or]: [
                            { firstName: { [Op.iLike]: `%${search}%` } },
                            { lastName: { [Op.iLike]: `%${search}%` } },
                            { email: { [Op.iLike]: `%${search}%` } }
                        ],
                        roleId: keyMap.roleId.STUDENT
                    },
                    attributes: ["id", "email", "firstName", "lastName", "image"]
                })
                return data
            }
        } catch (error) {
            throw error
        }
    }

    searchTeacher = async ({ search, userIdSkip }) => {
        try {
            let data = await db.User.findAll({
                where: {
                    [Op.or]: [
                        { firstName: { [Op.iLike]: `%${search}%` } },
                        { lastName: { [Op.iLike]: `%${search}%` } },
                        { email: { [Op.iLike]: `%${search}%` } }
                    ],
                    roleId: keyMap.roleId.TEACHER,
                    id: {
                        [Op.ne]: userIdSkip
                    }
                },
                attributes: ["id", "email", "firstName", "lastName", "image"]
            })
            return data

        } catch (error) {
            throw error
        }
    }

    getAllUsers = async () => {
        try {
            const user = await db.User.findAll({ raw: true });
            delete user.password
            return user;
        } catch (error) {
            throw error;
        }

    }

    deleteUserById = async ({ userId }) => {
        try {
            const checkDelete = await db.User.destroy({ where: { id: userId } });
            return checkDelete;
        } catch (error) {
            throw error;
        }

    }


    createNewUserByAdmin = async ({ email, password, firstName, lastName, roleId, image, genderId, phoneNumber }) => {
        try {

            let userCreate = await this.createNewAccount({ email, password, roleId })
            let update = await this.UpdateInformation({ email, firstName, lastName, image, genderId, phoneNumber })
            return update
        } catch (error) {
            throw error
        }
    }
}

module.exports = new userService()