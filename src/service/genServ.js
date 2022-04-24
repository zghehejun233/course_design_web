import axios from "axios";
import { store } from "@/store/createStore.js"
import router from '@/router/index.js'
import { ElMessage } from 'element-plus'

function generalRequest(url, data) {
    return axios.post(
        'http://localhost:9090' + url,
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
        if (res.status != 200) {

            ElMessage({
                type: 'warnning',
                message: '网络错误'
            });
            store.commit('logout')
            router.push('/login')
            return;
        }
        return res.data
    }).catch(() => {
        ElMessage({
            type: 'warnning',
            message: '网络错误'
        });
        store.commit('logout')
        router.push('/login')
        return;
    })
}

function getUimsConfig() {
    return generalRequest('/api/auth/getUimsConfig', null)
}

function getStudentIntroduceData() {
    return generalRequest('/api/teach/getStudentIntroduceData', null)
}


export {
    generalRequest,
    getStudentIntroduceData,
    getUimsConfig
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