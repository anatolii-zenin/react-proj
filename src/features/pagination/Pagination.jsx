import ReactPaginate from "react-paginate"
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

function PaginationComponent({
        currPage, totalPages, totalElements, 
        currSize, sort, setSearchParams
    }) {

    const handlePageClick = (event) => {
        setSearchParams(prev => {
            prev.set("page", event.selected+1)
            return prev
        }, {replace: true})
        
    };

    const handleSizeChange = (event) => {
        let size = event.value
        setSearchParams(prev => {
            prev.set("pageSize", size)
            return prev
        }, {replace: true})

        let lastPage = Math.ceil(totalElements/size)
        if (currPage > lastPage)
        setSearchParams(prev => {
            prev.set("page", lastPage)
            return prev
        }, {replace: true})
    }

    const handleSortChange = (event) => {
        let sorting = event.value
        switch (sorting) {
            case "Date Created":
                setSearchParams(prev => {
                    prev.set("sortBy", "createDate")
                    prev.set("order", "desc")
                    return prev
                }, {replace: true})
                break
            case "Author Name":
                setSearchParams(prev => {
                    prev.set("sortBy", "authorName")
                    prev.set("order", "asc")
                    return prev
                }, {replace: true})
                break;
            default:
                throw new Error("No such sorting option: " + sorting)
        }
    }

    const sizeOptions = [
        3, 9, 12
    ];

    const sortOptions = [
        "Date Created",
        "Author Name"
    ]

    const currSort = sort === "createDate" ? sortOptions[0] : sortOptions[1]

    return (
        <div className="Pagination">
            <ReactPaginate
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={totalPages}
                previousLabel="<"
                nextLabel=">"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
                forcePage={totalPages > 0? currPage-1 : -1}
            />
            <Dropdown options={sizeOptions} onChange={handleSizeChange} placeholder={currSize}/>
            <Dropdown options={sortOptions} onChange={handleSortChange} placeholder={currSort}/>           
        </div>
    );
}

export default PaginationComponent