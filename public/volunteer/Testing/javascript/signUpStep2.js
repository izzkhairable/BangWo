function getFileDetails() {
    let file = document.getElementById('fileInput');
    let txt=''
    if ('files' in file) {
        if (file.files.length == 0) {
            txt = 'Select at least one image';
        } else {
            uploadFile(file.files[0]);
        }
    } else {
        if (file.value == '') {
            txt += 'Select one or more files.';
        } else {
            txt += 'The files property is not supported by your browser!';
            txt += '<br>The path of the selected file: ' + file.value;
        }
    }
    document.getElementById('step2Para').innerHTML+=`<br><b>${txt}</b>`;
}

function uploadFile(file) {
    const storageRef = firebase.storage().ref();
    let step2Para=document.getElementById('step2Para').innerHTML
    var metadata = {
        contentType: 'image/jpeg',
    };

    var uploadTask = storageRef
        .child('images/' + file.name)
        .put(file, metadata);

    uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
            var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            step2Para+='Upload is ' + progress + '% done';
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: 
                step2Para+='Upload is paused';
                    break;
                case firebase.storage.TaskState.RUNNING: 
                step2Para+='Upload is running';
                    break;
            }
        },
        (error) => {
            switch (error.code) {
                case 'storage/unauthorized':
                    break;
                case 'storage/canceled':
                    break;
                case 'storage/unknown':
                    break;
            }
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
               let uploadResult= document.getElementById('uploadResult');
               uploadResult.innerHTML= uploadResult.innerHTML+ downloadURL;

                    document.getElementById('submitBtn').disabled = false;
                    document.getElementById('homeBtn').disabled = true;
                
            });
        }
    );
}

async function submitProfile() {
    document.getElementById('submitBtn').disabled = true;

    await firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            document.getElementById('resultsPara').innerHTML =
                'Please wait updating your profile...';
            await pushProfile(user);
        }
    });
}

async function pushProfile(user) {
    const addNewUserFinalStep = firebase
        .functions()
        .httpsCallable('signUpVolunteer-signUpStep2');

    const profilePicUrl = document.getElementById('uploadResult').innerText;
    const name = document.getElementById('usernameInput').value;
    const msg = await addNewUserFinalStep({
        uid: user.uid,
        name: name,
        profilePicUrl: profilePicUrl,
    }).then((result) => {
        return result.data;
    });
    document.getElementById('resultsPara').innerHTML ='This is your updated profile<br>' + JSON.stringify(msg);
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('homeBtn').disabled = false;
    return msg;
}

function goHome() {
    window.location.replace('./loginORsignUpStep1.html');
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('homeBtn').disabled = true;

    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            window.location.replace('./loginORsignUpStep1.html');
        }
    });
});