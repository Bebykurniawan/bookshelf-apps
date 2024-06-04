document.addEventListener("DOMContentLoaded", () => {
  const inputBook = document.getElementById("inputBook");
  const inCompleteBookList = document.querySelector("#incompleteBookshelfList");
  const completeBookList = document.querySelector("#completeBookshelfList");
  const bookSubmitSpan = document.querySelector("#bookSubmit > span");
  const inputBookIsComplete = document.getElementById("inputBookIsComplete");
  const modalPopUp = document.getElementById("modalPopUp");
  
  // todo: Modal elements --->
  const deleteModal = document.getElementById("deleteModal");
  const confirmDeleteBtn = document.getElementById("confirmDelete");
  const cancelDeleteBtn = document.getElementById("cancelDelete");

  let currentBookElement = null;

  // todo: Change inner text when user clicks the checkbox button --->
  inputBookIsComplete.addEventListener("change", () => {
    bookSubmitSpan.innerText = inputBookIsComplete.checked ? "Yang sudah selesai dibaca" : "Belum selesai dibaca"
  });

  // todo: Submit Book Form --->
  inputBook.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    // todo: Create book object --->
    const book = {
      id: +new Date(),
      title: title,
      author: author,
      year: parseInt(year),
      isComplete: isComplete,
    };

    // todo: Add book to appropriate list --->
    isComplete ? addCompleteBooks(book) : addInCompleteBooks(book);

    // todo: Clear input fields after submission --->
    inputBook.reset();

    // todo: Show modal popup for feedback --->
    modalPopUp.classList.add("show");
    setTimeout(() => {
      modalPopUp.classList.remove("show");
    }, 3000);

    // todo: Save books to local storage --->
    saveBooks();
  });

  // todo: Add Incomplete Book and  Complete Book --->
  const addInCompleteBooks = (book) => {
    const bookItem = createBookItem(book);
    inCompleteBookList.appendChild(bookItem);
  };

  const addCompleteBooks = (book) => {
    const bookItem = createBookItem(book);
    completeBookList.appendChild(bookItem);
  };

  // todo: Create Book Item --->
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

    // todo: Add event listeners to buttons --->
    bookItem.querySelector(".green").addEventListener("click", () => {
      toggleBookCompletion(id);
    });
    bookItem.querySelector(".red").addEventListener("click", () => {
      currentBookElement = bookItem;
      showModal();
    });

    return bookItem;
  };

  // Toggle book completion status
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

  // Load books from local storage
  const loadBooks = () => {
    const inCompleteBooks =
      JSON.parse(localStorage.getItem("inCompleteBooks")) || [];
    const completeBooks =
      JSON.parse(localStorage.getItem("completeBooks")) || [];

    inCompleteBooks.forEach((book) => addInCompleteBooks(book));
    completeBooks.forEach((book) => addCompleteBooks(book));
  }

  // Extract book data from HTML element
  const extractBookData = (bookElement, isComplete) => {
    const title = bookElement.querySelector("h3").innerText;
    const author = bookElement.querySelector("p:nth-child(2)").innerText.split(": ")[1];
    const year = bookElement.querySelector("p:nth-child(3)").innerText.split(": ")[1];
    const id = parseInt(bookElement.getAttribute("data-id"));
    return { id, title, author, year, isComplete };
  }

  // Function to remove a book
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

  // Show the modal and close modal
  const showModal = () => {
    deleteModal.style.display = "block";
  }

  const closeModal = () => {
    deleteModal.style.display = "none";
  }

  // Event listeners for modal buttons
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
