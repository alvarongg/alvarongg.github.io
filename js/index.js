function updateActiveNav(el){
    $('.nav-item').removeClass('active');
    $(el).addClass('active');
}

function updateSectionNav(index){
    $('.nav-item').removeClass('active');
    $(document.querySelectorAll('.nav-item')[index]).addClass('active');
}