import { useState } from "react"
import { deleteNewsById, retrieveAllNews, retrieveAuthorByNewsId } from "./api/NewsApi"
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query"
import NewsCardComponent from "./NewsCardComponent"
import PaginationComponent from "./PaginationComponent"

function mapAuthorsToNews(news, authors) {
    return news.map((item, index) => {
        item.author = authors[index]?.name
        return item
    })
}

function News() {
    const [currPage, setCurrPage] = useState(1)
    const [newsPerPage, setNewsPerPage] = useState(3)
    const queryClient = useQueryClient()

    const { isLoading, data } = useQuery({
        queryKey: ['news', {page: currPage, size: newsPerPage}],
        queryFn: () => retrieveAllNews(currPage, newsPerPage)
    })

    const authorQueries = useQueries({
        queries: (data?.data?.content ?? []).map(item => {
            return {
                queryKey: ["authorByNewsId", item.id],
                queryFn: () => retrieveAuthorByNewsId(item.id)
            }
        })
    })

    const deleteMutation = useMutation({
        mutationFn: deleteNewsById,
        onSuccess: () => {
            queryClient.invalidateQueries(["news"], { exact: true})
        }
    })

    if(isLoading) {
        return <h2>Loading items...</h2>
    }

    const authors = authorQueries.map(q => q?.data?.data)
    const pageInfo = data.data
    const news = mapAuthorsToNews(pageInfo.content, authors)
    // console.log(mapAuthorsToNews(data.data.content, authors))

    return (
        <div>
        <h1>News</h1>
            {!isLoading &&
                <div>
                    <div>
                        Total news: {pageInfo.totalElements}
                    </div>
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
            }
        </div>
    )
}

export default News