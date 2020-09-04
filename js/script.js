'use strict';

class Todo {
  constructor(form, input, todoList, todoCompleted, todoContainer) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoContainer = document.querySelector(todoContainer);
    this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
  }

  addToStorage() {
    localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createItem);
    this.addToStorage();
  }

  createItem = (todo) => {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = todo.key;
    li.insertAdjacentHTML('beforeend', `
      	<span class="text-todo">${todo.value}</span>
        <div class="todo-buttons">
          <button class="todo-edit"></button>
					<button class="todo-remove"></button>
					<button class="todo-complete"></button>
				</div>`);

    if(todo.completed){
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
    this.input.value = '';
  }

  addTodo(e) {
    e.preventDefault();
    if (this.input.value.trim()) {
    const newTodo = {
      value: this.input.value,
      completed: false,
      key: this.generateKey(),
    };
    this.todoData.set(newTodo.key, newTodo);
    this.render();
    } else {
      alert('Пустое дело добавить нельзя!!');
    }
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  deleteItem(item) {
    //найти по ключу и удалить из MAp
    let currentElem = item.closest('.todo-item');
    this.todoData.forEach((elem, key, map) => {
      if(key === currentElem.key) map.delete(key); 
      this.render();
    });
  }

  completedItem(item) {
    //перебрать forEach todoDat найти через ключ элемент поменять знач completed
    let currentElem = item.closest('.todo-item');
    this.todoData.forEach((elem, key) => {
      if (currentElem.key === key){
        elem.completed = (!elem.completed) ? true : false;
        this.render();
      } 
    });
  }

  handler() {
    //делегирование на род. контейнер определить на какую кнопку кликнули и вызвать метод completed или delete
    this.todoContainer.addEventListener('click', (e) => {
      let target = e.target;
       if(target.matches('.todo-complete')) {
         this.completedItem(target);
       } else if (target.matches('.todo-remove')){
         this.deleteItem(target);
       } else {
         return;
       }
    });
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.render();
    this.handler();
  }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');

todo.init();
