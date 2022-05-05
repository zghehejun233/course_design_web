import axios from "axios";

function userLoginReq(username, password) {
    return axios.post('http://47.100.74.245/api/auth/login',
    // return axios.post('/api/auth/login',
        {
            username: username,
            password: password
        }).then(res => {
            return res.data.accessToken
        })
}
export {
    userLoginReq
}