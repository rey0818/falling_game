alert("Game rule : Don't touch the block ! ")
alert("W : Up , S : Down , A : Left , D : Right , Q : Become Higher , E : Become shorter(>10px).");
var keyname = {
    87: "W",
    65: "A",
    83: "S",
    68: "D",
    81: "Q",
    69: "E",
//  32: "space",
//  82: "R"
  }
var canvas = document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var level = 1 , Score = 0 , i = 0 , gg = false , live = 2;
var backgrounds = [
    "background1.jpg",
    "background2.jpg",
    "background3.jpg",
];

var Sum = function () {
    this.x = Math.floor(Math.random()*7)*100;
    this.y = 0;
    this.yspeed = 33;
}
Drawborder = function(){
    ctx.strokeStyle = "Black";
    ctx.strokeRect(0,0,width,height);
    for(var draw = 100 ; draw<700;draw+=100){
        ctx.beginPath();
        ctx.moveTo(draw,0);
        ctx.lineTo(draw,height);
        ctx.stroke();
    }
}
var Block = function(){
    this.num = [
      new Sum() , 
      new Sum() , 
      new Sum() , 
      new Sum() , 
      new Sum() , 
      new Sum() , 
      new Sum()
    ];
}
var Character = function(){
    this.xspeed = 0; this.yspeed = 0;
    this.width = 100 ,this.height = 10;
    this.x = 0; this.y = height - 50 ;
}
Character.prototype.draws = function(){
    ctx.fillStyle = "Blue";
    ctx.fillRect(this.x,this.y,this.width,this.height);
}
Character.prototype.move = function(){
  this.x += this.xspeed; this.y +=this.yspeed; 
}
Character.prototype.direction = function (dir) {
    if(dir==="A") {this.xspeed = -this.width ,this.yspeed = 0;  character.move();   character.check();}
    else if(dir==="D") {this.xspeed = this.width , this.yspeed = 0;  character.move();   character.check();}
    else if(dir==="W") {this.yspeed = -this.height , this.xspeed = 0;  character.move();   character.check();}
    else if(dir==="S") {this.yspeed = this.height , this.xspeed = 0;  character.move();   character.check();}
    else if(dir==="Q") this.height += 10 ;
    else if(dir==="E") {if(this.height>10) this.height -= 10;}
}
Character.prototype.check = function () {
    if(this.x > (width-this.width) ) this.x = width - this.width;
    else if(this.x<0) this.x = 0;
    if(this.y<0) this.y = 0;
    else if(this.y> (height-this.height) ) this.y = height - this.height;
}
Character.prototype.touch = function (a) {
    if( a.x === this.x && ( (a.y + 49 - a.yspeed) > this.y && (a.y - a.yspeed) < (this.y + this.height ) ) )
     Gameover(); 
};
Sum.prototype.draw = function () {
    ctx.fillStyle = "Gold";
    ctx.fillRect(this.x,this.y,100,50);
}
Sum.prototype.move = function () {
    this.y += this.yspeed ;
}
Sum.prototype.check = function(){
    if(this.y>(height+this.yspeed)) {
        this.y=0; 
        this.x = Math.floor(Math.random()*7)*100;
        Score+=1;
    }
}
var block = new Block;
var character = new Character;
$("body").keydown(function(event){
    var dir = keyname[event.keyCode];
    if(dir !== undefined ) character.direction(dir);
    //console.log(event.keyCode);
})
var Levelup = function(){
    document.getElementById("levelDisplay").textContent = "Level: " + level;
    document.getElementById("scoreDisplay").textContent = "Score: " + Score;
    if( i===6 && level ===34 ) level++,alert("Congratulations! You did it! Then there is the last and hardest level!");
    if( (Score/(i+1)) % 15 === 0 && Score!== 0){
        if( (level % 5 !== 0 && level!==36) || level === 35  ){
        //    alert("SpeedUp! You are at level " + (level + 1) + " now." );
            for(var count = 0; count<block.num.length;count++)
            {
                block.num[count].y = 0;
                if(i>=3)   block.num[count].yspeed += 4 ;
                else       block.num[count].yspeed += 6 ;
            }
            Score+=1; 
            level+=1; 
            //audio.play();
        }
        else{    
            if(level === 36)  gg=true,Gameover();
          //  alert("The block becomes more ! You are at level " + (level+1) + " now.");
            var speed = 33 - ( (i+1) * 5 ) ; 
            if(i>=2) speed = 17 ; 
            for(var count = 0; count<block.num.length;count++)
            {
                block.num[count].yspeed = speed-- ; 
                if(speed<=11)   speed=17;
                block.num[count].y = 0;
            }
            Score+=1;
            level+=1;
            i += 1; 
            // Newblock();
        }
    }
}
var currentBackgroundIndex = 0;
var ans = setInterval(function(){
    if (level % 2 === 0) {
        currentBackgroundIndex = (level / 2) % backgrounds.length;
        document.body.style.backgroundImage = "url(" + backgrounds[currentBackgroundIndex] + ")";
    }

    ctx.clearRect(0,0,width,height);
    for( var k = 0 ; k<=i;k++){
    var head = block.num[k];
    character.draws(); head.draw();   
    character.touch(head);  
    head.move(); head.check(); 
    Levelup();
    }
    Drawborder();
},35);
//var audios=new Audio("Gameover.mp3");
    var Gameover = function (){
        if(live>1) {
            for(var ag = 0 ; ag<block.num.length;ag++) block.num[ag].x=Math.floor(Math.random()*7)*100,block.num[ag].y=0;
            live--; 
            alert("You have " + live + " life left.");}
        else {
            document.getElementById("audio").pause();
            document.getElementById("GameOver").play();
            clearInterval(ans);
        if(Score < 10 ) Score++;
        if(gg)  alert("You are as good as Rey ! You win!");
        alert("You had avoided : " + (Score - level) + " blocks" );
        alert("Your Level : " + level);
        }
}
