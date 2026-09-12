function AddBookForm() {
  return (
    <div>
      <h1>Home Library</h1>
      <h4>Add a new book to your collection</h4>
      <form>
        <label htmlFor="bookTitle">Book Title</label>
        <input type="text" placeholder="Eloise" />

        <label htmlFor="bookAuthor">Author</label>
        <input type="text" placeholder="Kay Thompson" />

        <label htmlFor="language">Language</label>
        <select name="language" id="language">
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="bilingual">Bilingual</option>
        </select>

        <label htmlFor="quantity">Quantity</label>
        <input type="number" />

        <label htmlFor="wishlist">Wishlist</label>
        <input type="checkbox" id="wishlist" />

        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

export default AddBookForm;