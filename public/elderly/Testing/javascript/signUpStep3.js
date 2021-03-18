function goHome() {
    window.location.replace('./loginORsignUpStep1.html');
}

async function submitAddress() {
    await firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            document.getElementById('resultPara').innerHTML =
                'Please wait updating your profile...';
            await pushAddress(user);
        }
    });
}

async function pushAddress(user) {
    const addNewUserFinalStep = firebase
        .functions()
        .httpsCallable('signUpElderly-signUpStep3');
    const address = document.getElementById('addressInput').value;
    const unitNo = document.getElementById('unitNoInput').value;
    const msg = await addNewUserFinalStep({
        uid: user.uid,
        address: address,
        unitNo: unitNo,
    }).then((result) => {
        return result.data;
    });
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('homeBtn').disabled = false;
    document.getElementById('resultPara').innerHTML ='Here is your fully completed profile<br>' + JSON.stringify(msg);
    return msg;
}

document.addEventListener('DOMContentLoaded', function () {
    let app = firebase.app();
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            window.location.replace('./loginORsignUpStep1.html');
        }
    });
    document.getElementById('homeBtn').disabled = true;
});

