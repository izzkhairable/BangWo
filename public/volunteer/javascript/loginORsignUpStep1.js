const signOutBtn=`<button id="signOutBtn" onclick="signMeOut()">Sign Out</button>`

const step2btn=` <button style="margin-top:10px " id="secondStepBtn" >
                        <a style="background:initial; padding:initial; width:initial; height:initial; color:black"  href="./signUpStep2.html">
                            Go to Step 2) Add Name & Profile Pic
                        </a>
                 </button>`

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
        .httpsCallable('signUpVolunteer-loginORsignUpStep1');
    let msg = '';
    await loginORsignUpStep1FB({
        uid: uid,
        phoneNo: phoneNo,
    }).then((result) => {
        if (result.data.profileData.profilePicUrl) {
            document.getElementById('secondStepBtn').remove();
        }

        if (result.data.profileData.address) {
            document.getElementById('ThirdStepBtn').remove();
        }
        msg = result.data;
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
        firebase.auth().onAuthStateChanged( function (user) {
            if (user) {
               checkAccountType(user.uid).then((result)=>{
                    if(result=='elderly'){
                        alert("You have an existing elderly account. Redirecting to elderly page....")
                        window.location.replace('../elderly/loginORsignUpStep1.html');
                        return

                    }else{
                        document.getElementById(
                            'mainContainer'
                        ).innerHTML = signOutBtn+step2btn
        
                    
                        
                        loginORsignUpStep1(user.phoneNumber, user.uid).then((msg) => {
                            document.getElementById(
                                'resultsPara'
                            ).innerText = JSON.stringify(msg);
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

