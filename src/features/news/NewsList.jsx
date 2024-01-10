import { useState } from "react"
import { deleteNewsById, editNewsEntry, retrieveAllNews, retrieveAuthorByNewsId, retrieveTagsByNewsId } from "../api/NewsApi"
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query"
import PaginationComponent from "../pagination/Pagination"
import NewsCardComponent from "./NewsCard"
import AddNews from "./AddNews"
import SearchComponent from "../search/Search"
import { useAuth } from "../authentication/AuthContext"

function mapAuthorsTagsToNews(news, authors, tags) {
    return news.map((item, index) => {
        item.author = authors[index]?.name
        item.tags = tags[index]
        return item
    })
}

function News() {
    const [currPage, setCurrPage] = useState(1)
    const [newsPerPage, setNewsPerPage] = useState(3)
    const [searchString, setSearchString] = useState("")
    const [filters, setFilters] = useState([])

    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated

    const queryClient = useQueryClient()

    const { isLoading, data } = useQuery({
        queryKey: ['news', {page: currPage, size: newsPerPage, filters: filters}],
        queryFn: () => retrieveAllNews(currPage, newsPerPage, filters)
    })

    const authorQueries = useQueries({
        queries: (data?.data?.content ?? []).map(item => {
            return {
                queryKey: ["authorByNewsId", item.id],
                queryFn: () => retrieveAuthorByNewsId(item.id)
            }
        })
    })

    const tagQueries = useQueries({
        queries: (data?.data?.content ?? []).map(item => {
            return {
                queryKey: ["tagsByNewsId", item.id],
                queryFn: () => retrieveTagsByNewsId(item.id)
            }
        })
    })

    const deleteMutation = useMutation({
        mutationFn: deleteNewsById,
        onSuccess: () => {
            queryClient.invalidateQueries(["news"], { exact: true })
        }
    })

    const editMutation = useMutation({
        mutationFn: editNewsEntry,
        onSuccess: () => {
            queryClient.invalidateQueries(["news"], { exact: true })
        }
    })

    if(isLoading || tagQueries.isLoading || authorQueries.isLoading) {
        return <h2>Loading items...</h2>
    }

    const authors = authorQueries.map(q => q?.data?.data)
    const tags = tagQueries.map(q => q?.data?.data)
    const pageInfo = data.data
    const news = mapAuthorsTagsToNews(pageInfo.content, authors, tags)
    console.log(filters)

    return (
        <div>
            <div>
                <div className="Search-bar-container">
                    <SearchComponent 
                        searchString={searchString}
                        setSearchString={setSearchString}
                        setFilters={setFilters}
                    />
                </div>
                <div className="Total-news">
                    Total news: {isLoading ? "Loading..." : pageInfo.totalElements}
                </div>
                {isAuthenticated && 
                    <div className="Add-news">
                        <AddNews />
                    </div>
                }
                    <div className="NewsContainer">
                        {
                            news.map(
                                newsEntry => (
                                    <div key={newsEntry.id} className="NewsColumn">
                                        <NewsCardComponent  
                                            newsId={newsEntry.id}
                                            date={newsEntry.createDate}
                                            author={newsEntry.author}
                                            title={newsEntry.title}
                                            content={newsEntry.content}
                                            tags={newsEntry.tags}
                                            deleteMethod = {deleteMutation.mutate}
                                            editMethod = {editMutation.mutate}
                                        />
                                    </div>
                                )
                            )
                        }
                </div>
                <PaginationComponent 
                    currPage={pageInfo.number+1} 
                    totalPages={pageInfo.totalPages}
                    selectPageMethod={setCurrPage}
                    currSize={pageInfo.size}
                    totalElements={pageInfo.totalElements}
                    updateSizeMethod={setNewsPerPage}
                />
            </div>
            
        </div>
    )
}

export default News