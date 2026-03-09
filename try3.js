const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const percentText = document.querySelector(".percent");
const totalPixels = canvas.width * canvas.height;

let drawing = false;
let currentPath = [];
let paths = [];

canvas.addEventListener("mousedown", function(e){
  if(e.button!==0)return;
  drawing=true;
  currentPath=[{x:e.offsetX,y:e.offsetY}];
});

canvas.addEventListener("mousemove",function(e){
  if(!drawing)return;
  currentPath.push({x:e.offsetX,y:e.offsetY});
  redraw();
});

canvas.addEventListener("mouseup",function(){
  if(!drawing)return;
  drawing=false;
  const pathCopy=[...currentPath];
  paths.push(pathCopy);
  setTimeout(function(){
    const i=paths.indexOf(pathCopy);
    if(i>-1){paths.splice(i,1);redraw();}
  },2000);
});

canvas.addEventListener("mouseleave",function(){drawing=false;});

function redraw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let path of paths) drawPath(path);
  if(drawing) drawPath(currentPath);
  updatePercentage();
}

function drawPath(path){
  if(path.length<2)return;
  ctx.beginPath();
  ctx.lineWidth=8;
  ctx.moveTo(path[0].x,path[0].y);
  for(let i=1;i<path.length;i++) ctx.lineTo(path[i].x,path[i].y);
  ctx.stroke();
}

function updatePercentage(){
  const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
  let filled=0;
  for(let i=3;i<data.length;i+=4) if(data[i]!=0) filled++;
  percentText.textContent=((filled/totalPixels)*100).toFixed(2)+"%";
}

const confirmBtn=document.getElementById("confirmBtn");
const clearBtn=document.getElementById("clearBtn");
const popup=document.getElementById("popup");
const popupText=popup.querySelector(".popup-text");

clearBtn.addEventListener("click",function(){
  paths=[];
  currentPath=[];
  redraw();
});

confirmBtn.addEventListener("click",function(){
  popupText.textContent=`Volume set to ${percentText.textContent}`;
  popup.style.display="flex";
});

popup.addEventListener("click",function(e){
  if(e.target===popup) popup.style.display="none";
});