/**HOW TO USE VALIDATOR()?
 * Argument: {
            form: '<formSelector>',
            rules: [ 
                Validator.checkEmty(inputSelector, messageSelector),
                ...
            ],
            handleInfo: function(info) {
                //call API | your handle
            }
        })
 * Validator methods:
        checkEmty (inputSelector, messageSelector)
        checkEmail (inputSelector, messageSelector)
        checkPassword (inputSelector, messageSelector)
        checkConfirmPassword (inputSelector, #password, messageSelector)
        checkRadio (radioInputSelectors, messageSelector)
        checkCheckbox (checkboxInputSelectors, messageSelector)

 * Note:
 * **/

// FUNCTION -- handle validation
function Validator(options) {
    // Get form Element
    let formElement = document.querySelector(options.form)

    // Function -- Show errorMessage on UI 
    function showErrorMessage(errorMessage, messageSelector) {
        if (errorMessage) {
            // let formElement = document.querySelector(options.form)
            formElement.querySelector(messageSelector).innerText = `${errorMessage}`
        }
    }
    // Function -- Remove message 
    function removeErrorMessage(messageSelector) {
            // let formElement = document.querySelector(options.form)
            formElement.querySelector(messageSelector).innerText = ''
    }

    if (formElement) {
        // Handle validate form
        options.rules.forEach( rul => {
            // Handle validate text/password/file input (argument --> 1 input element)
            if (typeof rul.selector === 'string') {
                let inputElement = formElement.querySelector(rul.selector)
                if (inputElement.type === 'file') {
                    // only check file type when click submit
                }
                else {
                    inputElement.onblur = () => {
                        let inputValue = inputElement.value 
                        let errorMessage = rul.check(inputValue)
                        showErrorMessage(errorMessage, rul.messageSelector)
                        // Remove error message in the next focus
                        inputElement.onfocus = () => {
                            removeErrorMessage(rul.messageSelector)
                        }
                    }
                }
            }
            // Handle validate radio/checkbox input (argument --> >1 input element)
            if ( !(typeof rul.selector === 'string') ) {
                
            }
        });


        // Handle submit button when clicked
        formElement.onsubmit = e => {

            e.preventDefault()

            let isInvalid = false // to check valid form?

            //Validate all text input --> show error message on UI
            options.rules.forEach(rul => {

                // text/password/file type
                if (typeof rul.selector === 'string') {
                    let inputElement = formElement.querySelector(rul.selector)
                    let inputValue = inputElement.value 
                    let errorMessage = rul.check(inputValue)
                    if (errorMessage) {
                        showErrorMessage(errorMessage, rul.messageSelector)
                        // Remove error message in the next focus
                        inputElement.onfocus = () => {
                            removeErrorMessage(rul.messageSelector)
                        }
    
                        isInvalid = true
                        
                    }
                }

                // radio/checkbox type
                if ( typeof rul.selector === 'object' ) {
                    
                    let isChecked = false

                    rul.selector.forEach( $inputRadio => {
                        if ($inputRadio.checked){
                            isChecked = true
                        } 
                    })

                    if ( !isChecked ) {
                        let errorMessage = rul.check()
                        if (errorMessage) {
                            showErrorMessage(errorMessage, rul.messageSelector)
                            // Remove error message in the next checked
                            rul.selector.forEach( $inputRadio => {
                                $inputRadio.onclick = () => {
                                    removeErrorMessage(rul.messageSelector)
                                }
                            })
    
                            isInvalid = true

                        }
                    }
                }
                
            })

            // Get and handle info if all input value is valid
            if (!isInvalid) {
                let info = {} // to store form data
                let checkboxValues = [] // to store checkbox is checked
                let $$input = formElement.querySelectorAll('input')

                $$input.forEach($input => {

                    // radio type
                    if ($input.type === 'radio') {
                        let inputName = $input.name
                        let isChecked = $input.checked;
                        if (isChecked) {
                            info = {...info, [inputName]: $input.value}
                        }
                    }
                    // checkbox type
                    else if ($input.type === 'checkbox') {
                        let inputName = $input.name
                        let isChecked = $input.checked;
                        if (isChecked) {
                            checkboxValues.push($input.value)
                            info = {...info, [inputName]: checkboxValues}
                        }
                    }
                    // file type
                    else if ($input.type === 'file') {
                        let inputId = $input.getAttribute('id')
                        info = {...info, [inputId]: $input.files}
                    }
                    // rest (text, password)
                    else {
                        let inputId = $input.getAttribute('id')
                        info = {...info, [inputId]: $input.value}
                    }
                })

                // call function handle form data
                if (options.handleInfo) {
                    options.handleInfo(info)
                }
                // submit default
                else {
                    formElement.submit()
                }
            }
        }
    }
}

// METHOD -- CHECK EMTY
Validator.checkEmty = (selector, messageSelector) => {
    return {
        selector: selector,
        messageSelector: messageSelector,
        check(inputValue) {
            return inputValue.trim() ? undefined : 'Đừng có để trống fen' 
        }
    }
}

// METHOD -- CHECK EMAIL
Validator.checkEmail = (selector, messageSelector) => {
    return {
        selector: selector,
        messageSelector: messageSelector,
        check(inputValue) {

            if (inputValue) {
                let regEx = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return regEx.test(inputValue)? undefined : "Nhập đúng email hộ cái"
            } else {
                return 'Đừng có để trống fen'
            }

        }
    }
}

// METHOD -- CHECK PASSWORD INPUT
Validator.checkPassword = (selector, messageSelector) => {
    // Regular Expression to check password
    const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return {
        selector: selector,
        messageSelector: messageSelector, 
        check(inputValue) {
            if (inputValue) {
                return regEx.test(inputValue) ? undefined : "Nhập đúng quy định nào (chữ hoa, thường, kí hiệu đặc biệt)"
            } else {
                return 'Đừng có để trống fen'
            }
        }
    }
}

// METHOD -- CHECK PASSWORD CONFIRM
Validator.checkConfirmPassword = (passConfirmSelector, passSelector, messageSelector ) => {
    //Regular Expression to check password
    const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return {
        selector: passConfirmSelector,
        messageSelector: messageSelector,
        check(inputValue) {
            let pass = document.querySelector(passSelector).value
            if (inputValue) {
                if (regEx.test(pass)) {
                    return inputValue === pass? undefined : 'Nhập lại mà nhập cũng sai nữa fen!'
                } else {
                    return 'Nhập ô trên trước đi fen, nóng tính vậy'
                }

            } else {
                return 'Đừng để trống chứ fen' 
            }
        },
    }
}

//METHOD -- CHECK INPUT RADIO TYPE
Validator.checkRadio = function(radioSelectors, messageSelector) {
    let selectors = document.querySelectorAll(radioSelectors)
    return {
        selector: Array.from(selectors),
        messageSelector: messageSelector,
        check(){
            return 'Chọn đi fen'
        }
    }
}

//METHOD -- CHECK INPUT CHECKBOX TYPE
Validator.checkCheckbox = function(checkboxSelectors, messageSelector) {
    let selectors = document.querySelectorAll(checkboxSelectors)
    return {
        selector: Array.from(selectors),
        messageSelector: messageSelector,
        check(){
            return 'Chọn hộ cái fen ơi'
        }
    }
}
