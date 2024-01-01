import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useAuth } from "./security/AuthContext"
import { useState } from 'react';
import Modal from "./ModalComponent"
import EditNews from './EditNewsComponent';

function NewsCardComponent({title, date, author, content, newsId, deleteMethod}) {

  const [modal, setModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalContent, setModalContent] = useState("")
  const [modalConfirmAction, setModalConfirmAction] = useState(null)

  const authContext = useAuth()
  const isAuthenticated = authContext.isAuthenticated

  function toggleDeleteModal() {
    setModalTitle("Do you want to delete this news?")
    setModalContent("The action can not be undone")
    setModal(true)
    setModalConfirmAction(() => deleteNews)
  }

  function toggleEditModal() {
    setModalTitle("Edit news")
    setModalContent(<EditNews currentTitle={title} currentContent={content} />)
    setModal(true)
    console.log("modal trig")
  }

  function deleteNews() {
    setModal(false)
    deleteMethod(newsId)
  }

  return (
    <div>
      <div>
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            <div className="NewsDate">
              Published: {date}
            </div>
            <Card.Text>
              {content}
            </Card.Text>
            <div className="NewsAuthor">
              Author: {author}
            </div>
            <div className="NewsTags">
              tags:
            </div>
            {
              isAuthenticated && 
              <div>
                <Button variant="primary" onClick={() => toggleDeleteModal()}>Delete</Button> 
                <Button variant="primary" onClick={() => toggleEditModal()}>Edit</Button>
              </div>
            }
          </Card.Body>
        </Card>
      </div>
      <div>
        <Modal isOpen={modal} onClose={setModal}>
            <div>
              <h3>{modalTitle}</h3>
              {modalContent}
            </div>
            <div>
              <Button variant="primary" onClick={() => modalConfirmAction(newsId)}>Confirm</Button>
              <Button variant="primary" onClick={() => setModal(false)}>Cancel</Button>
            </div>
        </Modal>
      </div>
      
    </div>
  );
}
  
export default NewsCardComponent;