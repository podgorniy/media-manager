export async function logout() {
    const logoutRespObj = await fetch('/api/v1/logout', {
        method: 'POST'
    })
    const logoutRes = await logoutRespObj.json()
    return logoutRes.success
}

export async function authenticate({userName, password}): Promise<{ userName?: string, success: boolean }> {
    const loginRequestObj = await fetch('/api/v1/login', {
        method: 'POST',
        // https://stackoverflow.com/a/29823632
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: userName,
            password
        })
    })
    const loginRes = await loginRequestObj.json()
    if (loginRes.success) {
        return {
            success: true,
            userName: loginRes.userName
        }
    } else {
        return {
            success: false
        }
    }
}
