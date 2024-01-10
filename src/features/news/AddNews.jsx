import { useState } from "react"
import Modal from "../components/Modal"
import { Button } from "react-bootstrap"
import NewsForm from "../../forms/NewsForm"
import { createNews } from "../api/NewsApi"
import { useMutation, useQueryClient } from "@tanstack/react-query"

function AddNews({disabled}) {

    const [modal, setModal] = useState(false)
    const queryClient = useQueryClient()

    const addMutation = useMutation({
        mutationFn: createNews,
        onSuccess: () => {
            queryClient.invalidateQueries(["news"], { exact: true })
        }
    })

    return (
        <>
            <Button variant="primary" onClick={() => setModal(true)} disabled={disabled}>Add news</Button>
            <div>
                <Modal isOpen={modal} onClose={setModal}>
                <NewsForm
                    message={"Add news"}
                    setModal={() => setModal(false)} 
                    mainMethod={addMutation.mutate}
                    authorId={1}
                />
                </Modal>
            </div>
        </>
    )
}

export default AddNews