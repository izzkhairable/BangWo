document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
                window.location.replace('./loginORsignUpStep1.html'); 
                return
        }
    });
    document.getElementById('submitBtn').disabled = true;
});

function getFileDetails() {
    document.getElementById('uploadBtn').disabled=true;
    let files = document.getElementById('fileInput');
    let txt=''
    if ('files' in files) {
        if (files.files.length == 0) {
            txt = 'Select at least one image';
        } else {
            for (var i = 0; i < files.files.length; i++) {
                uploadFile(files.files[i]);
            }
            
        }
    } else {
        if (files.value == '') {
            txt += 'Select one or more files.';
            document.getElementById('step3Para').innerHTML+=`<br><b>${txt}</b>`;
        } else {
            txt += 'The files property is not supported by your browser!';
            txt += '<br>The path of the selected file: ' + file.value;
            document.getElementById('step3Para').innerHTML+=`<br><p>${txt}</p>`;
        }
    }
  
}

function uploadFile(file) {
    const storageRef = firebase.storage().ref();
    let step3Para=document.getElementById('step3Para').innerHTML
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
            step3Para+='Upload is ' + progress + '% done';
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: 
                step3Para+='Upload is paused';
                    break;
                case firebase.storage.TaskState.RUNNING: 
                step3Para+='Upload is running';
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
               uploadResult.innerHTML=uploadResult.innerHTML+'<b>Your task photos have been uploaded to the URL below:</b><br>';
               uploadResult.innerHTML= uploadResult.innerHTML+ `<p class="photosUrl">${downloadURL}</p>`;
                if (document.getElementById('messageInput').value !== '' ||document.getElementById('messageInput').value !== null) {
                    document.getElementById('submitBtn').disabled = false;
                    document.getElementById('uploadBtn').disabled=false;
                }
            });
        }
    );
}

async function submitTask() {
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('resultsPara').innerHTML ='Please wait creating your task request..';
    await createTaskStep3();
}

async function createTaskStep3() {
    const createTaskStep3FB = firebase
        .functions()
        .httpsCallable('tasks-createTaskStep3');
    const messageInput = document.getElementById('messageInput').value;
    const photosUrl=document.getElementsByClassName('photosUrl');

    let photosUrlArr=[]
    console.log(photosUrl)
    for(photoUrl of photosUrl){
        console.log(photoUrl.innerText, "hello")
        photosUrlArr.push(photoUrl.innerText)
    }
    const urlStr=window.location.href;
    const url=new URL(urlStr);
    const taskId=url.searchParams.get("taskId");

    const msg = await createTaskStep3FB({
        taskId: taskId,
        taskDescription: messageInput,
        taskPhotoUrls:photosUrlArr,
    }).then((result) => {
        return result.data;
    });
    document.getElementById('submitBtn').false = true;
    window.location.replace(`./statusWaiting.html?taskId=${taskId}`); 
    return msg;
}