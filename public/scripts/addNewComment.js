document.addEventListener('DOMContentLoaded', function () {
    const ADD_NEW_USER = document.querySelector(".newUserFields");
    const COMMENT_FORM = document.querySelector("#commentForm");
    const ERROR_MESSAGE = document.createElement('div');
    ERROR_MESSAGE.className = 'error-message';
    ERROR_MESSAGE.textContent = 'To create a comment, you need to register.'
    const COMMENT_INPUT = document.getElementById('userCommentInput')
    const COMMENT_MAX_LENGTH = document.getElementById('comment_max_length')
    const MAX_CHARACTERS = 1000
    const BOTTOM_COMMENT_ALERT = document.getElementById('bottom_comment-alert')

    const USERNAME_INPUT = document.getElementById('userNameInput')
    const NEW_USERNAME_INPUT = document.querySelector('input[name="user_name"]')

    const togglePassword = document.getElementById('togglePassword')
    const passwordInput = document.getElementById('password')

    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password'
        passwordInput.setAttribute('type', type)
        this.querySelector('img').src = type === 'password' ? '/images/hide.png' : '/images/show.png'
    })

    COMMENT_FORM.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(COMMENT_FORM);
        console.log('Submitting form:', [...formData.entries()])

        const formDataObj = {}
        formData.forEach((value, key) => formDataObj[key] = value)
        console.log('Form data object:', formDataObj);

        try {
            const response = await fetch('/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObj)
            });
            const result = await response.json()
            console.log('Server response:', result)

            if (result.status === 'user_not_found') {
                ADD_NEW_USER.classList.remove('hidden')
                addRequiredAttributes()
                if (!COMMENT_FORM.contains(ERROR_MESSAGE)) {
                    COMMENT_FORM.insertBefore(ERROR_MESSAGE, COMMENT_FORM.firstChild)
                }
                NEW_USERNAME_INPUT.value = USERNAME_INPUT.value; // Populate username in new user form
            } else if (result.status === 'comment_created') {
                displayBottomComment('Comment created!', 'approved')
                ADD_NEW_USER.classList.add('hidden')
                setTimeout(() => {
                    location.reload()
                }, 2000)
            } else {
                displayBottomComment('An unknown error occurred. Please try again.', 'denied')
                throw new Error(result.error || 'An unknown error occurred')
            }
        } catch (error) {
            console.error('Error:', error);
            displayBottomComment('An error occurred while submitting the form. Please try again.', 'denied')
        }
    })

    function addRequiredAttributes() {
        ADD_NEW_USER.querySelectorAll('input').forEach(input => {
            input.setAttribute('required', 'required')
        })
    }

    COMMENT_INPUT.addEventListener('input', function() {
        if (COMMENT_INPUT.value.length > MAX_CHARACTERS) {
            COMMENT_INPUT.value = COMMENT_INPUT.value.substring(0, MAX_CHARACTERS)
        }
        const currentLength = COMMENT_INPUT.value.length;
        COMMENT_MAX_LENGTH.textContent = `${currentLength}/${MAX_CHARACTERS}`
    })

    function displayBottomComment(message, statusClass) {
        BOTTOM_COMMENT_ALERT.textContent = message
        BOTTOM_COMMENT_ALERT.className = statusClass
        setTimeout(() => {
            BOTTOM_COMMENT_ALERT.textContent = ''
            BOTTOM_COMMENT_ALERT.className = ''
        }, 10000)
    }
})