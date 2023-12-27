import { useState } from "react"

function EditNews({id, currentTitle, currentContent, currentTags, editMethod}) {

    const [title, setTitle] = useState(currentTitle)
    const [content, setContent] = useState(currentContent)
    const [tags, setTags] = useState(currentTags)

    function handleTitleChange(input) {
        setTitle(input)
        console.log(input)
    }

    function handleContentChange(input) {
        setContent(input)
        console.log(input)
    }

    return (
        <div className="Edit">
            <div className="EditForm">
                <div>
                    <label>Title:</label>
                    <input type="text" name="title" value={title} onChange={(event) => {handleTitleChange(event.target.value)}}/>
                </div>
                <div>
                    <label>Content:</label>
                    <textarea value={content} name="newsContent" onChange={(event) => {handleContentChange(event.target.value)}}/>
                </div>
                <div>
                    Tags:
                </div>
            </div>
        </div>
    )
}

export default EditNews