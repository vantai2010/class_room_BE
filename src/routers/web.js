const express = require('express')
const router = express.Router()
const teacherController = require('../controllers/teacherController')
const systemController = require('../controllers/systemController')
const verifyToken = require('../middleware/auth')
const checkAdmin = require('../middleware/checkAdmin')
const checkTeacher = require('../middleware/checkTeacher')
const adminController = require('../controllers/adminController')
const uploadImage = require("../middleware/handleSaveImage")
const uploadDocument = require("../middleware/handleSaveDocuments")
const userController = require('../controllers/userController')

router.post("/login", systemController.handleLogin)
router.post("/login-with-token", verifyToken, systemController.handleLoginWithToken)
router.post("/register", systemController.handleRegisterAccount)
router.post("/register-information", uploadImage.single("image"), systemController.handleRegisterAccountInformation)
router.post("/send-email-forgot-password", systemController.handleSendEmailForgotPass)
router.put("/change-password", systemController.handleChangePass)
router.get("/dowload-file", systemController.dowloadFile)

router.post("/send-email", systemController.sendEmail)

// router.post("/post-new-notify", systemController.postNewNotify)


router.get("/get-list-classes-by-teacher", checkTeacher, teacherController.getListClassByTeacher)
router.post("/create-new-class-by-teacher", checkTeacher, uploadImage.single("image"), teacherController.createNewClassByTeacher)
router.post("/create-new-question-by-teacher", checkTeacher, teacherController.createNewQuestionByTeacher)
router.put("/update-question-by-teacher", checkTeacher, teacherController.updateQuestionByTeacher)
router.delete("/delete-question-by-teacher", checkTeacher, teacherController.deleteQuestionByTeacher)
router.get("/get-questions-by-teacher", checkTeacher, teacherController.getQuestionByTeacher)

router.post("/create-new-exam-by-teacher", checkTeacher, teacherController.createNewExamByTeacher)
router.put("/update-one-exam-by-teacher", checkTeacher, teacherController.updateOneExamByTeacher)
router.put("/update-one-exam-invigilator-by-teacher", checkTeacher, teacherController.updateOneExamInvigilatorByTeacher)
router.delete("/delete-one-exam-by-teacher", checkTeacher, teacherController.deleteOneExamByTeacher)

router.post("/post-new-documents-by-teacher", checkTeacher, uploadDocument.array("files"), teacherController.postNewDocumentsByTeacher)
router.delete("/delete-one-documents-by-documentId", checkTeacher, teacherController.deleteOneDocumentByDocumentId)
//
router.post("/add-new-student-to-class-by-teacher", verifyToken, teacherController.addNewStudentToClass)

router.delete("/delete-student-of-class-by-teacher", checkTeacher, teacherController.deleteStudentOfClass)

router.get("/get-infor-of-class-by-teacher", checkTeacher, teacherController.getInforClassByClassId)
router.get("/get-list-exam-of-invigilator-by-teacher", checkTeacher, teacherController.getListExamsOfInvigilatorByTeacherId)
router.delete("/delete-class-by-teacher", checkTeacher, teacherController.deleteClassByClassId)
router.put("/update-infor-of-class-by-teacher", checkTeacher, uploadImage.single("newImage"), teacherController.updateInforClassByClassId)


router.put("/open-exam-by-teacher", checkTeacher, teacherController.openExamByTeacher)

//-----------------------------------------------------------------
router.post("/create-room-video-by-teacher", checkTeacher, teacherController.createRoomVideoByTeacher)


//

router.get("/get-list-assignments-of-class", verifyToken, userController.getListAssignmentsOfClassByClassId)
router.get("/get-content-assignment-of-class-by-id", verifyToken, userController.getContentAssignmentOfClassById)
router.get("/get-list-question-of-exam-by-examId", verifyToken, userController.getListQuestionsOfExamByExamId)
router.get("/get-list-exams-of-class", verifyToken, userController.getListExamsOfClassByClassId)
router.get("/get-list-documents-of-class", verifyToken, userController.getListDocumentsOfClassByClassId)
router.get("/get-list-questions-of-exam", verifyToken, userController.getListQuestionsOfExamByExamId)


//
router.get("/search-user-by-name-or-email", verifyToken, userController.searchStudent)
router.get("/search-teacher-by-name-or-email", verifyToken, userController.searchTeacher)
router.get("/search-class-by-name", verifyToken, userController.searchClassByName)


router.get("/get-list-class", verifyToken, userController.getListClass)
router.get("/get-infor-class", verifyToken, userController.getInforClassByClassId)
router.get("/get-infor-exam", verifyToken, userController.getInforExamByClassId)
router.delete("/out-class", verifyToken, userController.handleOutClass)
router.get("/get-assignment-class", verifyToken, userController.getAssignmentClass)
router.get("/get-list-student-of-class", verifyToken, userController.getListStudentOfClass)


router.get("/get-list-choise-question-of-student", verifyToken, userController.getListchoiseQuestionOfStudent)
router.post("/save-result-exam-or-assignment-to-history", verifyToken, userController.saveResultExamOrAssignmentToHistory)
router.post("/save-result-choise-question", verifyToken, userController.saveResultChoiseQuestion)
router.get("/get-mission-of-student", verifyToken, userController.getMissionOfStudent)

router.post("/post-new-notify", verifyToken, userController.postNewNotify)
router.get("/get-list-notify", verifyToken, userController.getListNotify)
router.delete("/delete-one-notify", verifyToken, userController.deleteOneNotify)


router.post("/create-new-invigilator", verifyToken, userController.createNewInvigilator)

router.get("/get-review-result-of-student-in-exam", verifyToken, userController.getReviewResultOfStudentInExam)
router.post("/create-relationship-account", verifyToken, userController.createRelationshipAccount)
router.get("/get-list-data-relationship-account", verifyToken, userController.getListDataOfRelationshipAccount)
router.get("/get-list-student-data-of-parents", verifyToken, userController.getListStudentDataOfParents)
router.delete("/delete-one-relationship-by-relationshipId", verifyToken, userController.deleteOneRelationshipByRelationshipId)


router.get("/get-list-class-of-student-by-parentsId", verifyToken, userController.getListClasOfStudentByParentsId)

router.get("/get-all-users", checkAdmin, adminController.getAllUsers)
router.delete("/delete-user-by-id", checkAdmin, adminController.deleteUserById)
router.post("/post-new-user-by-admin", checkAdmin, uploadImage.single("image"), adminController.createNewUserByAdmin)
router.put("/update-one-user-by-admin", checkAdmin, uploadImage.single("image"), adminController.updateOneUserByAdmin)

router.get("/get-all-class", checkAdmin, adminController.getAllClass)
router.post("/create-new-class", checkAdmin, uploadImage.single("image"), adminController.createNewClass)
router.put("/create-new-class", checkAdmin, uploadImage.single("newImage"), adminController.updateClass)
router.delete("/delete-one-class", checkAdmin, adminController.deleteOneClass)

router.get("/get-all-question", checkAdmin, adminController.getAllQuestion)
router.post("/create-one-question", checkAdmin, adminController.createOneQuestion)
router.put("/update-one-question", checkAdmin, adminController.updateOneQuestion)
router.delete("/delete-one-question", checkAdmin, adminController.deleteOneQuestion)

router.get("/get-all-exam", checkAdmin, adminController.getServiceAllExam)
router.get("/search-class-by-name", checkAdmin, adminController.searchClassByName)
router.get("/get-question-tearcher", checkAdmin, adminController.getQuestionsTeacher)

module.exports = router