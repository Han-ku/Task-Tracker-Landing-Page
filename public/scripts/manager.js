const lists = document.querySelectorAll(".list")
const boards = document.querySelector('.boards')
const btn = document.querySelector(".add_btn")
const add_item_btn = document.querySelector(".add_item_btn")
const cancel_item_btn = document.querySelector(".cancel_item_btn")
const textarea = document.querySelector(".textarea")
const form = document.querySelector(".form")

const add_board_button = document.querySelector(".add_board_btn")

let value
let draggedItem = null


function clear() {
    textarea.value = ""
    value = ""
    form.style.display = "none"
    btn.style.display = 'flex'
}

function addTask() {
    btn.addEventListener('click', () => {
        form.style.display = 'block'
        btn.style.display = 'none'
        add_item_btn.style.display = 'none'
        
        textarea.addEventListener('input', e => {
            value = e.target.value

            if(value) {
                add_item_btn.style.display = 'block'
            } else {
                add_item_btn.style.display = 'none'
            }
        })

        cancel_item_btn.addEventListener('click', e => {
            clear()
        })
    })

    add_item_btn.addEventListener('click', e => {
        const newItem = document.createElement('div')
        newItem.classList.add('list_item')
        newItem.draggable = true
        newItem.textContent = value
        lists[0].append(newItem)

        clear()
        dragNDrop()
    })
}
addTask()


function addBoard() {
    const boards = document.querySelector('.boards')

    const board = document.createElement('div')
    board.classList.add('boards_item')

    board.innerHTML = `
        <div id="board_header">
            <span contenteditable="true" class="title">Input title</span>
            <img class="board_delete_img" src="https://img.icons8.com/plasticine/100/filled-trash.png" alt="">
        </div>
        <div class="list"></div>
    `
    boards.append(board)

    // changeTitle()
    deleteBoard()
    dragNDrop()
}
add_board_button.addEventListener('click', addBoard)


function deleteBoard() {
    const board_delete_imgs = document.querySelectorAll('.board_delete_img')

    board_delete_imgs.forEach((board_delete_img, index) => {
        board_delete_img.addEventListener('click', () => {
            const board_item = board_delete_img.closest('.boards_item')
            board_item.remove();
        })
    })
}
deleteBoard();


// function changeTitle() {
//     const titles = document.querySelectorAll('.title')

//     titles.forEach(title => {
//         title.addEventListener('click', e => e.target.textContent = '')
//     })
// }
// changeTitle()


let toastVisible = false
let currentItem = null

function showToast() {
    const toastOverlay = document.getElementById('toastOverlay')
    toastOverlay.classList.remove('hidden')
    toastOverlay.classList.add('visible')
    document.body.classList.add('no-scroll')
    toastVisible = true
    document.addEventListener('click', outsideClickListener);
}

function hideToast() {
    const toastOverlay = document.getElementById('toastOverlay')
    toastOverlay.classList.remove('visible')
    toastOverlay.classList.add('hidden')
    document.body.classList.remove('no-scroll');
    toastVisible = false;
    currentItem = null; 
    document.removeEventListener('click', outsideClickListener);
}

function outsideClickListener(event) {
    const toastContent = document.querySelector('.toast_content')
    if (!toastContent.contains(event.target)) {
        hideToast()
    }
}

function dragNDrop() {
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    const listItems = document.querySelectorAll('.list_item')
    const lists = document.querySelectorAll('.list')

    let placeholder = document.createElement('div')
    placeholder.classList.add('placeholder')

    for(let i = 0; i < listItems.length; i++) {
        const item = listItems[i]

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
                placeholder.remove();
            }, 0)
        })

        item.addEventListener('dblclick', () => {
            if (!toastVisible) {
                currentItem = item // Set the current item being acted upon
                showToast()
            } 
        })

        // Add event listener for submit button once
        submitBtn.addEventListener('click', () => {
            if (currentItem) {
                currentItem.remove()
                console.log("ITEM DELETED")
            }
            hideToast()
        })

        // Add event listener for cancel button once
        cancelBtn.addEventListener('click', hideToast);

        for(let j = 0; j < lists.length; j++) {
            const list = lists[j]

            list.addEventListener('dragover', e => {
                e.preventDefault()
                if (!list.contains(placeholder)) {
                    list.appendChild(placeholder)
                    console.log(list)
                }
                
            })

            list.addEventListener('dragenter', function(e) {
                e.preventDefault()
            })

            list.addEventListener('dragleave', function(e) {
                
            })

            list.addEventListener('drop', function(e) {
                e.preventDefault();
                this.append(draggedItem)

                if (draggedItem) {
                    list.insertBefore(draggedItem, placeholder);
                    placeholder.remove();
                }

            })
        }
    }
}
dragNDrop()
