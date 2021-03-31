const signOutBtn=`<button class="btn btn-dark" id="signOutBtn" onclick="signMeOut()">Sign Out</button>`

const step2btn=`      <a href="./signUpStep2.html">
                        <button class="btn btn-dark" id="secondStepBtn" >
                            Add Name & Profile Picture
                        </button>
                        </a>`

const step3btn=`
                    <a  href="./signUpStep3.html">
                        <button class="btn btn-dark" id="ThirdStepBtn" >
                        Add Home Address
                        </button>
                    </a>
                `

const addTaskBtn=`
<a href="../main-senior.html">
<button class="btn btn-primary">
   Add New Task
</button>
</a>
`

function signMeOut() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            alert('Successfully Sign Out!');
            document.getElementById('signOutBtn').remove();
            location.reload();
        })
        .catch((error) => {
            document.getElementById("resultsPara").innerText=error.toString()
        });
}

async function loginORsignUpStep1(phoneNo, uid) {
    const loginORsignUpStep1FB = firebase
        .functions()
        .httpsCallable('signUpElderly-loginORsignUpStep1');
    let msg = '';
    await loginORsignUpStep1FB({
        uid: uid,
        phoneNo: phoneNo,
    }).then((result) => {
        console.log(result)
        if (result.data.profileData.profilePicUrl) {
            document.getElementById('secondStepBtn').remove();
            document.getElementById('mainContainer').innerHTML += step3btn;
        }

        if (result.data.profileData.address) {
            document.getElementById('ThirdStepBtn').remove();
            document.getElementById('mainContainer').innerHTML+=addTaskBtn;
        }
        if(result.data.isSignUpCompleted){
            msg="Your profile is completed!"
        }else{
            msg="Your profile is not completed!"
        }
    });

    return msg;
}


async function checkAccountType(uid){
    const checkAccountType1FB = firebase
        .functions()
        .httpsCallable('checkAccountType-checkAccountType');
    let msg = '';
    await checkAccountType1FB({
        uid: uid
    }).then((result) => {
        msg = result.data;
    });
    return msg;
}

document.addEventListener('DOMContentLoaded', function () {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                checkAccountType(user.uid).then((result)=>{
                    if(result=='volunteer'){
                        alert("You have an existing volunteer account. Redirecting to elderly page....")
                        window.location.replace('../volunteer/loginORsignUpStep1.html');
                        return
                
                    }else{
                        document.getElementById(
                            'mainContainer'
                        ).innerHTML = signOutBtn+step2btn
                
                    
                        
                        loginORsignUpStep1(user.phoneNumber, user.uid).then((msg) => {
                            document.getElementById(
                                'resultsPara'
                            ).innerText = msg;
                        });
                    }
                })
            } else {
                var ui = new firebaseui.auth.AuthUI(firebase.auth());
                ui.start('#mainContainer', {
                    signInOptions: [
                        {
                            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                            recaptchaParameters: {
                                type: 'image',
                                size: 'invisible',
                                badge: 'bottomleft',
                            },
                            defaultCountry: 'SG',
                        },
                    ],
                });
            }
        });
});

