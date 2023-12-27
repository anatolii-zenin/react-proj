import { useEffect, useState } from "react"
import { deleteNewsById, retrieveAllNews, retrieveAuthorByNewsId } from "./api/NewsApi"
import PaginationComponent from "./PaginationComponent"
import NewsCardComponent from "./NewsCardComponent"

function NewsListComponent() {

    const [news, setNews] = useState([])
    const [fetchError, setFetchError] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [pageInfo, setPageInfo] = useState("")
    const [currPage, setCurrPage] = useState(1)
    const [newsPerPage, setNewsPerPage] = useState(3)
    const [trigger, setTrigger] = useState(0)

    const fetchAuthor = async(newsId) => {
        var name = await retrieveAuthorByNewsId(newsId)
            .then(
                (response) => {
                    return response.data.name
                }
            )
            .catch((error) => console.log(error))
            .finally(console.log("fetchAuthor done"))
        return name
    }

    const refreshNews = async() => {
        var localNews = await retrieveAllNews(currPage, newsPerPage)
            .then(
                (response) => {
                    setPageInfo(response.data)
                    var promises = response.data.content.map(async (item) => {
                        item.author = await fetchAuthor(item.id)
                        return item
                    })
                    return Promise.all(promises).then((results) => {
                            return results
                        }
                    )
                }
            )
            .catch((error) => console.log(error))
        setNews(localNews)
    }

    const deleteNews = async(id) => {
        await deleteNewsById(id)
            .then()
            .catch((error) => console.log(error))
        setTrigger(trigger + 1)
    }

    useEffect(
        () =>  {
            const fetchEntries = async() => {
                try{
                    await refreshNews()
                } catch (err) {
                    setFetchError(err.message)
                } finally {
                    setIsLoading(false)
                }
            }
            (async () => await fetchEntries())()
            
            
        }, [trigger]
    )

    async function selectPage(pageNum) {
        setCurrPage(pageNum)
        console.log("should set: " + pageNum)
        setTrigger(trigger + 1)
    }

    async function updateSize(size) {
        setNewsPerPage(size)
        setTrigger(trigger + 1)
    }

    if (fetchError)
        console.log(fetchError)

    console.log(pageInfo)

    return (
        <div>
        {isLoading && <p>Loading items...</p>}
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
                                                deleteMethod = {deleteNews}
                                            />
                                        </div>
                                    )
                                )
                            }
                    </div>
                    <PaginationComponent 
                        currPage={pageInfo.number+1} 
                        totalPages={pageInfo.totalPages}
                        selectPageMethod={selectPage}
                        currSize={pageInfo.size}
                        totalElements={pageInfo.totalElements}
                        updateSizeMethod={updateSize}
                    />
                </div>
            }
        </div>
    )
}


export default NewsListComponent