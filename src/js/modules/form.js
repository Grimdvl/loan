export default class Form {
    constructor(form) {
        this.forms = document.querySelectorAll(form);
        this.inputs = document.querySelectorAll('input');
        this.message = {
            loading: 'Loading...',
            success: 'Thank you! We will call you!',
            failure: 'Something went wrong.',
        };
        this.path = 'assets/question.php';
    }

    clearInputs() {
        this.inputs.forEach(item => {
            item.value = '';
        });
    }

    checkMailInputs() {
        const mailInputs = document.querySelectorAll('[type="email"]');
    
        mailInputs.forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key.match(/[^a-z 0-9 @ \.]/i) || e.key === ' ') {
                    e.preventDefault();
                }
            });
        });
    }

    initMask() {
        let setCursorPosition = (pos, elem) => {
            elem.focus();
    
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                let range = elem.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        };
    
        function createMask(event) {
            let matrix = '+1 (___) ____-____',
                i = 0,
                def = matrix.replace(/\D/g, ''),
                val = this.value.replace(/\D/g, '');
    
            if (def.length >= val.length) {
                val = def;
            }
    
            if (event.inputType === 'deleteContentBackward' && val.length <= 3) {
                this.value = matrix;
                setCursorPosition(3, this);
                return;
            }
    
            this.value = matrix.replace(/./g, function(a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
            });
    
            if (event.type === 'blur') {
                if (this.value.length === 2) {
                    this.value = '';
                }
            } else if (event.type === 'focus' || event.type === 'click') {
                if (this.value.length <= 3) {
                    setCursorPosition(this.value.length, this);
                } else {
                    setCursorPosition(3, this);
                }
            }
        }
    
        function preventCursorMove(event) {
            if (event.key === 'ArrowLeft' && (this.selectionStart <= 3 || this.selectionEnd <= 3)) {
                event.preventDefault();
            }
        }
    
        let inputs = document.querySelectorAll('[name="phone"]');
    
        inputs.forEach(input => {
            input.addEventListener('input', createMask);
            input.addEventListener('focus', createMask);
            input.addEventListener('blur', createMask);
            input.addEventListener('click', createMask);
            input.addEventListener('keydown', preventCursorMove);
        });
    }

    async postData(url, data) {
        let res = await fetch(url, {
            method: 'POST',
            body: data,
        });

        return await res.text();
    }

    init() {
        this.checkMailInputs();
        this.initMask();

        this.forms.forEach(item => {
            item.addEventListener('submit', (e) => {
                e.preventDefault();

                let statusMessage = document.createElement('div');
                statusMessage.style.cssText = `
                    margin-top: 15px;
                    font-size: 18px;
                    color: grey;
                `;
                item.parentNode.appendChild(statusMessage);

                statusMessage.textContent = this.message.loading;

                const formData = new FormData(item);
                
                this.postData(this.path, formData)
                    .then(res => {                         
                        console.log(res);
                        statusMessage.textContent = this.message.success;
                    })
                    .catch(() => {
                        statusMessage.textContent = this.message.failure;
                    })
                    .finally(() => {
                        this.clearInputs();
                        setTimeout(() => {
                            statusMessage.remove();
                        }, 6000);
                    });
            });
        });
    }
}