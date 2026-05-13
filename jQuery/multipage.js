//멀티페이지 구현을 수행하는 라이브러리 (jQuery 의존성이 존재)

$(function(){
    //[1] 1페이지 빼고 다 숨김
    $(".page").hide().first().show();
    calculateGauge();

    //[2] 다음버튼을 누르면 현재 .page 숨기고 다음 .page를 보여준다
    $(".btn-next").on("click", function(){
        $(this).closest(".page").hide().next(".page").show();//가장 가까운 .page
        calculateGauge();
    });

    //[3] 이전버튼을 누르면 현재 .page 숨기고 이전 .page를 보여준다
    $(".btn-prev").on("click", function(){
        $(this).closest(".page").hide().prev(".page").show();
        calculateGauge();
    });

    // progressbar 처리
    // [1] 처음에 .gauge의 폭을 설정
    //$(".progressbar > .gauge").css("width", "20%");
    //$(".progressbar").find(".gauge").css("width", 100 / $(".page").length +"%");

    //(+추가) 보여지는 페이지의 위치를 계산
    function calculateGauge() {
        if($(".progressbar").length == 0) return;

        var current = $(".page:visible");//보여지는 페이지를 선택
        var page = $(".page").index(current) + 1;//전체 페이지 중 몇 번째 index인지 계산
        var percent = page * 100 / $(".page").length;
        $(".progressbar").find(".gauge").css("width", percent+"%");
    }
});