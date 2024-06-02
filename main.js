document.addEventListener("DOMContentLoaded", function () {
  const inputBook = document.getElementById("inputBook");
  const inCompleteBookList = document.querySelector("#incompleteBookshelfList");
  const completeBookList = document.querySelector("#completeBookshelfList");
  const bookSubmitSpan = document.querySelector("#bookSubmit > span");
  const inputBookIsComplete = document.getElementById("inputBookIsComplete");
  const modalPopUp = document.getElementById("modalPopUp");

  //   <---- Mengubah inner text ketika user mengeklik tombol checkbox ---->
  inputBookIsComplete.addEventListener("change", function () {
    if (inputBookIsComplete.checked) {
      bookSubmitSpan.innerText = "Yang sudah selesai dibaca";
    } else {
      bookSubmitSpan.innerText = "Belum selesai dibaca";
    }
  });

  //   <--- Submit Form Buku --->
  inputBook.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    //   <--- Object buku --->
    const book = {
      id: +new Date(),
      title: title,
      author: author,
      year: parseInt(year),
      isComplete: isComplete,
    };
    isComplete ? addCompleteBooks(book) : addInCompleteBooks(book);

    //   <--- Mengkosongkan input fields setelah user submit --->
    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookIsComplete").checked = false;

    modalPopUp.classList.add('show')
    setTimeout(() => {
      modalPopUp.classList.remove('show')
    }, 3000);
  });

  //   <--- Function Tambah Buku belum dibaca --->
  const addInCompleteBooks = ({ id, title, author, year, isComplete }) => {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.innerHTML = `<h3>${title}</h3>
    <p>Penulis: ${author}</p>
    <p>Tahun: ${year}</p>
    <div class="action">
    <button class="green">Selesai dibaca</button>
    <button class="red">Hapus buku</button>
    </div>`;
    inCompleteBookList.appendChild(bookItem);
  };

  //   <--- Function Tambah Buku yang sudah dibaca --->
  const addCompleteBooks = ({ id, title, author, year, isComplete }) => {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.innerHTML = `<h3>${title}</h3>
    <p>Penulis: ${author}</p>
    <p>Tahun: ${year}</p>
    <div class="action">
    <button class="green">Selesai dibaca</button>
    <button class="red">Hapus buku</button>
    </div>`;
    completeBookList.append(bookItem);
  };
});
