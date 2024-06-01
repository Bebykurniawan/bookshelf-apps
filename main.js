document.addEventListener("DOMContentLoaded", function () {
  const inputBook = document.getElementById("inputBook");
  const inCompleteBookList = document.querySelector("#incompleteBookshelfList > .book_item");
  const completeBookList = document.querySelector("#completeBookshelfList > .book_item");
  const bookSubmitSpan = document.querySelector('#bookSubmit > span')
  const inputBookIsComplete = document.getElementById("inputBookIsComplete");

  
  //   ---> Mengubah inner text ketika user mengeklik tombol checkbox 
  inputBookIsComplete.addEventListener('change', function() {
    if (inputBookIsComplete.checked) {
      bookSubmitSpan.innerText = "Yang sudah selesai dibaca";
    } else {
      bookSubmitSpan.innerText = "Belum selesai dibaca";
    }
  });
  
  //   ---> Submit Form Buku
  inputBook.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    //   ---> Object buku
    const book = {
      id: +new Date(),
      title: title,
      author: author,
      year: parseInt(year),
      isComplete: isComplete,
    };
      isComplete ? addCompleteBooks(book) : addInCompleteBooks(book);
  });
  //   ---> Function Tambah Buku belum dibaca
  const addInCompleteBooks = ({ id, title, author, year, isComplete }) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("book_item");
    bookItem.innerHTML = `<h3>${title}</h3>
    <p>Penulis: ${author}</p>
    <p>TahunL: ${year}</p>`;
    inCompleteBookList.appendChild(bookItem);
  };

  //   ---> Function Tambah Buku yang sudah dibaca
  const addCompleteBooks = ({ id, title, author, year, isComplete }) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("book_item");
    bookItem.innerHTML = `<h3>${title}</h3><p>${author}</p><p>${year}</p>`;
    completeBookList.appendChild(bookItem);
  };
});

// Pr besok : mmebuat 