import ReactPaginate from "react-paginate"
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { useEffect } from "react";

function PaginationComponent({
        currPage, totalPages, totalElements, 
        currSize, selectPageMethod, updateSizeMethod
    }) {

    const handlePageClick = (event) => {
        selectPageMethod(event.selected+1)
    };

    const handleeSizeChange = (event) => {
        let size = event.value
        updateSizeMethod(size)

        let lastPage = Math.ceil(totalElements/size)
        console.log("last page: " + lastPage)
        if (currPage > lastPage)
            selectPageMethod(lastPage)
    }

    console.log(currSize)

    const options = [
        3, 9, 12
    ];

    useEffect(
        () => {

        }, 
    )
    
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
                forcePage={currPage-1}
            />
            <Dropdown options={options} onChange={handleeSizeChange} placeholder={currSize}/>            
        </div>
    );
}

export default PaginationComponent