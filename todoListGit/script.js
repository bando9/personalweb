const book = [];
const RENDER_EVENT = 'render-book'
const SAVED_EVENT = 'saved-book'
const STORAGE_KEY = 'BOOK_APPS'



document.addEventListener('DOMContentLoaded', function() {
	const submitForm = document.getElementById('new-book-form');

	submitForm.addEventListener('submit', function(event) {
		event.preventDefault();
		addBook();
	}); 

  if(isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const bookTitle = document.getElementById('new-title-input').value;
  const bookAuthor = document.getElementById('new-author-input').value;
  const bookYear = document.getElementById('new-year-input').value;

	const generateID = generateId();
	const bookObject = generateBookObject(generateID, bookTitle, bookAuthor, bookYear, false);
	book.push(bookObject);

	document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
	return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
	return {
		id, 
		title, 
		author, 
		year, 
		isCompleted
	}
}

document.addEventListener(RENDER_EVENT, function() {

  const readingBookList = document.getElementById('reading')
  readingBookList.innerHTML = '';

  const doneReadingList = document.getElementById('done-read')
  doneReadingList.innerHTML = '';

  for (const bookItem of book) {
    const bookElement = makeBook(bookItem)

    if(!bookItem.isCompleted) {
      readingBookList.append(bookElement)
    } else {
      doneReadingList.append(bookElement)
    }
  }
})


function makeBook(bookObject) {

  const taskEl = document.createElement('div')
  taskEl.classList.add('task')
  taskEl.setAttribute('id', `book-${bookObject.id}`)

  const contentEl = document.createElement('div');
  contentEl.classList.add('content')

  taskEl.appendChild(contentEl)

  const textTitle = document.createElement("input");
  textTitle.classList.add("text");
  textTitle.type = "text";
  textTitle.value = `judul buku : ${bookObject.title}`;
  textTitle.setAttribute("readonly", "readonly");  

  const textAuthor = document.createElement("input");
  textAuthor.classList.add("text");
  textAuthor.type = "text";
  textAuthor.value = `penulis : ${bookObject.author}`;
  textAuthor.setAttribute("readonly", "readonly");


  const textYear = document.createElement("input");
  textYear.classList.add("text");
  textYear.value = `tahun terbit : ${bookObject.year}`;
  textYear.setAttribute("readonly", "readonly");
  textYear.setAttribute("min", "1000");
  textYear.setAttribute("max", "2500");


  contentEl.appendChild(textTitle);
  contentEl.appendChild(textAuthor);
  contentEl.appendChild(textYear);

  const actionsEl = document.createElement('div')
  actionsEl.classList.add('actions');


  const editEl = document.createElement('button')
  editEl.classList.add('edit')
  editEl.innerHTML = 'edit'

  actionsEl.appendChild(editEl);

  editEl.addEventListener('click', function() {
    if (editEl.innerText.toLowerCase() == "edit") {
      textTitle.removeAttribute('readonly')
      textYear.removeAttribute('readonly')
      textAuthor.removeAttribute('readonly')
      textTitle.focus()
      editEl.innerText = 'simpan'
    } else {
      textTitle.setAttribute('readonly', 'readonly')
      textAuthor.setAttribute('readonly', 'readonly')
      textYear.setAttribute('readonly', 'readonly')
      editEl.innerText = 'edit'
    }
  })

  taskEl.appendChild(actionsEl);

  if (bookObject.isCompleted) {

    const ulangEl = document.createElement('button')
    ulangEl.classList.add('done')
    ulangEl.innerHTML = 'ulang';

    ulangEl.addEventListener('click', function() {
      undoBookList(bookObject.id)
    })

    const deleteEl = document.createElement('button')
    deleteEl.classList.add('delete')
    deleteEl.innerHTML = 'hapus';

    deleteEl.addEventListener('click', function() {
      deleteBookList(bookObject.id)
    })
      
    actionsEl.appendChild(ulangEl)
    actionsEl.appendChild(deleteEl)

  } else {    

    const doneEl = document.createElement('button')
    doneEl.classList.add('done')
    doneEl.innerHTML = 'selesai';

    doneEl.addEventListener('click', function() {
      addBookList(bookObject.id)
    })

    actionsEl.appendChild(doneEl);    
  }

  return taskEl;
}

function addBookList (bookId) {
  const bookTarget = findBook(bookId)

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for(const bookItem of book) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
}


function deleteBookList(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  book.splice(bookTarget, 1)

  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData();
}

function undoBookList (bookId) {
  const bookTarget = findBook(bookId)

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;

  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData();
}


function findBookIndex(bookId) {
  for (const index in book) {
    if(book[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if(isStorageExist()) {
    const parsed = JSON.stringify(book)
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

function isStorageExist() {
  if(typeof (Storage) === undefined) {
    alert('Browser anda tidak mendukung local storage.')
    return false;
  }

  return true;
}

document.addEventListener(SAVED_EVENT, function() {
  console.log(localStorage.getItem(STORAGE_KEY))
})


function loadDataFromStorage() {
  const serialData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serialData)

  if(data !== null) {
    for (const books of data) {
      book.push(books)
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}