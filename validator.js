const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Object validator
function Validator(selector) {
   const formEl = $(selector);
   console.log(formEl)
   if (formEl) {
      inputEls = formEl.querySelectorAll('[name][rule]');
      console.log(inputEls)


   }
}