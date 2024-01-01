import axios from "axios"

const apiClient = axios.create(
    {
        baseURL: "http://localhost:8080/api"
    }
)

export async function retrieveAllNews(page, size) {
    return apiClient.get(`/news?page=${page}&size=${size}`)
}

export async function retrieveAuthor(id) {
    return apiClient.get(`/authors/${id}`)
}

export async function retrieveAuthorByNewsId(id) {
    return apiClient.get(`/news/${id}/author`)
}

export function retrieveTagsByNewsId(id) {
    return apiClient.get(`/news/${id}/tags`)
}

export function retrieveCommentsByNewsId(id) {
    return apiClient.get(`/news/${id}/comments`)
}

export function deleteNewsById(id) {
    return apiClient.delete(`/news/${id}`)
}