const codes = {

"A7F3": "محمد احمد",
"R5K8": "دنيا سيد",
"T6R9": "تهاني رجب حسن"

};

/* تسجيل الدخول */
function checkCode(){

const code = document.getElementById("codeInput").value.trim();

if(codes[code]){
sessionStorage.setItem("studentName", codes[code]);
window.location.href="index.html";
}
else{
alert("الكود غير صحيح");
}

}