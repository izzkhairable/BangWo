let taskName=""
let imageCount=0
document.addEventListener('DOMContentLoaded', function () {
    const coverDiv=document.getElementById('coverDiv');
    coverDiv.style.display='block';
    var perf = firebase.performance();
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            alert("You are not logged in. Redirecting to sign up page....")
            window.location.replace('./Login/loginORsignUpStep1.html');
            return
        }else{
            getElderlyProfile(user.uid).then(async (msg) => {
                var name=msg.name;
                var profilePicUrl=msg.profilePicUrl;
                var address=msg.address;
                var unitNo=msg.unitNo;
                if(name==null || profilePicUrl==null || address==null || !name || !profilePicUrl || !address){
                    alert("Your sign up is not completed, Pls complete it. Redirecting to sign up page....")
                    window.location.replace('./Login/loginORsignUpStep1.html');
                    return
                }
                const taskNameInput=document.getElementById('allTaskName');
                taskNameInput.style.display = "none";
                const urlStr=window.location.href;
                const url=new URL(urlStr);
                const taskId=url.searchParams.get("taskId");
                taskName=await getTaskDetails(taskId)
                if(taskName==null){
                    taskName="other stuff"
                    taskNameInput.style.display = "block";
                }
                const headerTaskName=document.getElementById('headerTaskName')
                headerTaskName.innerText=headerTaskName.innerText+" "+taskName
            });
        } 
    });

    coverDiv.style.display='none';
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
    document.getElementById('step3Para').innerHTML=''
    if ('files' in files) {
        if (files.files.length == 0) {
            txt = 'Select at least one image';
        } else {
     
            if(imageCount+files.files.length>4){
                console.log("I am running")
                document.getElementById('step3Para').innerHTML=`<div class="alert alert-danger" role="alert">
                Maximum 4 Photos Only! Please Select Image Again.
              </div>`
                return
            }
         
            for (var i = 0; i < files.files.length; i++) {
                document.getElementById('step3Para').innerHTML=`
                <div class="spinner-border" role="status">
                    <span class=""></span>
                </div>`
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
                imageCount+=1
               const mainCarousel=document.getElementById("uploadedImagesDiv")
               document.getElementById('step3Para').innerHTML=``
            
               if(imageCount==1){
                mainCarousel.innerHTML=`
                <div class="w-25" id="image1">
                    <div class="card border-dark image rounder" id="imgDiv${imageCount}">
                        <img src="${downloadURL}" class="card-img photosUrl" alt="...">
                        <div class="img-wrap">
                            <button id="clear" class="btn btn-secondary btn-sm rounder" onclick="deleteImage('image${imageCount}')">X</button>
                        </div>
                    </div>
                </div>
                <div class="w-25" id="image2">
                </div>
                <div class="w-25" id="image3">
                </div>
                <div class="w-25" id="image4">
                </div>
                `
               }else{
                var add = "image"+imageCount.toString();
                // var add = add.concat(toString(imageCount));
                // console.log(toString(imageCount));
                document.getElementById(add).innerHTML=`
                <div class="card border-dark image rounder" id="imgDiv${imageCount}">
                    <img src="${downloadURL}" class="card-img photosUrl" alt="...">
                    <div class="img-wrap">
                        <button id="clear" class="btn btn-secondary btn-sm rounder" onclick="deleteImage('image${imageCount}')">X</button>
                    </div>
                </div>
                `
                // mainCarousel.innerHTML= mainCarousel.innerHTML+'
                // <div class="img-wrap w-25 mx-3 mb-2" id="imgDiv${imageCount}">
                // <button id="clear" class="btn btn-secondary btn-sm" onclick="deleteImage('imgDiv${imageCount}')">X</button>
                // <img src="${downloadURL}" class="w-100 photosUrl" alt="...">
                // </div>
                // `
               }
            });
        }
    );
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

async function submitTask() {
    document.getElementById('resultsPara').innerHTML ='Please wait creating your task request..';
    await createTaskStep3();
}

async function createTaskStep3() {
    const createTaskStep3FB = firebase
        .functions()
        .httpsCallable('tasks-createTaskStep3');
    const createTaskStep3FBwName = firebase
        .functions()
        .httpsCallable('tasks-createTaskStep3wName');
    const messageInput = document.getElementById('messageInput').value;
    const photosUrl=document.getElementsByClassName('photosUrl');

    let photosUrlArr=[]
    console.log(photosUrl)
    for(photoUrl of photosUrl){
        photosUrlArr.push(photoUrl.src)
    }
    const urlStr=window.location.href;
    const url=new URL(urlStr);
    const taskId=url.searchParams.get("taskId");
    let msg;
    if(taskName=="other stuff"){
        const taskNameInput=document.getElementById('taskNameInput')
        let taskNameValue=taskNameInput.value;
         msg = await createTaskStep3FBwName({
            taskId: taskId,
            taskDescription: messageInput,
            taskPhotoUrls:photosUrlArr,
            taskName: taskNameValue
        }).then((result) => {
            return result.data;
        });
    }else{
         msg = await createTaskStep3FB({
            taskId: taskId,
            taskDescription: messageInput,
            taskPhotoUrls:photosUrlArr,
        }).then((result) => {
            return result.data;
        });
    }

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
