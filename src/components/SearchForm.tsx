function SearchForm() {
  return (
    <div>
      <h3>Look up an existing book</h3>
      <form>
        <label htmlFor="searchTitle">Book Title</label>
        <input id="searchTitle" type="text" placeholder="Eloise" />

        <label htmlFor="searchAuthor">Author</label>
        <input id="searchAuthor" type="text" placeholder="Kay Thompson" />

        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default SearchForm;