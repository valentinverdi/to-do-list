const btnAddTaskMas = document.querySelector("#addnewtask");
const sectionModal = document.querySelector("#sectionmodal");
const modal = document.querySelector("#modal");
const btnAddTask = document.querySelector(".addtask");
const btnCancel = document.querySelector(".cancel");
const textareaTitle = document.querySelector(".modal__title");
const textareaDescription = document.querySelector(".modal__description");
const inputDate = document.querySelector(".modal__date");
const toDoTasksContainer = document.querySelector(".todo .taskscontainer");
const inProgressTasksContainer = document.querySelector(".inprogress .taskscontainer");
const completedTasksContainer = document.querySelector(".completed .taskscontainer");
const containerTasks = [toDoTasksContainer,inProgressTasksContainer,completedTasksContainer];


btnAddTaskMas.addEventListener("click",()=>{
    document.querySelector("#warning").classList.add("hidden");
    sectionModal.classList.remove("sectionmodalnovisible");
    sectionModal.classList.add("sectionmodal");
    modal.classList.remove("modalnovisible");
    modal.classList.add("modal");
})

btnCancel.addEventListener("click",()=>{
    sectionModal.classList.remove("sectionmodal");
    sectionModal.classList.add("sectionmodalnovisible");
    modal.classList.remove("modal");
    modal.classList.add("modalnovisible");
    
    textareaTitle.value = "";
    textareaDescription.value = "";
    inputDate.value = "";
    
})

const IDBRequest = indexedDB.open("to-do-list",1);

IDBRequest.addEventListener("upgradeneeded",()=>{
    const dbTodoList = IDBRequest.result;
    const almacenTodo = dbTodoList.createObjectStore("to-do",{autoIncrement: true});
    const almacenInProgress = dbTodoList.createObjectStore("in-progress",{autoIncrement: true});
    const almacenCompleted = dbTodoList.createObjectStore("completed",{autoIncrement: true});
})

IDBRequest.addEventListener("success",()=>{
    readTasks(toDoTasksContainer,"to-do");
    readTasks(inProgressTasksContainer,"in-progress");
    readTasks(completedTasksContainer,"completed");
})

function addTask(task,almacen,key) {
    const dbTodoList = IDBRequest.result;
    const IDBTransaction = dbTodoList.transaction(almacen,"readwrite");
    const IDBObjectStore = IDBTransaction.objectStore(almacen);
    IDBObjectStore.add(task,key)
    IDBTransaction.addEventListener("complete",()=>{
        console.log("objeto agregado correctamente")
    })
}

function deleteTask(almacen,key,div,h4,p,span,i) {
    const dbTodoList = IDBRequest.result;
    const IDBTransaction = dbTodoList.transaction(almacen,"readwrite");
    const IDBObjectStore = IDBTransaction.objectStore(almacen);
    IDBObjectStore.delete(key)
    IDBTransaction.addEventListener("complete",()=>{
        console.log("objeto eliminado correctamente")
        div.remove()
        h4.remove()
        p.remove()
        span.remove()
        i.remove()
    })
}

function readTasks(taskscontainer,almacen) {
    const dbTodoList = IDBRequest.result;
    const IDBTransaction = dbTodoList.transaction(almacen,"readwrite");
    const IDBObjectStore = IDBTransaction.objectStore(almacen);
    const cursor = IDBObjectStore.openCursor()
    cursor.addEventListener("success",()=>{
        if (cursor.result) {
            createTaskAtStart(taskscontainer,almacen,cursor.result.value.date,cursor.result.value.description,cursor.result.value.key,cursor.result.value.title)
            cursor.result.continue()
        }
    })
}

function createTask(taskscontainer,almacen) {
    const div = document.createElement("DIV");
    taskscontainer.appendChild(div);
    div.classList.add("task");
    div.setAttribute("draggable","true");

    const h4 = document.createElement("H4");
    div.appendChild(h4);

    const p = document.createElement("P");
    div.appendChild(p);

    const span = document.createElement("SPAN");
    div.appendChild(span);

    const i = document.createElement("I");
    div.appendChild(i);
    i.classList.add("fa-solid");
    i.classList.add("fa-trash-can");

    const key = Date.now();
    div.setAttribute("id",`${key}`);

    const title = textareaTitle.value;
    const description = textareaDescription.value;
    const date = inputDate.value;

    h4.innerHTML = title;
    p.innerHTML = description;
    span.innerHTML = date;

    const task = {
        title: title,
        description: description,
        date: date,
        key: key
    }
 
    addTask(task,almacen,key)

    i.addEventListener("click",()=>{
        deleteTask(almacen,key,div,h4,p,span,i)
    })

    div.addEventListener("dragstart",(e)=>{
        e.dataTransfer.setData("id",e.target.id);
        e.dataTransfer.setData("almacen",almacen);
    })
}

