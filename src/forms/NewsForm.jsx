import { useState } from "react"
import { WithContext as ReactTags } from 'react-tag-input'
import Button from 'react-bootstrap/Button';
import { createTag, getTagIdByName } from "../features/api/NewsApi";
import { Alert, Card, Container, Form } from "react-bootstrap";

async function tagNamesToIds(names, jwt) {
    let ids = []
    for (const name of names) {
        try{
            validateInputs(name, 3, "Tag name")
        } catch (err) {
            throw new Error(err.message)
        }
        
        let id = (await getTagIdByName(name)).data?.id
        if (id === undefined || id === null)
            ids.push((await createTag({name, jwt})).data.id)
        else
            ids.push(id)
    }
    return ids
}

function NewsForm({jwt, message, id, currentTitle, currentContent, currentTags, mainMethod, setModal}) {

    const convertedCurrentTags = (currentTags ?? []).map((item) => {return {id: '' + item.id, name: item.name}})

    const [title, setTitle] = useState(currentTitle ?? "")
    const [content, setContent] = useState(currentContent ?? "")
    const [tags, setTags] = useState(convertedCurrentTags)
    const [error, setError] = useState("")

    function handleTitleChange(input) {
        setTitle(input)
    }

    function handleContentChange(input) {
        setContent(input)
    }

    function handleAddition(tag) {
        tags.push({id: tag.name, name: tag.name})
        setTags(tags)
    }

    function handleDeletion (i) {
        setTags(tags.filter((tag, index) => index !== i));
    }

    async function handleConfirm() {
        let tagIds
        try{
            validateInputs(title, 5, "Title")
            validateInputs(content, 5, "Content")
            tagIds = await tagNamesToIds(tags.map(tag => tag.name), jwt)
        } catch (err) {
            setError(err.message)
            return
        }
        let news = {
            id: id,
            authorId: localStorage.getItem("authorId"),
            content: currentContent === content ? null : content,
            title: currentTitle === title ? null : title,
            tagIds: tagIds
        }
        mainMethod(news)
        setModal(false)
    }

    function handleCancel() {
        setModal(false)
    }

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ maxHeight: "100vh", minWidth: "30vw" }}
        >
            <div className="w-100" style={{ maxHeight: "100%", maxWidth: "100%" }}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">{message}</h2>
                        {error != "" && <Alert variant="danger">{error}</Alert>}
                        <Form>
                            <Form.Group id="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" value={title} onChange={(event) => {handleTitleChange(event.target.value)}} />
                            </Form.Group>
                            <Form.Group id="content">
                                <Form.Label>Content</Form.Label>
                                <Form.Control className="mb-3" as="textarea" type="textarea" value={content} onChange={(event) => {handleContentChange(event.target.value)}} />
                            </Form.Group>
                                <div className="mb-3">
                                    <ReactTags
                                        tags={tags}
                                        autocomplete={false}
                                        labelField="name"
                                        handleDelete={handleDeletion}
                                        handleAddition={handleAddition}
                                    />
                                </div>
                            <Button variant="primary" onClick={() => handleConfirm()}>Confirm</Button>
                            <Button variant="primary" onClick={() => handleCancel()}>Cancel</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    )
}

export default NewsForm

function validateInputs(input, length, fieldName) {
    if (input.length < length) 
        throw new Error(fieldName + " should be longer than " + length + " symbols")
}