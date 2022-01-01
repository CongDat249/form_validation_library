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

   function validate(inputEl, rules) {
      const formGroup = inputEl.closest('.form-group');
      const errorEl = formGroup.querySelector('.form-message');
      let errorMessage;

      if (!inputEl) return;
      for (let i = 0; i < rules.length; i++) {
         let pos = rules[i].search(':');
         if (pos != -1) {
            const rule = rules[i].substr(0, pos);
            const parameter = rules[i].substr(pos + 1);
            errorMessage = validatorRules[rule](inputEl.value, parameter);
         }
         else {
            errorMessage = validatorRules[rules[i]](inputEl.value);
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

   if (formEl) {
      inputEls = formEl.querySelectorAll('[name][rules]');

      inputEls.forEach((element) => {
         let rules = element.getAttribute('rules').split('|');

         element.onblur = function() {
            validate(this, rules);
         }

         element.oninput = function() {
            const formGroup = this.closest('.form-group');
            const errorEl = formGroup.querySelector('.form-message');
            formGroup.classList.remove("invalid");
            errorEl.textContent = "";
         }
      })

      formEl.onsubmit = function(e) {
         let isValid = true;
         e.preventDefault();
         inputEls.forEach(element => {
            let rules = element.getAttribute('rules').split('|');
            if (!validate(element, rules)) isValid = false; 
         })
         if (isValid) {
            let data = Array.from(inputEls).reduce(function(data, element) {
               data[element.name] = element.value; 
               return data;
            }, {});
            console.log(data);
         }
      }
   }

}