function createTaskAtStart(taskscontainer,almacen,parametroDate,parametroDescription,parametroKey,parametroTitle) {
    const div = document.createElement("DIV");
    taskscontainer.appendChild(div);
    div.classList.add("task");
    div.setAttribute("draggable","true");
    
    const h4 = document.createElement("H4");
    div.appendChild(h4);
    
    const p = document.createElement("P");
    div.appendChild(p);
    
    const span = document.createElement("SPAN");
    div.appendChild(span);
    
    const i = document.createElement("I");
    div.appendChild(i);
    i.classList.add("fa-solid");
    i.classList.add("fa-trash-can");

    const key = parametroKey
    div.setAttribute("id",`${key}`);
    
    const title = parametroTitle;
    const description = parametroDescription;
    const date = parametroDate;
    
    h4.innerHTML = title;
    p.innerHTML = description;
    span.innerHTML = date;
    
    i.addEventListener("click",()=>{
        deleteTask(almacen,key,div,h4,p,span,i)
    })

    div.addEventListener("dragstart",(e)=>{
        e.dataTransfer.setData("id",e.target.id);
        e.dataTransfer.setData("almacen",almacen); 
    })
}

function createTaskAfterMove(taskscontainer,almacen,title,description,date,key) {
    const div = document.createElement("DIV");
    taskscontainer.appendChild(div);
    div.classList.add("task");
    div.setAttribute("draggable","true");

    div.setAttribute("id",`${key}`);

    const h4 = document.createElement("H4");
    div.appendChild(h4);

    const p = document.createElement("P");
    div.appendChild(p);

    const span = document.createElement("SPAN");
    div.appendChild(span);

    const i = document.createElement("I");
    div.appendChild(i);
    i.classList.add("fa-solid");
    i.classList.add("fa-trash-can");

    h4.innerHTML = title;
    p.innerHTML = description;
    span.innerHTML = date;

    const task = {
        title: title,
        description: description,
        date: date,
        key: key
    }
 
    addTask(task,almacen,key)

    i.addEventListener("click",()=>{
        deleteTask(almacen,key,div,h4,p,span,i)
    })

    div.addEventListener("dragstart",(e)=>{
        e.dataTransfer.setData("id",e.target.id);
        e.dataTransfer.setData("almacen",almacen);
    })
}

btnAddTask.addEventListener("click",()=>{
    if (textareaTitle.value !== "" && textareaDescription.value !== "" && inputDate.value !== "") {
        createTask(toDoTasksContainer,"to-do")

        sectionModal.classList.remove("sectionmodal");
        sectionModal.classList.add("sectionmodalnovisible");
        modal.classList.remove("modal");
        modal.classList.add("modalnovisible");
    
        textareaTitle.value = "";
        textareaDescription.value = "";
        inputDate.value = "";
    } else {
        document.querySelector("#warning").classList.remove("hidden")
    }
})

containerTasks.forEach(element => {
    element.addEventListener("dragover",(e)=>{
        e.preventDefault()
    })

    element.addEventListener("drop",(e)=>{
        e.preventDefault()

        const idDiv = e.dataTransfer.getData("id");
        const preDiv = document.getElementById(`${idDiv}`);
        const preH4 = preDiv.querySelector("h4");
        const preP = preDiv.querySelector("p");
        const preSpan = preDiv.querySelector("span");
        const preI = preDiv.querySelector("i");

        const preTitle = preH4.innerHTML;
        const preDescription = preP.innerHTML;
        const preDate = preSpan.innerHTML;
        const preKey = Number(idDiv);

        const preAlmacen = e.dataTransfer.getData("almacen");

        let almacenDrop;

        if (element == toDoTasksContainer) {
            almacenDrop = "to-do"
        } else if (element == inProgressTasksContainer){
            almacenDrop = "in-progress"
        } else if (element == completedTasksContainer){
            almacenDrop = "completed"
        }

        deleteTask(preAlmacen,preKey,preDiv,preH4,preP,preSpan,preI)
        createTaskAfterMove(element,almacenDrop,preTitle,preDescription,preDate,preKey)

    })
})