const inputTemplate = document.createElement('template');
inputTemplate.innerHTML = `<style>
                                .strike-through {
                                    text-decoration:line-through
                                }
                                #body{
                                    margin-top:50px;
                                }
                                #todoText{
                                    width: 150px;
                                    padding: 12px 20px;
                                    margin: 8px 0;
                                    display: inline-block;
                                    border: 1px solid #ccc;
                                    border-radius: 4px;
                                    box-sizing: border-box;
                                }
                                #addTodo {
                                    background-color: #4CAF50;
                                    border: none;
                                    color: white;
                                    padding: 12px 28px;
                                    text-align: center;
                                    text-decoration: none;
                                    display: inline-block;
                                    font-size: 16px;
                                    margin: 4px 2px;
                                    cursor: pointer;
                                }
                                .todo-element {
                                    margin-left: 10px;
                                }
                                .todo-text {
                                    margin-left: 3px;
                                }

                            </style>
                            <div id="body">
                                <input type= "text" id="todoText" placeholder="What's on your mind"/>
                                 <button id="addTodo"> Add </button>
                            </div>
                            `
class TodoList extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
        this.shadowRoot.appendChild(inputTemplate.content.cloneNode(true))
        this.todo = [];
    }

    renderTodo = ()=>{
        const toRemoveButtons = this.shadowRoot.querySelectorAll('.action-button');
        if(toRemoveButtons?.length){
        toRemoveButtons.forEach(buttons=>buttons.removeEventListener("click",this.markComplete))
    }
        const toRemove = this.shadowRoot.querySelector("#todos");
        if(toRemove){
        this.shadowRoot.removeChild(toRemove);
        }
        const todos = document.createElement("div");
        todos.id = "todos";
        this.todo.map((todoLi,index)=>{
        const todoElement = document.createElement("div")
        todoElement.className = "todo-element";
        const todoCheck = document.createElement("input");
        todoCheck.type="checkbox";
        todoCheck.className="action-button";
        todoCheck.checked = todoLi.completed;
        todoCheck.addEventListener("click",()=>this.markComplete(index))
        const todoText = document.createElement("label");
        todoText.className = `todo-text ${todoLi.completed?"strike-through":""}`;
        todoText.innerHTML =todoLi.text
        todoElement.appendChild(todoCheck);
        todoElement.appendChild(todoText);
        todos.appendChild(todoElement)
        })
        this.shadowRoot.appendChild(todos)
    }

    markComplete = (index)=>{
        this.todo[index] = {...this.todo[index],completed:!this.todo[index].completed}
        this.renderTodo()
    }

    connectedCallback(){
        this.shadowRoot.querySelector("#addTodo").addEventListener('click',()=>{
            const inputText = this.shadowRoot.querySelector("#todoText")?.value?.trim();
            if (inputText){
            this.todo.push({text: inputText , completed:false})
            }
            this.renderTodo()
            this.shadowRoot.getElementById("todoText").value="";
        })
    }

    disconnectedCallback(){
        this.shadowRoot.querySelector("#addTodo").removeEventListener('click')
    }
}

window.customElements.define("todo-list",TodoList)