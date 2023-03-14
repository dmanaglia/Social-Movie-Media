//checks url to know if the page is rendered as login or sign up
const loginPath = window.location.toString().split('/');
const login = loginPath[loginPath.length - 1] * 1;
let passwordCheck1 = false;
let passwordCheck2 = false;

async function loginFormHandler(event){
    event.preventDefault();
    const username = document.getElementById('inputUsername').value;
    const password = document.getElementById('inputPassword1').value;
    //if user is logging in
    if(login){
        const response = await fetch(`/api/users/login`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(response.status === 200){
            document.location.replace(`/dashboard`);
        } else {
            const responseData = await response.json();
            if(response.status === 404){
                document.getElementById('usernameHelp').innerHTML = responseData.message;
                document.getElementById('usernameHelp').style.color = 'red';
            } else if(response.status === 401){
                document.getElementById('password1Help').innerHTML = responseData.message;
                document.getElementById('password1Help').style.color = 'red';
            } else{
                console.log('Unknown error occured');
            }
        }
    }
    //if user is signing up
    if(!login){
        if(passwordCheck1 && passwordCheck2){
            const response = await fetch(`/api/users/`, {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    password
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                
            });
            if(response.status === 200){
                document.location.replace(`/dashboard`);
            } else {
                console.log("oop something went wrong signin up");
            }
        }
    }
}
//updates message to display if first password fullfils requirement of greater than 4
function password1Help(){
    const password = document.getElementById('inputPassword1').value;
    if(password.length < 4){
        document.getElementById('password1Help').style.color = 'red';
        passwordCheck1 = false;
    } else {
        document.getElementById('password1Help').style.color = 'green';
        passwordCheck1 = true;
    }
}
//updates message to display if second password matches first password
function password2Help(){
    const password = document.getElementById('inputPassword1').value;
    const passwordConfirm = document.getElementById('inputPassword2').value;
    if(password != passwordConfirm){
        document.getElementById('password2Help').style.color = 'red';
        passwordCheck2 = false;
    } else {
        document.getElementById('password2Help').style.color = 'green';
        passwordCheck2 = true;
    }
}

document.querySelector('#login-form').addEventListener('submit', loginFormHandler);

if(!login){
    //adds event listeners only when user is signing up
    document.querySelector('#inputPassword1').addEventListener('keyup', password1Help);
    document.querySelector('#inputPassword2').addEventListener('keyup', password2Help);
}

