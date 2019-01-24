$(function() {
    var str = location.pathname.replace('/board/page=','');
    $('#'+str).addClass('active');
});
$(function() {
    var str = location.pathname.replace('/board/university/page=','');
    $('#'+str).addClass('active');
});