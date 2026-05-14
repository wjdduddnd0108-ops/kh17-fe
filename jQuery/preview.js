//이미지 미리보기 처리 (개수 무관)
$(function(){
    $(".preview-input").on("input", function(){
        //미리보기를 생성하기 전에 기존에 .preview-area에 있는 이미지를 제거
        // - 있을지 없을지 모르며 있다면 URL.revokeObjectURL()을 써서 회수까지 해줘야함
        // - jQuery에서 제공하는 반복 함수 each를 사용 (for보다 편함)
        $(".preview-area").find("img").each(function(){
            //this == 현재 순서의 이미지
            //이미지 주소 회수 + 이미지 태그 삭제 (or 영역 비우긴)
            var address = $(this).attr("src");
            URL.revokeObjectURL(address);//자원회수
            // $(this).remove();//이 태그 삭제 이미지 하나 지우기
        });
        $(".preview-area").empty();//영역 비우기

        //미리보기 생성
        if(this.files.length > 0) {//파일 선택
            for(var i=0; i < this.files.length; i++){//선택한 파일수만큼
            //이미지를 만들어서 .preview-area에 추가
                var img = $("<img>")
                            .addClass("image-shadow image-round")
                            .attr("src", URL.createObjectURL(this.files[i]))
                            .prop("width", 100);
                $(".preview-area").append(img);
            }
        }

        else{//파일 선택 취소 -> 미리보기 제거

        }
    });
});

