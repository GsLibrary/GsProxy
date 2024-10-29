document.addEventListener("DOMContentLoaded", (event) => {
    const inp = getId("inpText");
    const go = getId("inpSub");

    go.addEventListener("click", function(){
        var url = inp.value;
        var urlEncode = btoa(url);
        var toLoc = `l/${urlEncode}`
        // alert(toLoc);
        location.href = `${toLoc}`;
    })
});
