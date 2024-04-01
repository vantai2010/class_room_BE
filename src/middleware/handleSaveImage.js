const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: 'public/Images',
    filename: (req, file, cb) => {

        // Sử dụng UUID để tạo tên tệp duy nhất
        cb(null, file.originalname.split(".")[0] + "_" + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

module.exports = upload