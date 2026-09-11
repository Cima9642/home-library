import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
    <div>
      <h3> Home Library</h3>
      <p>Add a new book to your collection</p>
      <form>
        <label htmlFor="bookTitle">Book Title</label>
        <input type="text" placeholder='Book Title' />
        <label htmlFor="bookAuthor">Author</label>
        <input type="text" placeholder='Author' />
        <label htmlFor="bookGenre">Language</label>
        <select name="language" id="language">
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="french">Bilingual</option>
        </select>
      </form>



    </div>
      
    </>
  )
}

export default App
