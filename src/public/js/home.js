AOS.init();
$(function () {
  $(document).scroll(function () {
    $(".navbar").toggleClass(
      "scrolled",
      $(this).scrollTop() > $(".navbar").height()
    );
  });
});
