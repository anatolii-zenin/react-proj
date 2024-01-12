import { useState } from "react"
import { deleteNewsById, editNewsEntry, retrieveAllNews, retrieveAuthorByNewsId, retrieveTagsByNewsId } from "../api/NewsApi"
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query"
import PaginationComponent from "../pagination/Pagination"
import NewsCardComponent from "./NewsCard"
import AddNews from "./AddNews"
import SearchComponent from "../search/Search"
import { useSearchParams } from "react-router-dom"

function mapAuthorsTagsToNews(news, tags) {
    return news.map((item, index) => {
        item.tags = tags[index]
        return item
    })
}

function News() {
    const [filters, setFilters] = useState([])
    const [searchParams, setSearchParams] = useSearchParams(
        {
            page: "1",
            pageSize: "3"
        }
    )
    console.log(searchParams.get("page"))
    const currPage = searchParams.get("page")
    const newsPerPage = searchParams.get("pageSize")
    const sortBy = searchParams.get("sortBy")
    const order = searchParams.get("order")
    const searchString = searchParams.get("searchString") ?? ""

    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

    const queryClient = useQueryClient()

    const { isLoading, data, isError } = useQuery({
        queryKey: ['news', {page: currPage, size: newsPerPage, sortBy: sortBy, order: order, filters: filters}],
        queryFn: () => retrieveAllNews(
            currPage ?? 1, 
            newsPerPage ?? 3,
            sortBy ?? "createDate",
            order ?? "desc",
            filters
            )
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

    if(isLoading || tagQueries.isLoading) {
        return <h2>Loading items...</h2>
    }
    
    if(isError) {
        return <h2>Unable to obtain the data</h2>
    }

    const tags = tagQueries.map(q => q?.data?.data)
    const pageInfo = data.data
    const news = mapAuthorsTagsToNews(pageInfo.content, tags)
    console.log(filters)

    return (
        <div>
            <div>
                <div className="Search-bar-container">
                    <SearchComponent 
                        searchString={searchString}
                        setSearchParams={setSearchParams}
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
                                            author={newsEntry.authorName}
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
                    searchString={searchParams.get("searchString")}
                    setSearchParams={setSearchParams}
                    currSize={pageInfo.size}
                    totalElements={pageInfo.totalElements}
                    sort={searchParams.get("sortBy")}
                />
            </div>
        </div>
    )
}

export default News