import axios from "axios";
import { store } from "@/store/createStore.js"
import { ElMessage } from 'element-plus'

function generalRequest(url, data) {
    return axios.post(
        'http://47.100.74.245' + url,
        // url,
        {
            data: data
        },
        {
            headers: {
                Authorization: 'Bearer ' + store.state.jwtToken
            }
        }
    ).then(res => {
        if (res.status == 500) {

            ElMessage({
                type: 'warnning',
                message: '后端报错'
            });
            return;
        }
        if (res.status == 404) {
            ElMessage({
                type: 'warnning',
                message: '后端方法不存在'
            });
            return;
        }
        return res.data
    }).catch(() => {
        return;
    })
}

function getUimsConfig() {
    return generalRequest('/api/auth/getUimsConfig', null)
}

function getStudentIntroduceData(data) {
    return generalRequest('/api/teach/getStudentIntroduceData', data)
}

function getPdf(data) {
    return generalRequest('/api/teach/getStudentIntroducePdf', data)
        .then(async response => {
            const blob = await response.blob()
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = response.status;
                return Promise.reject(error)
            }
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = "个人简历"
            link.click()
            URL.revokeObjectURL(link.href)
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}
export {
    generalRequest,
    getStudentIntroduceData,
    getUimsConfig,
    getPdf,
}



export function downloadPost(url, label, data) {

    const requestOptions = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + store.state.jwtToken
        },
        body: JSON.stringify({
            data: data
        })
    };
    return fetch(url, requestOptions)
        .then(async response => {
            const blob = await response.blob()
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = response.status;
                return Promise.reject(error)
            }
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = label
            link.click()
            URL.revokeObjectURL(link.href)
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
}