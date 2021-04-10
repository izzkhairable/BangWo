let imageCount=0
function getFileDetails() {
    let file = document.getElementById('fileInput');
    let txt=''
    if ('files' in file) {
        if (file.files.length == 0) {
            txt = 'Select at least one image';
        } else {
            document.getElementById('step2Para').innerHTML=`
            <div class="spinner-border" role="status">
                <span class=""></span>
            </div>`
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
                imageCount+=1
                const mainCarousel=document.getElementById("uploadedImagesDiv")
                document.getElementById('step2Para').innerHTML=``
             
                if(imageCount==1){
                 mainCarousel.innerHTML=`
                 <div class="img-wrap w-25 mx-3 mb-2" id="imgDiv${imageCount}">
                 <button id="clear" class="btn btn-secondary btn-sm" onclick="deleteImage('imgDiv${imageCount}')">X</button>
                 <img src="${downloadURL}" class="w-100 photosUrl" alt="...">
                 </div>
                 `
                }
            });
        }
    );
}

async function submitProfile() {
    await firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            document.getElementById('resultsPara').innerHTML =
                'Please wait updating your profile...';
            await pushProfile(user);
        }
    });
}

function deleteImage(el) {
    document.getElementById(el).remove()
    //document.getElementById(el).innerHTML=``
    imageCount-=1;
    if(imageCount==0){
        document.getElementById("uploadedImagesDiv").innerHTML=`
        <div class="w-25">
            <div class="card border-dark image rounder">
                <label for="fileInput" id="inputGroupFileAddon04">
                    <div class="card-img-overlay text-center">
                        <i class="fas fa-plus card-text center"></i>
                    </div>
                </label>	
            </div>
        </div>
        <div class="col d-flex">
            <div class="">
            </div>
            <div class="">
            </div>
            <div class="">
            </div>
        </div>
        `
       }
  }

async function pushProfile(user) {
    const addNewUserFinalStep = firebase
        .functions()
        .httpsCallable('signUpVolunteer-signUpStep2');
    const photoUrl=document.getElementsByClassName('photosUrl')[0].src;

    const name = document.getElementById('usernameInput').value;
    const msg = await addNewUserFinalStep({
        uid: user.uid,
        name: name,
        profilePicUrl: photoUrl,
    }).then((result) => {
        return result.data;
    });
    goAddress();
    return msg;
}

function goAddress() {
    window.location.replace('./loginORsignUpStep1.html');
}

async function finishUp(){
    await submitProfile()
}

document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            window.location.replace('./loginORsignUpStep1.html');
        }
    });
});