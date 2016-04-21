$(document).ready(function(){
  $("#rate").raty({
    half: true,
    click: function(score, evt) {
      $("#review_point").val(score);
    }
  });

  $("#show-score").raty({
    readOnly: true,
    score: $("#show-score").attr("data-score")
  });

  $(".show-point").raty({
    readOnly: true,
    score: function() {
      return $(this).data("rate");
    }
  });

  $("#choose-file").hide();
  $(".upload-img img").click(function(){
    $("#choose-file").click();
  });

  $("#choose-file").change(function(){
    $("#selected-file-name").text($(this).val());
    $(".form-actions").css("padding-top", "8px");
  });

  $(".form-actions input").click(function(){
    var notice = "";
    if($(".text-area-wrapper #review_content").val().trim().length === 0){
      notice += "Review content can not empty \n";
    }
    if($("#review_point").val().trim().length === 0){
        notice += "You have not rated address yet \n";
      }
    if(notice.length > 0){
      alert(notice);
      return false;
    }
  });

  $(".icon-colspan i:last-child").hide();

  $(".icon-colspan .glyphicon-menu-up").click(function(){
    $(this).closest(".review").find(".review-content, .list-features, .edit_review, .image-review, .show-point, .comment-list, .new_comment, a[rel='next']").hide();
    $(this).hide();
    $(this).nextAll("i").show();
  });

  $(".icon-colspan .glyphicon-menu-down").click(function(){
    $(this).closest(".review").find(".review-content, .list-features, .edit_review, .image-review, .show-point, .comment-list, .new_comment, a[rel='next']").show();
    $(this).hide();
    $(this).prevAll("i").show();
  });
});
