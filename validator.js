const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Object validator
function Validator(selector) {
   const formEl = $(selector);
   const validatorRules = {
      required: function(value) {
         const message = 'Vui long nhap truong nay';
         return value.trim() ? undefined : message;
      },

      email: function(value) {
         const message = 'Vui long nhap email';
         const emailRg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         return emailRg.test(value.toLowerCase()) ? undefined : message;
      },

      min: function(value, lower) {
         const message = `Toi thieu ${lower} ky tu`;
         return value.trim().length >= lower ? undefined : message;
      },

      max: function(value, upper) {
         const message = `Toi da ${upper} ky tu`;
         return value.trim().length <= upper ? undefined : message;
      },

      same: function(value, selector) {
         const sample = $(selector).value;
         const message = 'Khong trung khop';
         return value === sample ? undefined : message;
      }
   }

   const userRules = {};

   if (formEl) {
      inputEls = formEl.querySelectorAll('[name][rules]');

      inputEls.forEach((element) => {
         const name = element.name;
         const type = element.type;
         const rules = element.getAttribute('rules').split('|');
         userRules[name] = {type, rules};
      
         element.onblur = function() {
            validate(name);
         }

         element.oninput = function() {
            const formGroup = this.closest('.form-group');
            const errorEl = formGroup.querySelector('.form-message');
            formGroup.classList.remove("invalid");
            errorEl.textContent = "";
         }
      })

      function getCheckedInputValue(inputEls) {
         let values = [];
         for (let i = 0; i < inputEls.length; i++) {
            if (inputEls[i].checked) {
               values.push(inputEls[i].value);
            } 
         }
         return values.join(',');
      }

      function getInputValue(inputEls, type) {
         switch (type) {
            case 'radio':
            case 'checkbox':
               value = getCheckedInputValue(inputEls);
               break;
         
            default:
               value = inputEls[0].value;
         }
         return value;
      }

      function validate(name) {
         const type = userRules[name].type;
         const rules = userRules[name].rules; 
         const inputEls = formEl.querySelectorAll(`[name=${name}]`);
         const formGroup = inputEls[0].closest('.form-group');
         const errorEl = formGroup.querySelector('.form-message');
         let value = getInputValue(inputEls, type);
         let errorMessage;

         // Handle error
         if (!inputEls) return;
         for (let i = 0; i < rules.length; i++) {
            let pos = rules[i].search(':');
            if (pos != -1) {
               const rule = rules[i].substr(0, pos);
               const parameter = rules[i].substr(pos + 1);
               errorMessage = validatorRules[rule](value, parameter);
            }
            else {
               errorMessage = validatorRules[rules[i]](value);
            }

            if (errorMessage) {
               formGroup.classList.add("invalid");
               errorEl.textContent = errorMessage;
               return false;
            } else {
               formGroup.classList.remove("invalid");
               errorEl.textContent = "";
               errorEl.textContent = "";
            }
         }
         return true;
      }

      formEl.onsubmit = function(e) {
         let isValid = true;
         e.preventDefault();
         for (const name in userRules) {
            if (!validate(name)) isValid = false;
         }

         if (isValid) {
            let data = {};
            for (const name in userRules) {
               const type = userRules[name].type;
               const inputEls = formEl.querySelectorAll(`[name=${name}]`);
               let value = getInputValue(inputEls, type);
               data[name] = value;
            }
            console.log(data);
         }
      }
   }

}