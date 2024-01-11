import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import AuthProvider, { useAuth } from "../authentication/AuthContext"
import { useState } from 'react';
import Modal from "../components/Modal"
import NewsForm from '../../forms/NewsForm'
import { WithContext as ReactTags } from 'react-tag-input'

function NewsCardComponent({title, date, author, content, newsId, tags, deleteMethod, editMethod}) {

  const [modal, setModal] = useState(false)
  const [modalContent, setModalContent] = useState("")

  const authContext = useAuth()
  const isAuthenticated = authContext.isAuthenticated
  const isAdmin = authContext.isAdmin

  function editNews(news) {
    editMethod(news)
    setModal(false)
  }

  function toggleDeleteModal() {
    setModalContent(
      <Card>
        <Card.Body>
          <h2>
            Do you want to delete this news?
          </h2>
          <div>
            The action can not be undone
          </div>
          <div>
            <Button variant="primary" onClick={() => deleteNews(newsId)}>Confirm</Button>
            <Button variant="primary" onClick={() => setModal(false)}>Cancel</Button>
          </div>
        </Card.Body>
      </Card>
      )
    setModal(true)
  }

  function toggleEditModal() {
    setModalContent(
      <div>
        <NewsForm id={newsId} 
          message={"Edit News"}
          currentTitle={title} 
          currentContent={content}
          currentTags={tags} 
          setModal={setModal}
          mainMethod={editNews}
          jwt={authContext.jwt}
          authorId={authContext.authorId}
        />
      </div>
      )
    setModal(true)
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
            <Card.Subtitle>{author}</Card.Subtitle>
            <div className="NewsDate">
              {date}
            </div>
            <Card.Text>
              {content}
            </Card.Text>
            <div className="NewsTags">
            <ReactTags
              tags={tags?.map((item) => {return {id: '' + item.id, name: item.name}})}
              autocomplete={false}
              labelField="name"
              readOnly={true}
            />
            </div>
            {
              isAuthenticated && isAdmin && 
              <div>
                <Button variant="primary" onClick={() => toggleDeleteModal()}>Delete</Button> 
                <Button variant="primary" onClick={() => toggleEditModal()}>Edit</Button>
              </div>
            }
          </Card.Body>
        </Card>
      </div>
      <div>
        <Modal isOpen={modal} onClose={() => setModal(false)}>
            <div>
              {modalContent}
            </div>
        </Modal>
      </div>
      
    </div>
  );
}
  
export default NewsCardComponent;