import "./components/index.js";
import formValidation from "./form-validation.js";
import Swal, * as Sweetalert2 from "sweetalert2";
import AOS from "aos";
import "../styles/style.css";
import "aos/dist/aos.css";
import { addBook, getAllBooks, deleteBook, editBook } from "./data/api.js";
const formInput = document.getElementById("add-form");

const RENDER_EVENT = "RENDER_EVENT";

function createBookElement(bookItem, index) {
  const bookElement = document.createElement("book-item");
  bookElement.setAttribute("id", bookItem.id);
  bookElement.setAttribute("title", bookItem.title);
  bookElement.setAttribute("author", bookItem.author);
  bookElement.setAttribute("deadline", bookItem.deadline);
  bookElement.setAttribute("borrowing-date", bookItem.borrowing_date);
  bookElement.setAttribute("index", index);
  bookElement.addEventListener("book-delete", (event) => {
    deleteBookHandler(bookItem.id);
  });
  bookElement.addEventListener("book-update", (event) => {
    updateBookHandler(bookItem.id, bookItem.title, bookItem.author);
  });
  return bookElement;
}

document.addEventListener(RENDER_EVENT, async function () {
  const bookList = document.getElementById("book-lists");
  const loadingIndicator = document.createElement("loading-indicator");

  bookList.parentElement.insertBefore(loadingIndicator, bookList);

  // TODO : panggil function getAllBooks
  const BOOKS = await getAllBooks();

  bookList.innerHTML = "";
  let index = 1;
  for (const bookItem of BOOKS) {
    bookList.append(createBookElement(bookItem, index));
    index++;
  }
  loadingIndicator.remove();
});

document.addEventListener("DOMContentLoaded", async () => {
  AOS.init();

  document.dispatchEvent(new Event(RENDER_EVENT));
});

formInput.addEventListener("submit", async (e) => {
  e.preventDefault();

  const loadingOverlay = document.createElement("loading-overlay");
  document.body.appendChild(loadingOverlay);

  const title = formInput.elements.title.value;
  const author = formInput.elements.author.value;

  const newBook = {
    id: +new Date(),
    title,
    author,
  };

  // TODO : panggil function addBook
  try {
    await addBook(newBook);
    setTimeout(() => {
      Sweetalert2.fire({
        title: "Buku berhasil ditambahkan",
        icon: "success",
        confirmButtonText: "OK",
      });
      loadingOverlay.remove();
    }, 1000);
    document.dispatchEvent(new Event(RENDER_EVENT));
    formInput.reset();
  } catch {
    Sweetalert2.fire({
      title: "Buku gagal dihapus",
      icon: "error",
      showConfirmButton: false,
      timer: 3000,
      position: "top-end",
    });
    document.dispatchEvent(new Event(RENDER_EVENT));
    loadingOverlay.remove();
  }
});

async function updateBookHandler(bookId, title, author) {
  await Sweetalert2.fire({
    title: "Edit Buku",
    html: `
      <book-form form-id="edit-form"></book-form>
    `,
    focusConfirm: false,
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: "Batal",

    customClass: {
      htmlContainer: "align-left",
      actions: "edit-actions",
      cancelButton: "cancel-edit-button",
    },
    didRender: () => {
      const formEdit = document.getElementById("edit-form");
      formEdit.elements.title.value = title;
      formEdit.elements.author.value = author;
      formEdit.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = formEdit.elements.title.value;
        const author = formEdit.elements.author.value;
        const loadingOverlay = document.createElement("loading-overlay");
        document.body.appendChild(loadingOverlay);

        const newBook = {
          id: bookId,
          title,
          author,
        };

        // TODO : panggil function editBook
        try {
          await editBook(newBook);

          setTimeout(() => {
            Sweetalert2.fire({
              title: "Buku berhasil diubah",
              icon: "success",
              confirmButtonText: "OK",
            });
            document.dispatchEvent(new Event(RENDER_EVENT));
            loadingOverlay.remove();
          }, 1000);

          formEdit.reset();
        } catch {
          Sweetalert2.fire({
            title: "Buku gagal dihapus",
            icon: "error",
            showConfirmButton: false,
            timer: 3000,
            position: "top-end",
          });
          document.dispatchEvent(new Event(RENDER_EVENT));
          loadingOverlay.remove();
        }
      });
    },
  });
}

function deleteBookHandler(bookId) {
  Sweetalert2.fire({
    title: "Anda Yakin?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
    cancelButtonColor: "#dc3545",
    confirmButtonColor: "#007bff",
  }).then(async (result) => {
    if (result.isConfirmed) {
      // TODO : panggil function deleteBook
      const loadingOverlay = document.createElement("loading-overlay");
      document.body.appendChild(loadingOverlay);

      try {
        await deleteBook(bookId);
        setTimeout(() => {
          Sweetalert2.fire({
            title: "Buku berhasil dihapus",
            icon: "success",
            showConfirmButton: false,
            timer: 3000,
            position: "top-end",
          });
          document.dispatchEvent(new Event(RENDER_EVENT));
          loadingOverlay.remove();
        }, 1000);
      } catch {
        Sweetalert2.fire({
          title: "Buku gagal dihapus",
          icon: "error",
          showConfirmButton: false,
          timer: 3000,
          position: "top-end",
        });
        document.dispatchEvent(new Event(RENDER_EVENT));
        loadingOverlay.remove();
      }
    }
  });
}
