// window.addEventListener("load", () => {});

// ======== selesai window 'load' ========

const book = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "save-book"
const BOOK_KEY = "BOOK_APPS"

const input_title = document.querySelector("#new-title-input");
const input_date = document.querySelector("#new-date-input"); // sendiri
const input_author = document.querySelector("#new-author-input"); // sendiri
const list_el = document.querySelector("#reading"); // modifikasi
const listing_el = document.querySelector("#done-read");

const book_title = input_title.value;
const book_date = input_date.value; // sendiri
const book_author = input_author.value; // sendiri

function generateId() {
    return +new Date();
  }


function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year, 
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of book) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in book) {
    if (book[index].id === bookId) {
      return index;
    }
  }
  return -1
}

function isStorageExist() {
  if (type Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false
  }
  return true;
}

function makeBook(bookObject) {

  const {id, title, author, year, isCompleted} = bookObject;

  // ========  buat task
  const task_el = document.createElement("div");
  task_el.classList.add("task");
  task_el.setAttribute("id", `book-${id}`);
  // ========  buat task
  const task_content_el = document.createElement("div");
  task_content_el.classList.add("content");

  task_el.appendChild(task_content_el);

  const task_input_el = document.createElement("input");
  task_input_el.classList.add("text");
  task_input_el.type = "text";
  task_input_el.value = `Judul buku : ${book_title}`;
  task_input_el.setAttribute("readonly", "readonly");

  task_content_el.appendChild(task_input_el);
  // =====  buat tanggal   |  sendiri
  // const p_text = document.createElement("p");
  // p_text.classList.add("text");
  // p_text.innerHTML = `Tahun terbit : ${book_date}`;
  // task_content_el.appendChild(p_text);
 
  const book_author_el = document.createElement("input");
  book_author_el.classList.add("text");
  book_author_el.type = "text";
  book_author_el.value = `Penulis : ${book_author}`;
  book_author_el.setAttribute("readonly", "readonly");

  task_content_el.appendChild(book_author_el);

  const book_date_el = document.createElement("input");
  book_date_el.classList.add("text");
  book_date_el.classList.add("date-color");
  book_date_el.type = "date";
  book_date_el.name = book_title;
  book_date_el.min = "0001-01-01";
  book_date_el.max = "9999-12-31";
  book_date_el.value = book_date;
  book_date_el.setAttribute("readonly", "readonly");

  task_content_el.appendChild(book_date_el);
  // ===== selesai sendiri

  const task_actions_el = document.createElement("div");
  task_actions_el.classList.add("actions");

  const task_edit_el = document.createElement("button");
  task_edit_el.classList.add("edit");
  task_edit_el.innerHTML = "Edit";

  const task_done_el = document.createElement("button");
  task_done_el.classList.add("done");
  task_done_el.innerHTML = "Selesai";

  task_actions_el.appendChild(task_edit_el);
  task_actions_el.appendChild(task_done_el);

  task_el.appendChild(task_actions_el);

  list_el.appendChild(task_el);

  if (isCompleted) {
    console.log('isCompleted true')
  } else {
    console.log('isCompleted false cuy')
  }

  // ===== bisa mengubah edit dan delete
  input_title.value = "";
  input_date.value = "";
  input_author.value = "";

  task_edit_el.addEventListener("click", () => {
    if (task_edit_el.innerText.toLowerCase() == "edit") {
      task_input_el.removeAttribute("readonly");
      book_date_el.removeAttribute("readonly");
      book_author_el.removeAttribute("readonly");
      task_input_el.focus();
      task_edit_el.innerText = "Simpan";
    } else {
      task_input_el.setAttribute("readonly", "readonly");
      book_date_el.setAttribute("readonly", "readonly");
      book_author_el.setAttribute("readonly", "readonly");
      task_edit_el.innerText = "Edit";
    }
  });

  task_done_el.addEventListener("click", () => {
    list_el.removeChild(task_el);
  });

  return task_el;
}

function addBook () {
  const generateID = generateId();
  const bookObject = generateBookObject(generateID, book_title, book_author, book_date, false);
  book.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(book);
    localStorage.setItem(BOOK_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function addBookToCompleted (bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted (bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  book.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted (bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}


document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector("#new-book-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();

    if (!book_title) {
    // modifikasi
    alert("Silahkan tambah JUDUL buku yang sedang dibaca");
    return;
    } else if (!book_author) {
      alert("Silahkan tambah PENULIS buku yang sedang dibaca");
      return;
    } else if (!book_date){
      alert("Silahkan tambah TAHUN TERBIT buku yang sedang dibaca");
      return;
    }
    
  });
})

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data telah disimpan.")
})


document.addEventListener(RENDER_EVENT, function () {
  const  uncompleteReadList = list_el;
  const completedList = listing_el;

  // clearing
  uncompleteReadList.innerHTML = "";
  completedList.innerHTML = "";

  for (const bookItem of book) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      completedList.append(bookElement);
    } else {
      uncompleteReadList.append(bookElement);
    }
  }
})


// sendiri
    // const localStorageKey = "List_Todo";

    // if (typeof Storage !== "undefined") {
    //   if (localStorage.getItem(localStorageKey) == null) {
    //     localStorage.setItem(localStorageKey, book_title);
    //   }
    // }
    
  // if (isStorageExist()) {
  //   loadDataFromStorage();
  // }




// function dateLocal () {
//   let tw = new Date();
//   if (tw.getTimezoneOffset() == 0) (a=tw.getTime() + ( 7 *60*60*1000)
//   ) else (a=tw.getTime());
//   tw.setTime(a);

//   let tahun = tw.getFullYear ();
//   let hari = tw.getDay ();
//   let bulan = tw.getMonth ();
//   let tanggal = tw.getDate ();
//   let hariarray = new Array("Minggu,","Senin,","Selasa,","Rabu,","Kamis,","Jum'at,","Sabtu,");
//   let bulanarray = new Array(
//                           "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober",
//                           "Nopember","Desember"
//                           );

//   document.getElementById("tanggalwaktu").innerHTML =
//                                                       tanggal         + " " +
//                                                       bulanarray[bulan] + " " +
//                                                       tahun ;
// }

