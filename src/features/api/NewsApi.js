import axios from "axios"

const apiClient = axios.create(
    {
        baseURL: "http://localhost:8080/api"
    }
)

export function retrieveAllNews(page, size, sortBy, order, filters) {
    return apiClient.post(`/news?page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`, filters)
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
    return apiClient.delete(`/news/${id}`, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }
    )
}

export function editNewsEntry(news) {
    return apiClient.patch(`/news/${news.id}`, news, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }
    )
}

export function getTagIdByName(name) {
    return apiClient.get(`tags/by-name?name=${name}`)
}

export function createTag(name) {
    return apiClient.post(`tags/create`, name,
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }
    )
}

export function createNews(news) {
    return apiClient.post(`news/create`, news,
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }
    )
}

export function filterAuthors(page, size, filters) {
        return apiClient.post(`/authors?page=${page}&size=${size}`, filters,
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }
    )
}