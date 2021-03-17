document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
                window.location.replace('./loginORsignUpStep1.html'); 
                return
        }else{
            const urlStr=window.location.href;
            const url=new URL(urlStr);
            const taskId=url.searchParams.get("taskId");
            const elderlyId=taskId.split('-')[1]
            getElderlyProfile(elderlyId);
        } 
    });
});

async function getElderlyProfile(elderlyId) {
    const getElderlyProfileFB = firebase
        .functions()
        .httpsCallable('tasks-getElderlyProfile');
    let resultData = '';
    await getElderlyProfileFB({
        elderlyId: elderlyId,
    }).then((result) => {
        console.log(result)
        const fullAddressContainer=document.getElementById('fullAddressContainer');
        fullAddressContainer.innerHTML=fullAddressContainer.innerHTML+`<p>Address: <a id="addressData">${result.data.address}</a></p>`
        fullAddressContainer.innerHTML=fullAddressContainer.innerHTML+`<p>Unit No: <a id="unitNoData">${result.data.unitNo}</a></p>`
    });
    console.log(resultData)
    return resultData;
}


async function createTaskStep2A() {
    const createTaskStep2FB = firebase
        .functions()
        .httpsCallable('tasks-createTaskStep2');

    const urlStr=window.location.href;
    const url=new URL(urlStr);
    const taskId=url.searchParams.get("taskId");
    const address=document.getElementById("addressData").innerText;
    const unitNo=document.getElementById("unitNoData").innerText;

    await createTaskStep2FB ({
        taskId: taskId,
        address: address,
        unitNo: unitNo
    }).then((result) => {
        console.log(result)
        window.location.replace(`./createNewTaskStep3.html?taskId=${taskId}`)
    });
    return
}
