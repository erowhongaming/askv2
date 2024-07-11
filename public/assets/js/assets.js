
    function showStep(step) {
      // Hide all steps
      document.querySelectorAll('.step').forEach(function(stepElement) {
          stepElement.style.display = 'none';
          stepElement.classList.remove('step-active');
      });

      // Show the current step with slide-in effect
      const currentStep = document.getElementById('step-' + step);
      currentStep.style.display = 'block';
      setTimeout(() => {
          currentStep.classList.add('step-active');
      }, 10);  // Small delay to trigger CSS transition
    }
    var request;
    const Keyboard = {
        elements: {
            main: null,
            keysContainer: null,
            keys: []
        },

        eventHandlers: {
            oninput: null,
            onclose: null
        },

        properties: {
            value: "",
            capsLock: false
        },

        init() {
            // Create main elements
            this.elements.main = document.createElement("div");
            this.elements.keysContainer = document.createElement("div");

            // Setup main elements
            this.elements.main.classList.add("keyboard", "keyboard--hidden");
            this.elements.keysContainer.classList.add("keyboard__keys");
            this.elements.keysContainer.appendChild(this._createKeys());

            this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

            // Add to DOM
            this.elements.main.appendChild(this.elements.keysContainer);
            document.body.appendChild(this.elements.main);

            // Automatically use keyboard for elements with .use-keyboard-input
            document.querySelectorAll(".use-keyboard-input").forEach(element => {
                element.addEventListener("focus", () => {
                    this.open(element.value, currentValue => {
                        element.value = currentValue;
                    });
                });
            });
        },

        _createKeys() {
            const fragment = document.createDocumentFragment();
            const keyLayout = [
                "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
                "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
                "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
                "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
                "space"
            ];

            // Creates HTML for an icon
            const createIconHTML = (icon_name) => {
                return `<i class="material-icons">${icon_name}</i>`;
            };

            keyLayout.forEach(key => {
                const keyElement = document.createElement("button");
                const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

                // Add attributes/classes
                keyElement.setAttribute("type", "button");
                keyElement.classList.add("keyboard__key");

                switch (key) {
                    case "backspace":
                        keyElement.classList.add("keyboard__key--wide");
                        keyElement.innerHTML ='⌫'

                        keyElement.addEventListener("click", () => {
                            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                            this._triggerEvent("oninput"); 
                            search(this.properties.value);
                        });

                        break;

                    case "caps":
                        keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                        keyElement.innerHTML = 'CAPS'; // Using Font Awesome icon

                        keyElement.addEventListener("click", () => {
                            this._toggleCapsLock();
                            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock); 
                        });

                        break;

                    case "enter":
                        keyElement.classList.add("keyboard__key--wide");
                        keyElement.innerHTML = 'ENTER'

                        keyElement.addEventListener("click", () => {
                        
                            this._triggerEvent("oninput");  
                            search(this.properties.value);
                        });

                        break;

                    case "space":
                        keyElement.classList.add("keyboard__key--extra-wide");
                        keyElement.innerHTML = 'SPACE BAR';

                        keyElement.addEventListener("click", () => {
                        
                            this.properties.value += " ";
                            this._triggerEvent("oninput");  
                            search(this.properties.value);
                        });

                        break;

                    case "done":
                        keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                        keyElement.innerHTML = 'EXIT';

                        keyElement.addEventListener("click", () => {
                            this.close();
                            this._triggerEvent("onclose");
                        });

                        break;

                    default:
                        keyElement.textContent = key.toLowerCase();

                        keyElement.addEventListener("click", () => {
                        
                            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                            this._triggerEvent("oninput"); 
                            search(this.properties.value);
                        });

                        break;
                }

                fragment.appendChild(keyElement);

                if (insertLineBreak) {
                    fragment.appendChild(document.createElement("br"));
                }
            });

            return fragment;
        },

        _triggerEvent(handlerName) {
            if (typeof this.eventHandlers[handlerName] == "function") {
               if(request){
                request.abort();
               }
                this.eventHandlers[handlerName](this.properties.value);
            }
        },

        _toggleCapsLock() {
            this.properties.capsLock = !this.properties.capsLock;

            for (const key of this.elements.keys) {
                if (key.childElementCount === 0) {
                    key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
                }
            }
        },

        open(initialValue, oninput, onclose) {
            this.properties.value = initialValue || "";
            this.eventHandlers.oninput = oninput;
            this.eventHandlers.onclose = onclose;
            this.elements.main.classList.remove("keyboard--hidden");
        },

        close() {
            this.properties.value = "";
            this.eventHandlers.oninput = oninput;
            this.eventHandlers.onclose = onclose;
            this.elements.main.classList.add("keyboard--hidden");
        }
    };
    
    window.addEventListener("DOMContentLoaded", function () {
       
        Keyboard.init();
        closeKeyboard();
    });

    function closeKeyboard() {
        Keyboard.close();
        
        Keyboard._triggerEvent("onclose");
    }
      // affiliated payors animation
     
    document.addEventListener('DOMContentLoaded', () => {

        const marqueeContent = document.querySelector('.affiliated-payors');

        const slider = document.querySelector('.affiliated-payors-wrapper');
      //  const marqueeContent = document.querySelector('.affiliated-payors');
        const itemsWidth = slider.scrollWidth - slider.clientWidth;
        const randomPosition = Math.floor(Math.random() * itemsWidth);

        // Set initial scroll position
        //slider.scrollLeft = randomPosition;
        slider.scrollLeft = randomPosition;


        let isDragging = false;
        let startX;
        let scrollLeft;

        // Start dragging
        const startDrag = (e) => {
            isDragging = true;
            startX = (e.type === 'mousedown') ? e.pageX : e.touches[0].pageX;
            scrollLeft = slider.scrollLeft;
            slider.classList.add('active');
            pauseMarquee();
        };

        // End dragging
        const endDrag = () => {
            isDragging = false;
            slider.classList.remove('active');
            resumeMarquee();
        };

        // Dragging
        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = (e.type === 'mousemove') ? e.pageX : e.touches[0].pageX;
            const walk = (x - startX) * 2; // Adjust the multiplier for faster/slower scrolling
            slider.scrollLeft = scrollLeft - walk;
        };

        // Mouse events
        slider.addEventListener('mousedown', startDrag);
        slider.addEventListener('mouseup', endDrag);
        slider.addEventListener('mousemove', drag);

        // Touch events
        slider.addEventListener('touchstart', startDrag);
        slider.addEventListener('touchend', endDrag);
        slider.addEventListener('touchmove', drag);

        // Function to pause the marquee animation
        const pauseMarquee = () => {
            const marquee = document.querySelector('.affiliated-payors');
            marquee.style.animationPlayState = 'paused';
        };

        // Function to resume the marquee animation
        const resumeMarquee = () => {
            const marquee = document.querySelector('.affiliated-payors');
            marquee.style.animationPlayState = 'running';
        };

        
      


    });





    const KeyNumBoard = {
        elements: {
            main: null,
            keysContainer: null,
            keys: []
        },
    
        eventHandlers: {
            oninput: null,
            onclose: null
        },
    
        properties: {
            value: "",
            maxLength: 11 // Set the default maximum length to 11
        },
    
        init() {
            // Create main elements
            this.elements.main = document.createElement("div");
            this.elements.keysContainer = document.createElement("div");
    
            // Setup main elements
            this.elements.main.classList.add("keyboard", "keyboard--hidden");
            this.elements.keysContainer.classList.add("keyboard__keys");
            this.elements.keysContainer.appendChild(this._createKeys());
    
            this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    
            // Add to DOM
            this.elements.main.appendChild(this.elements.keysContainer);
            document.body.appendChild(this.elements.main);
    
            // Automatically use keyboard for elements with .use-number-keyboard
            document.querySelectorAll(".use-number-keyboard").forEach(element => {
                element.addEventListener("focus", () => {
                    this.open(element.value, currentValue => {
                        element.value = currentValue;
                    }, element.maxLength);
                    $('#validate-number').prop('disabled', false);
                    $('#error-message').hide();
                });
            });
        },
    
        _createKeys() {
            const fragment = document.createDocumentFragment();
            const keyLayout = [
                "1", "2", "3",
                "4", "5", "6",
                "7", "8", "9",
                "done", "0", "backspace"
            ];
    
            keyLayout.forEach((key, index) => {
                const keyElement = document.createElement("button");
                const insertLineBreak = (index + 1) % 3 === 0;
    
                // Add attributes/classes
                keyElement.setAttribute("type", "button");
                keyElement.classList.add("keyboard__key");
    
                switch (key) {
                    case "backspace":
                        keyElement.classList.add("keyboard__key--wide");
                        keyElement.innerHTML = '⌫';
    
                        keyElement.addEventListener("click", () => {
                            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                            this._triggerEvent("oninput");
                        });
    
                        break;
    
                    case "done":
                        keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                        keyElement.innerHTML = 'EXIT';
    
                        keyElement.addEventListener("click", () => {
                            this.close();
                            this._triggerEvent("onclose");
                        });
    
                        break;
    
                    default:
                        keyElement.textContent = key;
    
                        keyElement.addEventListener("click", () => {
                            if (this.properties.value.length < this.properties.maxLength) {
                                this.properties.value += key;
                                this._triggerEvent("oninput");
                            }
                        });
    
                        break;
                }
    
                fragment.appendChild(keyElement);
    
                if (insertLineBreak && index < keyLayout.length - 1) {
                    fragment.appendChild(document.createElement("br"));
                }
            });
    
            return fragment;
        },
    
        _triggerEvent(handlerName) {
            if (typeof this.eventHandlers[handlerName] == "function") {
                this.eventHandlers[handlerName](this.properties.value);
            }
        },
    
        open(initialValue, oninput, onclose, maxLength) {
            this.properties.value = initialValue || "";
            this.properties.maxLength = maxLength || 11; // Use provided maxLength or default to 11
            this.eventHandlers.oninput = oninput;
            this.eventHandlers.onclose = onclose;
            this.elements.main.classList.remove("keyboard--hidden");
        },
    
        close() {
            this.properties.value = "";
            this.elements.main.classList.add("keyboard--hidden");
        }
    };
    
    window.addEventListener("DOMContentLoaded", function () {
        KeyNumBoard.init();
        closeKeyboardNum()
    });

    function closeKeyboardNum(){
        KeyNumBoard.close();
        
        KeyNumBoard._triggerEvent("onclose");
    }
    
  

    const KeyOTPBoard = {
        elements: {
            main: null,
            keysContainer: null,
            keys: []
        },
    
        eventHandlers: {
            oninput: null,
            onclose: null
        },
    
        properties: {
            value: "",
            targetInput: null,
            maxLength: 1 // Default maximum length for OTP
        },
    
        init() {
            // Create main elements
            this.elements.main = document.createElement("div");
            this.elements.keysContainer = document.createElement("div");
    
            // Setup main elements
            this.elements.main.id = "keyboard";
            this.elements.main.classList.add("keyboard", "keyboard--hidden");
            this.elements.keysContainer.classList.add("keyboard__keys");
            this.elements.keysContainer.appendChild(this._createKeys());
    
            this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    
            // Add to DOM
            this.elements.main.appendChild(this.elements.keysContainer);
            document.body.appendChild(this.elements.main);
    
            // Automatically use keyboard for elements with .use-otp-board
            document.querySelectorAll(".use-otp-keyboard").forEach(element => {
                element.addEventListener("focus", () => {
                    this.open(element.value, currentValue => {
                        element.value = currentValue;
                    }, element.maxLength);
                    this.properties.targetInput = element;
                });
    
                // Add event listener for regular keyboard input
                element.addEventListener("input", (event) => {
                    if (event.inputType === 'insertText' && event.data.length === 1) {
                        // Automatically move to the next input field after typing
                        this._moveToNextInput();
                    }
                    this._logValue(event.target.value); // Log the value
                });
            });
        },
    
        _createKeys() {
            const fragment = document.createDocumentFragment();
            const keyLayout = [
                "1", "2", "3", "4", "5", "6", "7", "8", "9","done", "0", "backspace"
            ];
    
            keyLayout.forEach((key, index) => {
                const keyElement = document.createElement("button");
                const insertLineBreak = (index + 1) % 3 === 0 && index < 9;
    
                // Add attributes/classes
                keyElement.setAttribute("type", "button");
                keyElement.classList.add("keyboard__key");
    
                switch (key) {
                    case "backspace":
                        keyElement.innerHTML = '⌫';
    
                        keyElement.addEventListener("click", () => {
                            if (this.properties.value.length > 0) {
                                this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                                this.properties.targetInput.value = this.properties.value;
                                this._triggerEvent("oninput");
                            }
                        });
    
                        break;
    
                    case "done":
                        keyElement.innerHTML = 'EXIT';
    
                        keyElement.addEventListener("click", () => {
                            this.close();
                            this._triggerEvent("onclose");
                        });
    
                        break;
    
                    default:
                        keyElement.textContent = key;
    
                        keyElement.addEventListener("click", () => {
                            if (this.properties.targetInput && this.properties.targetInput.value.length < this.properties.maxLength) {
                                this.properties.value += key;
                                this.properties.targetInput.value = this.properties.value;
                                this._triggerEvent("oninput");
    
                                // Move focus to the next input if available
                                this._moveToNextInput();
                            }
                        });
    
                        break;
                }
    
                fragment.appendChild(keyElement);
    
                if (insertLineBreak) {
                    fragment.appendChild(document.createElement("br"));
                }
            });
    
            return fragment;
        },
    
        _triggerEvent(handlerName) {
            if (typeof this.eventHandlers[handlerName] === "function") {
                this.eventHandlers[handlerName](this.properties.value);
            }
        },
    
        _moveToNextInput() {
            if (this.properties.targetInput) {
                const nextInput = this.properties.targetInput.nextElementSibling;
                if (nextInput && nextInput.classList.contains("use-otp-keyboard")) {
                    nextInput.focus();
                }
            }
        },
    
        open(initialValue, oninput, onclose, maxLength) {
            this.properties.value = initialValue || "";
            this.properties.maxLength = maxLength || 1; // Use provided maxLength or default to 1
            this.eventHandlers.oninput = oninput;
            this.eventHandlers.onclose = onclose;
            this.elements.main.classList.remove("keyboard--hidden");
        },
    
        close() {
            this.properties.value = "";
            this.elements.main.classList.add("keyboard--hidden");
        }
    };
    

    window.addEventListener("DOMContentLoaded", function () {
        KeyOTPBoard.init();
        closeKeyboardOTP();
    });


    function closeKeyboardOTP(){
        KeyOTPBoard.close();
        
        KeyOTPBoard._triggerEvent("onclose");
    }