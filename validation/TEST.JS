function validator(options) {

    var selectorRule = {};

    function validate(inputElement, rule){
        var errorMessage = rule.test1(inputElement.value);
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var rules = selectorRule[rule.selector];
            for(var i = 0; i < rules.length; i++){
                errorMessage = rules[i](inputElement.value);
                if(errorElement) break;
            }
                   
            if(errorMessage){
                errorElement.innerText = errorMessage;
                inputElement.parentElement.classList.add('invalid');
            } else {
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('invalid');
            }
    }

    var formElement = document.querySelector(options.form);
    if(formElement){
        options.rules.forEach(function (rule) {
           var inputElement = formElement.querySelector(rule.selector);
           
           if(Array.isArray(selectorRule[rule.selector])){
            selectorRule[rule.selector].push(rule.test1);
         } else {
            selectorRule[rule.selector] = [rule.test1];
         }
        
           
           if(inputElement){
               inputElement.onblur = function(){
                   validate(inputElement, rule);
                   
                   
               }
           }

           inputElement.oninput = function(){
            var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
           }
        });
        
    }
    console.log(selectorRule);
}
    
validator.isRequired = function(selector, message) {
    
    return {
        selector: selector,
        test1: function(value){
            return value.trim() ? undefined : message|| 'vui long nhap truong nay';
        }
    };
}
    
validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test1: function(value){
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : message|| 'truong nay phai la email';
        }
    };
}
validator.minLength = function(selector, min, message) {
    return {
        selector: selector,
        test1: function(value){
            return value.length >= min ? undefined : message|| 'vui long nhap toi thieu '+ min +' ki tu';
        }
    };
}
validator.isConfirmed = function(selector, value2, message){
    return{
        selector: selector,
        test1: function(value){
            return value === value2() ? undefined : message|| 'gia tri nhap vao khong chinh xac';
        }
    }
}


validator({
    form: '#form-1',
    errorSelector: '.form-message',
    rules: [
    validator.isRequired('#fullname', 'vui long nhap ten day du cua ban'),
    validator.isRequired('#email'),
    validator.isEmail('#email'),
    validator.minLength('#password', 6),
    validator.isRequired('#password_confirmation'),
    validator.isConfirmed('#password_confirmation', function () {
      return document.querySelector('#form-1 #password').value;
    }, 'mat khau nhap lai khong chinh xac')
    ],
    onSubmit: function(data){
        console.log(data);
    }
})