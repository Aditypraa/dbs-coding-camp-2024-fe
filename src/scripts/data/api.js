const BASE_URL = "https://books-api.dicoding.dev";
//  TODO : Buat fungsi untuk memanggil API disini
//  getAllBooks,addBook, editBook, deleteBook

async function getAllBooks() {
  return fetch(`${BASE_URL}/list`)
    .then((response) => response.json())
    .then((data) => data.books)
    .catch((error) => console.error("Error:", error));
}

function addBook(book) {
  return fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": "12345",
    },
    body: JSON.stringify(book),
  });
}

function editBook(book) {
  return fetch(`${BASE_URL}/edit/${book.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": "12345",
    },
    body: JSON.stringify(book),
  });
}

function deleteBook(bookId) {
  return fetch(`${BASE_URL}/delete/${bookId}`, {
    method: "DELETE",
    headers: {
      "X-Auth-Token": "12345",
    },
  });
}

export { getAllBooks, addBook, editBook, deleteBook };
