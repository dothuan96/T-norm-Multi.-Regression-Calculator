var countPos=0;       //count the position of image on screen in number (-2, -1, 0, 1, 2,...)
var panels = document.getElementsByClassName('panel');      //store all panels in an array
var titles = document.getElementsByClassName('anova-title');
var anovaAreaHeight = document.getElementsByClassName('anova-wrap')[0];


// for(var i = 0; i < panels.length; i++) {      //set position for each image
//   panels[i].style.left = i*panels[0].offsetWidth + "px";
// }

function right() {
  if(countPos <= 0 && countPos > (panels.length - panels.length*2 + 1)) { //only execute if the position of last image is 0 on screen and position of first image > (-array.length + 1)
    for(var a=0; a<panels.length; a++) {  //a is the position of image in array
      panels[a].style.left = (countPos*panels[0].offsetWidth - panels[0].offsetWidth) + "px";
      countPos++;
      if (panels[a].style.left == '0px') {
        titles[a].classList.add('Tactive');
        anovaAreaHeight.style.height = panels[a].offsetHeight + 36 + 'px';
      } else
        titles[a].classList.remove('Tactive');
    }
    countPos = countPos - panels.length -1; //reset b based on first image
  }
}

function left() { //only execute if the position of first image is negative, that's mean if the position of first image on screen is 0 then cannot execute
  if(countPos < 0) {
    for(var a=0; a<panels.length; a++) {
      panels[a].style.left = (countPos*panels[0].offsetWidth + panels[0].offsetWidth) + "px";
      countPos++;
      if (panels[a].style.left == '0px') {
        titles[a].classList.add('Tactive');
        anovaAreaHeight.style.height = panels[a].offsetHeight + 36 + 'px';
      } else
        titles[a].classList.remove('Tactive');
    }
    countPos = countPos - panels.length + 1;
  }
}
