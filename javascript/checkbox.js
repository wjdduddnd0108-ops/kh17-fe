//checkbox.js
// - 체크박스 관련된 자바스크립트 코드를 가지는 자바스크립트 전용 팔일
// - pure javascript (VanillaJS)로 개발됨


//지연 실행 코드
window.addEventListener("load", function(){
    //전체 선택
    var allCheckboxes = document.querySelectorAll(".check-all");
    for(var i=0; i < allCheckboxes.length; i++) {
        allCheckboxes[i].addEventListener("input", function(){
            //this == 체크된 전체선택 체크박스
            var checkboxes = document.querySelectorAll(".check-item");
            for(var i=0; i < checkboxes.length; i++) {
                checkboxes[i].checked = this.checked;
            }
            checkItem();
        });
    }

    //필수 선택
    var requiredCheckboxes = document.querySelectorAll(".check-required");
    for(var i=0; i < requiredCheckboxes.length; i++) {
        requiredCheckboxes[i].addEventListener("input", function(){
            //this == 체크된 필수선택 체크박스
            var checkboxes = document.querySelectorAll(".check-item-required");
            for(var i=0; i < checkboxes.length; i++) {
                checkboxes[i].checked = this.checked;
            }
            checkItem();
        });
    }

    //개별 항목
    var items = document.querySelectorAll(".check-item");
    for(var i=0; i < items.length; i++) {
        items[i].addEventListener("input", checkItem);
    }

    function checkItem() {
        var checkboxes = document.querySelectorAll(".check-item");//전체 체크박스
        var checkedCheckboxes = document.querySelectorAll(".check-item:checked");//체크된 체크박스
        var allChecked = checkboxes.length == checkedCheckboxes.length;//전체 체크여부

        var requiredCheckboxes = document.querySelectorAll(".check-item-required");//필수 체크박스
        var checkedRequiredCheckboxes = 
                    document.querySelectorAll(".check-item-required:checked");//체크된 필수 체크박스
        var requiredChecked = requiredCheckboxes.length == checkedRequiredCheckboxes.length;//필수 체크여부

        //allChecked에 따라 전체선택 체크박스를 처리
        var all = document.querySelectorAll(".check-all");
        for(var i=0; i < all.length; i++) { 
            all[i].checked = allChecked;
        }

        //requiredChecked에 따라 필수 체크박스를 처리
        var required = document.querySelectorAll(".check-required");
        for(var i=0; i < required.length; i++) {
            required[i].checked = requiredChecked;
        }
    }
});