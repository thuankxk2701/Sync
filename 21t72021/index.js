x = document.querySelector('.menu .icon2 .fa.fa-bars');
x.addEventListener('click',function(){
  console.log('clik')
  document.querySelector('.left').classList.toggle('turn_right');
});