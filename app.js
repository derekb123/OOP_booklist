//Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI Class: Handle UI Tasks
class UI {
  static displayBooks() {

    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
    `;
    
    list.appendChild(row);
  }

  static deleteBook(target) {
    if(target.classList.contains('delete')) {
      target.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${className}`;
    alertDiv.appendChild(document.createTextNode(message));
    const mainContainer = document.querySelector('.container');
    const bookForm = document.querySelector('#book-form');
    mainContainer.insertBefore(alertDiv, bookForm);
    //Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 2500);
  }

  static clearFields() {
    document.querySelector('#title').value='';
    document.querySelector('#author').value='';
    document.querySelector('#isbn').value='';
  }
}

//Store Class: Handle Storage

class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books))
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books))
  }
}

//Event: Display Books

document.addEventListener('DOMContentLoaded', UI.displayBooks)

//Event: Add a Book

document.querySelector('#book-form').addEventListener('submit', (e) => {
  //Prevent actual submit
  e.preventDefault();
  
  //Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  //Validate
  if(title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    //Instantiate book
    const book = new Book(title, author, isbn);
    console.log(book);

    //Add Book To UI
    UI.addBookToList(book);

    //Add book to Store
    Store.addBook(book);

    //Success message
    UI.showAlert('Book Added', 'success');

    //Clear fields
    UI.clearFields();
  }


})

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  //Remove book from UI
  UI.deleteBook(e.target);

  //Remove book from Store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //Success message
  UI.showAlert('Book Removed', 'success');
})