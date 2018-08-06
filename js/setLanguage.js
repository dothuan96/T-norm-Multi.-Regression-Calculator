$(document).ready(function(){
  $( "#lang-en" ).click(function() {
    $('#lang-jp').removeClass("active");
    $(this).addClass("active");
    // You can also override the language detection, and pass in a language code
    $("[data-localize]").localize("mylanguage", { language: "en" })
  });

  $( "#lang-jp" ).click(function() {
    $('#lang-en').removeClass("active");
    $(this).addClass("active");
    // You can also override the language detection, and pass in a language code
    $("[data-localize]").localize("mylanguage", { language: "jp" })
  });
});
