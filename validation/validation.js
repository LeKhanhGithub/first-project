function validator(option) {
    var selectorRule = {};
    var formElement = document.querySelector(option.form);
    var kt =1;

// ham validate mang theo key selector========================================================

    function validate (inputElement, rule) {
        
        var rules = selectorRule[rule.selector];
        var errorElement =  inputElement.parentElement.querySelector(option.formMessage);

        for(var i = 0; i < rules.length; i++ ){
            var errorMessage = rules[i](inputElement.value);
            console.log(errorMessage, rules[i]);
            if(errorMessage){
                break;
            }
        }
        

        if(errorMessage){
            errorElement.innerText = errorMessage;
            errorElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }

        return !errorMessage;
        // if(errorMessage){
        //     return false;
        // } else{
        //     return true;
        // }

    }

// thuc hien hanh dong submit===============================================================

    if(formElement){
        formElement.onsubmit = function(e){
            e.preventDefault();

            var isFormValid = true;
            
            option.rules.forEach (function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                console.log(isValid);
                if(!isValid){
                    isFormValid = false;
                }
            });
            console.log(isFormValid)

            if(isFormValid){
                if(typeof option.onSubmit === 'function'){ // submit theo javascript

//                  var formValue = Array.from(enableInput).reduce(function(values, input){
//                      values[input.name] = input.value;
//                      return values;
//                  }, {});
 
                    var enableInput = formElement.querySelectorAll('[name]');
                    var formValue = Array.from(enableInput).reduce(function(values, input){
                            values[input.name] = input.value;
                            return values;
                        }, {});
                    console.log(formValue);
                   
                    // option.onSubmit(formValue);
                    
                } else { // submit mac dinh theo trinh duyet
                    console.log('co loi');
                } 
            }     
        }
        
    }

 // thuc hien hanh dong blur va onchange theo validate tung rule=================================
 
    if(formElement){
        
        option.rules.forEach (function (rule){
            var inputElement = formElement.querySelector(rule.selector);

            if(Array.isArray(selectorRule[rule.selector])){
                selectorRule[rule.selector].push(rule.test);
    
            } else {
                selectorRule[rule.selector] = [rule.test];
            }
       
            if(inputElement){

                var errorElement =  inputElement.parentElement.querySelector(option.formMessage);
                
                inputElement.onblur = function (){
                    validate(inputElement, rule);
                }

                inputElement.oninput = function(){
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
                         
            }

        });
        
    }

}

// cac rule duoc dat tuy tung selector truyen vao ung voi moi the input=======================

validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : 'vui long nhap truong nay';
        }
    };
}
validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : 'truong nay phai la email';
        }
    }
}
validator.minLength = function(selector, min){
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : 'nhap vao it nhat ' + min + ' ky tu';
        }
    }
}
validator.isConfirmed = function(selector, pass){
    return {
        selector: selector,
        test: function(value){
            return value === pass() ? undefined : 'gia tri nhap vao khong dung';
        }
    }
}