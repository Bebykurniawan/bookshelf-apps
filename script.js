document.addEventListener("DOMContentLoaded", () => {
  const inputBook = document.getElementById("inputBook");
  const inCompleteBookList = document.querySelector("#incompleteBookshelfList");
  const completeBookList = document.querySelector("#completeBookshelfList");
  const bookSubmitSpan = document.querySelector("#bookSubmit > span");
  const inputBookIsComplete = document.getElementById("inputBookIsComplete");
  const modalPopUp = document.getElementById("modalPopUp");
  
  const deleteModal = document.getElementById("deleteModal");
  const confirmDeleteBtn = document.getElementById("confirmDelete");
  const cancelDeleteBtn = document.getElementById("cancelDelete");

  let currentBookElement = null;

  inputBookIsComplete.addEventListener("change", () => {
    bookSubmitSpan.innerText = inputBookIsComplete.checked ? "Yang sudah selesai dibaca" : "Belum selesai dibaca"
  });

  inputBook.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = parseInt(document.getElementById("inputBookYear").value);  // Convert year to integer
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    const book = {
      id: +new Date(),
      title: title,
      author: author,
      year: year,
      isComplete: isComplete,
    };

    isComplete ? addCompleteBooks(book) : addInCompleteBooks(book);

    inputBook.reset();

    modalPopUp.classList.add("show");
    setTimeout(() => {
      modalPopUp.classList.remove("show");
    }, 3000);

    saveBooks();
  });

  const addInCompleteBooks = (book) => {
    const bookItem = createBookItem(book);
    inCompleteBookList.appendChild(bookItem);
  };

  const addCompleteBooks = (book) => {
    const bookItem = createBookItem(book);
    completeBookList.appendChild(bookItem);
  };

  const createBookItem = ({ id, title, author, year, isComplete }) => {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.setAttribute("data-id", id);
    bookItem.innerHTML = `
      <h3>${title}</h3>
      <p>Penulis: ${author}</p>
      <p>Tahun: ${year}</p>
      <div class="action">
        <button class="green">${isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
        <button class="red">Hapus buku</button>
      </div>
    `;

    bookItem.querySelector(".green").addEventListener("click", () => {
      toggleBookCompletion(id);
    });
    bookItem.querySelector(".red").addEventListener("click", () => {
      currentBookElement = bookItem;
      showModal();
    });

    return bookItem;
  };

  const toggleBookCompletion = (id) => {
    const bookElement = document.querySelector(`.book_item[data-id='${id}']`);
    const isComplete = bookElement.querySelector(".green").innerText === "Selesai dibaca";
    const bookData = extractBookData(bookElement, !isComplete);

    removeBookElement(bookElement);

    if (isComplete) {
      bookData.isComplete = true;
      addCompleteBooks(bookData);
    } else {
      bookData.isComplete = false;
      addInCompleteBooks(bookData);
    }

    saveBooks();
  };

  const saveBooks = () => {
    const inCompleteBooks = Array.from(inCompleteBookList.children).map(
      (book) => extractBookData(book, false)
    );
    const completeBooks = Array.from(completeBookList.children).map((book) =>
      extractBookData(book, true)
    );

    localStorage.setItem("inCompleteBooks", JSON.stringify(inCompleteBooks));
    localStorage.setItem("completeBooks", JSON.stringify(completeBooks));
  }

  const loadBooks = () => {
    const inCompleteBooks =
      JSON.parse(localStorage.getItem("inCompleteBooks")) || [];
    const completeBooks =
      JSON.parse(localStorage.getItem("completeBooks")) || [];

    inCompleteBooks.forEach((book) => {
      book.year = parseInt(book.year); 
      addInCompleteBooks(book)
    });
    completeBooks.forEach((book) => {
      book.year = parseInt(book.year); 
      addCompleteBooks(book)
    });
  }

  const extractBookData = (bookElement, isComplete) => {
    const title = bookElement.querySelector("h3").innerText;
    const author = bookElement.querySelector("p:nth-child(2)").innerText.split(": ")[1];
    const year = parseInt(bookElement.querySelector("p:nth-child(3)").innerText.split(": ")[1]); // Convert year to integer
    const id = parseInt(bookElement.getAttribute("data-id"));
    return { id, title, author, year, isComplete };
  }

  const removeBook = () => {
    if (currentBookElement) {
      const id = parseInt(currentBookElement.getAttribute("data-id"));
      removeBookElement(currentBookElement);
      currentBookElement = null;
      saveBooks();
      closeModal();
    }
  }

  const removeBookElement = (bookElement) => {
    bookElement.parentNode.removeChild(bookElement);
  }

  const showModal = () => {
    deleteModal.style.display = "block";
  }

  const closeModal = () => {
    deleteModal.style.display = "none";
  }

  confirmDeleteBtn.addEventListener("click", removeBook);
  cancelDeleteBtn.addEventListener("click", closeModal);

  const searchBookForm = document.getElementById("searchBook");
  const searchBookTitle = document.getElementById("searchBookTitle");

  searchBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchBookTitle.value.toLowerCase();
    filterBooks(query);
  });

  const filterBooks = (query) => {
    const allBooks = [...inCompleteBookList.children, ...completeBookList.children];

    allBooks.forEach(book => {
      const title = book.querySelector("h3").innerText.toLowerCase();
      if (title.includes(query)) {
        book.style.display = "";
      } else {
        book.style.display = "none";
      }
    });
  }

  loadBooks();
});
