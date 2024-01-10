import {FaSearch} from "react-icons/fa"

function SearchComponent({searchString, setSearchString, setFilters}) {

    function handleChange(value) {
        setSearchString(value)
    }

    function submitQuery(event) {
        if (event.key !== "Enter") {
            return
        }
        let [content, tags] = parseSearchString(searchString)
        
        let filters = []
        
        if (content.length > 0) {
            let contentFilter = {
                column: "content",
                value: "%" + content + "%",
                operation: "LIKE"
            }
            filters.push(contentFilter)
        }        

        for (const tag of tags) {
            let filter = {
                column: "name",
                value: tag,
                joinTableName: "tags",
                operation: "JOIN"
            }
            filters.push(filter)
        }
        setFilters(filters)
    }

    return (
        <div className="Input-wrapper">
            <FaSearch id="search-icon" />
            <input 
                className="Search-input"
                type="search"
                placeholder="Search..."
                value={searchString} 
                onChange={event => handleChange(event.target.value)} 
                onKeyDown={event => submitQuery(event)} 
            />
        </div>
    )
}

export default SearchComponent

function parseSearchString(searchStr) {
    let tagsPos = findTags(searchStr)
    console.log(tagsPos)
    let content = tagsPos.length > 0 ? searchStr.substring(0, tagsPos[0]) : searchStr
    content = content.trim()
    let tags = parseTags(searchStr, tagsPos)
    console.log(tags)
    return [content, tags]
}

function findTags(str) {
    var lastMatch;
    var result = [];

    if ((lastMatch = str.indexOf("#")) >= 0) {
        result.push(lastMatch);

        while ((lastMatch = str.indexOf("#", lastMatch + 1)) >= 0) {
            result.push(lastMatch);
        }
    }
    
    return result
}

function parseTags(str, tagsPos) {
    let result = []
    for (const pos of tagsPos) {
        const openingBrace = str.indexOf("(", pos)
        const closingBrace = str.indexOf(")", pos+1)
        result.push(str.substring(openingBrace+1, closingBrace))
    }
    return result
}