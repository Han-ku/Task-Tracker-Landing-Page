const boardsContainer = document.querySelector('.boards')
const addItemButton = document.querySelector(".add_item_btn")
const cancelItemButton = document.querySelector(".cancel_item_btn")
const textarea = document.querySelector(".textarea")
const form = document.querySelector(".form")
const addBoardButton = document.querySelector(".add_board_btn")

let value
let draggedItem = null

function clear() {
    textarea.value = ""
    value = ""
    form.style.display = "none"
}

function saveData() {
    const boardData = []

    document.querySelectorAll('.boards_item').forEach((board) => {
        const boardId = board.dataset.boardId
        const boardTitle = board.querySelector('.title').textContent
        const taskItems = []

        board.querySelectorAll('.list_item').forEach(item => {
            taskItems.push(item.textContent)
        })

        boardData.push({
            id: boardId,
            title: boardTitle,
            tasks: taskItems
        })
    })

    localStorage.setItem('boardData', JSON.stringify(boardData))
}

function loadData() {
    const boardData = JSON.parse(localStorage.getItem('boardData')) || []

    boardData.forEach((boardInfo) => {
        let board = document.querySelector(`.boards_item[data-board-id="${boardInfo.id}"]`)

        if (!board) {
            board = createBoard(boardInfo.title, boardInfo.id)
            boardsContainer.append(board)
        }

        board.querySelectorAll('.list_item').forEach(item => item.remove())

        boardInfo.tasks.forEach(taskText => {
            const newItem = createTaskItem(taskText)
            board.querySelector('.list').append(newItem)
        })
    })

    dragNDrop()
}

function createTaskItem(text) {
    const newItem = document.createElement('div')
    newItem.classList.add('list_item')
    newItem.draggable = true
    newItem.textContent = text
    return newItem
}

function createBoard(title = "Input title", id = null) {
    const board = document.createElement('div')
    board.classList.add('boards_item')
    if (id) {
        board.dataset.boardId = id
    }

    board.innerHTML = `
        <div id="board_header">
            <span contenteditable="true" class="title">${title}</span>
            ${id ? '' : '<img class="board_delete_img" src="https://img.icons8.com/plasticine/100/filled-trash.png" alt="">'}
        </div>
        <div class="list"></div>
    `

    if (!id) {
        board.querySelector('.board_delete_img').addEventListener('click', () => {
            board.remove()
            saveData()
        })
    }

    return board
}

function addTask() {
    document.querySelector('.add_btn').addEventListener('click', () => {
        form.style.display = 'block'
        addItemButton.style.display = 'none'
        
        textarea.addEventListener('input', e => {
            value = e.target.value

            if(value) {
                addItemButton.style.display = 'block'
            } else {
                addItemButton.style.display = 'none'
            }
        })

        cancelItemButton.addEventListener('click', e => {
            clear()
        })
    })

    addItemButton.addEventListener('click', e => {
        const newItem = createTaskItem(value)
        document.querySelectorAll('.list')[0].append(newItem)

        clear()
        saveData()
        dragNDrop()
    })
}
addTask()

function addBoard() {
    const newBoard = createBoard()
    boardsContainer.append(newBoard)

    saveData()
    dragNDrop()
}
addBoardButton.addEventListener('click', addBoard)

let toastVisible = false
let currentItem = null

function showToast() {
    const toastOverlay = document.getElementById('toastOverlay')
    toastOverlay.classList.remove('hidden')
    toastOverlay.classList.add('visible')
    document.body.classList.add('no-scroll')
    toastVisible = true;
    document.addEventListener('click', outsideClickListener)
}

function hideToast() {
    const toastOverlay = document.getElementById('toastOverlay')
    toastOverlay.classList.remove('visible')
    toastOverlay.classList.add('hidden')
    document.body.classList.remove('no-scroll')
    toastVisible = false;
    currentItem = null; 
    document.removeEventListener('click', outsideClickListener)
}

function outsideClickListener(event) {
    const toastContent = document.querySelector('.toast_content')
    if (!toastContent.contains(event.target)) {
        hideToast()
    }
}

function dragNDrop() {
    const submitBtn = document.getElementById('submitBtn')
    const cancelBtn = document.getElementById('cancelBtn')

    const listItems = document.querySelectorAll('.list_item')
    const lists = document.querySelectorAll('.list')

    let placeholder = document.createElement('div')
    placeholder.classList.add('placeholder')

    listItems.forEach(item => {
        item.addEventListener('dragstart', () => {
            draggedItem = item
            setTimeout(() => {
                item.style.display = 'none'
            }, 0)
        })

        item.addEventListener('dragend', () => {
            setTimeout(() => {
                item.style.display = 'block'
                draggedItem = null
                placeholder.remove()
                saveData()
            }, 0)
        })

        item.addEventListener('dblclick', () => {
            if (!toastVisible) {
                currentItem = item
                showToast()
            } 
        })
    })

    submitBtn.addEventListener('click', () => {
        if (currentItem) {
            currentItem.remove()
            saveData()
        }
        hideToast()
    })

    cancelBtn.addEventListener('click', hideToast)

    lists.forEach(list => {
        list.addEventListener('dragover', e => {
            e.preventDefault()
            if (!list.contains(placeholder)) {
                list.appendChild(placeholder)
            }
        })

        list.addEventListener('dragenter', function(e) {
            e.preventDefault()
        })

        list.addEventListener('dragleave', function(e) {
        })

        list.addEventListener('drop', function(e)  {
            e.preventDefault()
            if (draggedItem) {
                list.insertBefore(draggedItem, placeholder)
                placeholder.remove()
                saveData()
            }
        })
    })
}

loadData()
dragNDrop()