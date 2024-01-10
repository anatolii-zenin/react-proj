import axios from "axios"

const apiClient = axios.create(
    {
        baseURL: "http://localhost:8080/api"
    }
)

export async function retrieveAllNews(page, size, filters) {
    return apiClient.post(`/news?page=${page}&size=${size}`, filters)
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

export function deleteNewsById(id) {
    return apiClient.delete(`/news/${id}`)
}

export function editNewsEntry(news) {
    return apiClient.patch(`/news/${news.id}`, news)
}

export function getTagIdByName(name) {
    return apiClient.get(`tags/by-name?name=${name}`)
}

export function createTag(name) {
    return apiClient.post(`tags/create`, {name: name})
}

export function createNews(news) {
    return apiClient.post(`news/create`, news)
}