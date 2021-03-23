document.addEventListener('DOMContentLoaded', function () {
    var perf = firebase.performance();
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            alert("You are not logged in. Redirecting to sign up page....")
            window.location.replace('./Testing/loginORsignUpStep1.html');
            return
        }else{

            getElderlyProfile(user.uid).then(async (msg) => {
                var name=msg.name;
                var profilePicUrl=msg.profilePicUrl;
                var address=msg.address;
                var unitNo=msg.unitNo;
                if(name==null || profilePicUrl==null || address==null || !name || !profilePicUrl || !address){
                    alert("Your sign up is not completed, Pls complete it. Redirecting to sign up page....")
                    window.location.replace('./Testing/loginORsignUpStep1.html');
                    return
                }

                const urlStr=window.location.href;
                const url=new URL(urlStr);
                const taskId=url.searchParams.get("taskId");
                const taskName=await getTaskDetails(taskId)
                const headerTaskName=document.getElementById('headerTaskName')
                headerTaskName.innerText=headerTaskName.innerText+" "+taskName
            });
        } 
    });
});

async function getElderlyProfile(uid) {
    const getElderlyProfileFB = firebase
        .functions()
        .httpsCallable('tasks-getElderlyProfile');
    let msg = '';
    await getElderlyProfileFB({
        elderlyId: uid,
    }).then((result) => {
        msg = result.data;
		console.log(msg)
    });
    return msg;
}



function getFileDetails() {
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
               const mainCarousel=document.getElementById("main-carousel")
               mainCarousel.innerHTML= mainCarousel.innerHTML+`	<div class="carousel-item active">
               <img src="${downloadURL}" class="d-block w-50" alt="...">
           </div>`
            });
        }
    );
}

async function submitTask() {
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
    window.location.replace(`./statusWaiting.html?taskId=${taskId}`); 
    return msg;
}


async function getTaskDetails(taskId) {
    const getTaskDetailsFB = firebase
        .functions()
        .httpsCallable('tasks-getTaskDetails');
    let resultData = '';
    await getTaskDetailsFB({
        taskId: taskId,
    }).then((result) => {
        resultData=result.data.taskName
        
        return resultData
    });
    return resultData;
}


function goBack() {
    window.history.back();
  }

function displayCarousel(){
    const mainCarousel=document.getElementsById("main-carousel")

}