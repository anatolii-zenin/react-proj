import axios from "axios"

const apiClient = axios.create(
    {
        baseURL: "http://localhost:8080/"
    }
)

export async function signUp(username, password) {
    return apiClient.post("/api/signup", {username: username, password: password})
}

export async function getJWT(username, password) {
    return apiClient.post("/authenticate", {},
    {
        auth : {
            username: username,
            password: password
        }
    })
}