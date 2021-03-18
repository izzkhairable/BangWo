document.addEventListener('DOMContentLoaded', function () {
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
                addressEl.innerText= addressEl.innerText+address;
                unitNoEl.innerText=unitNoEl.innerText+unitNo;
                const url=`https://www.google.com/maps/embed/v1/place?key=AIzaSyBUcwKDHwnPlhLlJBZCNulc-abORf42qdA&q=${address.split(" ").join("+")},Singapore`
                console.log(url);
                iframeEl.src=url;
            });
            // const urlStr=window.location.href;
            // const url=new URL(urlStr);
            // const taskName=url.searchParams.get("taskname");
            // createTaskStep1(user.uid,taskName);
            // document.getElementById("header-text").innerHTML = "You at home ah?";
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