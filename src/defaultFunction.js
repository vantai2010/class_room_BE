
let registerAccount = async (req, res) => {
    try {
        let { email, password, rePassword } = req.body;

        if (!email || !password || !rePassword) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await appService.registerAccount(req.body)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server ',
            messageVI: "Có lỗi từ phía server "
        })
    }
}



let registerAccounts = () => {
    return new Promise(async (resolve, reject) => {
        try {

        } catch (error) {
            reject(error);
        }
    })
}