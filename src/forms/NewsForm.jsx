import { useState } from "react"
import { WithContext as ReactTags } from 'react-tag-input'
import Button from 'react-bootstrap/Button';
import { createTag, getTagIdByName } from "../features/api/NewsApi";

async function tagNamesToIds(names) {
    let ids = []
    for (const name of names) {
        let id = (await getTagIdByName(name)).data?.id
        if (id === undefined || id === null)
            ids.push((await createTag(name)).data.id)
        else
            ids.push(id)
    }
    console.log(ids)
    return ids
}

function EditNews({message, id, authorId, currentTitle, currentContent, currentTags, mainMethod, setModal}) {

    const convertedCurrentTags = (currentTags ?? []).map((item) => {return {id: '' + item.id, name: item.name}})

    const [title, setTitle] = useState(currentTitle)
    const [content, setContent] = useState(currentContent)
    const [tags, setTags] = useState(convertedCurrentTags)

    function handleTitleChange(input) {
        setTitle(input)
        console.log(input)
    }

    function handleContentChange(input) {
        setContent(input)
        console.log(input)
    }

    function handleAddition(tag) {
        tags.push({id: tag.name, name: tag.name})
        setTags(tags)
    }

    function handleDeletion (i) {
        setTags(tags.filter((tag, index) => index !== i));
    }

    async function handleConfirm() {
        const tagIds = await tagNamesToIds(tags.map(tag => tag.name))
        let news = {
            id: id,
            authorId: authorId,
            content: currentContent === content ? null : content,
            title: currentTitle === title ? null : title,
            tagIds: tagIds
        }
        console.log(news)
        mainMethod(news)
        setModal(false)
    }

    function handleCancel() {
        setModal(false)
    }

    console.log(tags)

    return (
        <div className="NewsAddEdit">
            <div className="NewsForm">
                <h3>{message}</h3>
                <div>
                    <label>Title:</label>
                    <input type="text" name="title" value={title} onChange={(event) => {handleTitleChange(event.target.value)}}/>
                </div>
                <div>
                    <label>Content:</label>
                    <textarea value={content} name="newsContent" onChange={(event) => {handleContentChange(event.target.value)}}/>
                </div>
                <div>
                <ReactTags
                    tags={tags}
                    autocomplete={false}
                    labelField="name"
                    handleDelete={handleDeletion}
                    handleAddition={handleAddition}
                />
                </div>
                <div>
                    <Button variant="primary" onClick={() => handleConfirm()}>Confirm</Button>
                    <Button variant="primary" onClick={() => handleCancel()}>Cancel</Button>
                </div>
            </div>
        </div>
    )
}

export default EditNews