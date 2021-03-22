document.addEventListener('DOMContentLoaded', function () {
    var perf = firebase.performance();
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            alert("You are not logged in. Redirecting to sign up page....")
            window.location.replace('./Testing/loginORsignUpStep1.html');
            return
        }else{

            getElderlyProfile(user.uid).then((msg) => {
                var name=msg.name;
                var profilePicUrl=msg.profilePicUrl;
                var address=msg.address;
                var unitNo=msg.unitNo;
                if(name==null || profilePicUrl==null || address==null || !name || !profilePicUrl || !address){
                    alert("Your sign up is not completed, Pls complete it. Redirecting to sign up page....")
                    window.location.replace('./Testing/loginORsignUpStep1.html');
                    return
                }
                const iframeEl=document.getElementById("iframeEl");
                const addressEl=document.getElementById("addressEl");
                const unitNoEl=document.getElementById("unitNoEl");

                
                addressEl.innerHTML= addressEl.innerHTML+`<p id="addresDataEl">${address}</p>`;
                unitNoEl.innerHTML=unitNoEl.innerHTML+`<p id="unitNoDataEl">${unitNo}</p>`;
                const url=`https://www.google.com/maps/embed/v1/place?key=AIzaSyBUcwKDHwnPlhLlJBZCNulc-abORf42qdA&q=${address.split(" ").join("+")},Singapore`
                console.log(url);
                iframeEl.src=url;
                // const winUrlStr=window.location.href;
                // const winUrl=new URL(winUrlStr);
                // const taskid=winUrl.searchParams.get("taskId");
                // document.getElementById("aNotHome").href=`./taskDescription.html?taskid=${taskid}`;
                document.getElementById("header-text").innerHTML = "So you at home ah?";
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

async function createTaskStep2A() {
    const createTaskStep2FB = firebase
        .functions()
        .httpsCallable('tasks-createTaskStep2');

    const urlStr=window.location.href;
    const url=new URL(urlStr);
    const taskId=url.searchParams.get("taskId");
    const address=document.getElementById("addressEl").innerText;
    const unitNo=document.getElementById("unitNoEl").innerText;

    await createTaskStep2FB ({
        taskId: taskId,
        address: address,
        unitNo: unitNo
    }).then((result) => {
        console.log(result)
        console.log(result)
        // window.location.replace(`./taskDescription.html?taskId=${taskId}`)
    });
    return
}