import { useState } from 'react'
import AddBookForm from './components/AddBookForm'
import SearchForm from './components/SearchForm'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AddBookForm />
      <SearchForm />
    </>


      
    
  )
}

export default App
