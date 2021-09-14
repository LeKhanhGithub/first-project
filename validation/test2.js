validator({
    form: '#form-1',
    formMessage: '.form-message',
    rules: [
      validator.isRequired('#fullname'),
      validator.isRequired('#email'),
      validator.isEmail('#email'),
      validator.minlength('#password', 6),
      validator.isRequired('#password_confirmation'),
      validator.isConfirmed('#password_confirmation', function(){
        return document.querySelector('#form-1 #password').value;
      }, 'gia tri nhap lai khong chinh xac'),
      
    ]
    
  })

  function validator(option){
    var selectorRule = {};
    var formElement = document.querySelector(option.form);
    
    if(formElement){
        option.rules.forEach (function (rule){
            var inputElement = formElement.querySelector(rule.selector);

            if(Array.isArray(selectorRule[rule.selector])){
                selectorRule[rule.selector].push(rule.test);
            } else {
                selectorRule[rule.selector] = [rule.test];
            }
            
            if(inputElement){
                inputElement.onblur = function(){
                    var errorMessage  = rule.test(inputElement.value);
                    var errorElement = inputElement.parentElement.querySelector(option.formMessage);

                    var rules = selectorRule[rule.selector];
                    for(var i = 0; i < rules.length; i++){
                        errorMessage = rules[i](inputElement.value);
                        if(errorElement){
                            break;
                        }
                    }

                    if(errorMessage){
                        errorElement.innerText = errorMessage;
                        inputElement.parentElement.classList.add('invalid');
                    } else {
                        errorElement.innerText = '';
                        inputElement.parentElement.classList.remove('invalid');
                    
                    }
                } 
            }
        });
    }

}

validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function(value){
            return value ? undefined : 'vui long nhap truong nay';
        }
    };
}
validator.isEmail = function(selector) {
    return{
        selector: selector,
        test: function(value){
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : 'truong nay phai la email';
        }
    };
}
validator.minlength = function(selector, min){
    return {
        selector: selector,
        test: function(value){
            return  value.length >= min ? undefined : 'nhap toi thieu ' + min + ' ky tu';
        }
    }
}
validator.isConfirmed = function(selector, inputValue, message){
    return {
        selector: selector,
        test: function(value){
            return value === inputValue() ? undefined : message;
        }
    }
}