import { useState } from "react"
import { deleteNewsById, editNewsEntry, retrieveAllNews, retrieveTagsByNewsId } from "../api/NewsApi"
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
    const currPage = searchParams.get("page") ?? 1
    const newsPerPage = searchParams.get("pageSize") ?? 3
    const sortBy = searchParams.get("sortBy") ?? "createDate"
    const order = searchParams.get("order") ?? "desc"
    const searchString = searchParams.get("searchString") ?? ""

    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

    const queryClient = useQueryClient()

    const { isLoading, data, isError } = useQuery({
        queryKey: ['news', {page: currPage, size: newsPerPage, sortBy: sortBy, order: order, filters: filters}],
        queryFn: () => retrieveAllNews(
            currPage, 
            newsPerPage,
            sortBy,
            order,
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
                    sort={sortBy}
                />
            </div>
        </div>
    )
}

export default News