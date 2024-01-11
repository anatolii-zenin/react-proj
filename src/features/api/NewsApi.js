import axios from "axios"

const apiClient = axios.create(
    {
        baseURL: "http://localhost:8080/api"
    }
)

export function retrieveAllNews(page, size, filters) {
    return apiClient.post(`/news?page=${page}&size=${size}`, filters)
}

export function retrieveAuthor(id) {
    return apiClient.get(`/authors/${id}`)
}

export function retrieveAuthorByNewsId(id) {
    return apiClient.get(`/news/${id}/author`)
}

export function retrieveTagsByNewsId(id) {
    return apiClient.get(`/news/${id}/tags`)
}

export function deleteNewsById(id) {
    return apiClient.delete(`/news/${id}`)
}

export function editNewsEntry(data) {
    return apiClient.patch(`/news/${data.news.id}`, data.news, 
        {
            headers: {
                Authorization: "Bearer " + data.jwt
            }
        }
    )
}

export function getTagIdByName(name) {
    return apiClient.get(`tags/by-name?name=${name}`)
}

export function createTag(data) {
    return apiClient.post(`tags/create`, {name: data.name},
        {
            headers: {
                Authorization: "Bearer " + data.jwt
            }
        }
    )
}

export function createNews( data ) {
    return apiClient.post(`news/create`, data.news,
        {
            headers: {
                Authorization: "Bearer " + data.jwt
            }
        }
    )
}

export function filterAuthors(page, size, filters) {
    return apiClient.post(`/authors?page=${page}&size=${size}`, filters)
}