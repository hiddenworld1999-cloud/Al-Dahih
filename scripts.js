/* حماية النسخ والاختيار */
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("selectstart", e => e.preventDefault());
document.addEventListener("keydown", e => {
  if (e.ctrlKey && ['c','s','p','u'].includes(e.key.toLowerCase())) e.preventDefault();
});

/* تنقل بين الصفحات */
function navigate(page) {
  window.location.href = page;
}