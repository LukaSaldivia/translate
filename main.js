// https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event

const c = document.getElementById('c')
let ctx = c.getContext('2d')

let sizes = {
    w : window.innerWidth ,
    h : window.innerHeight 
}

let mouse = {
    ox : null,
    oy : null,
    x : 0,
    y : 0,
    dx : 0,
    dy : 0,
    Dx : 0,
    Dy : 0,
    isHolding : false

}



let translated = {
    x : ctx.getTransform().e,
    y : ctx.getTransform().f,
    update : function(){
        this.x = ctx.getTransform().e
        this.y = ctx.getTransform().f
    }
}

let referencePoints = [{x : 0, y: 0}]

let ARG = new Image
ARG.src = `argentina.jpg`

let MOSTRAR_ARG = false
let MOSTRAR_FIG = true
let MOSTRAR_GRID = true

c.width = sizes.w
c.height = sizes.h

ctx.fillStyle = '#222'
ctx.fillRect(0,0,sizes.w,sizes.h)


// drawGrid()
loop()


function drawGrid(width,color,grosor) {

        
    ctx.strokeStyle = color
    ctx.lineWidth = grosor

    let I = Math.ceil(sizes.w/width)+10
    

// Verticales
ctx.beginPath()
Array(I).fill().forEach((_,i)=>{
    ctx.moveTo(width*i - width*Math.ceil(translated.x / width),-translated.y-width)
    ctx.lineTo(width*i - width*Math.ceil(translated.x / width),sizes.h-translated.y) 
})
ctx.closePath()
ctx.stroke()

I = Math.ceil(sizes.h/width)+10


// Horizontales
ctx.beginPath()
Array(I).fill().forEach((_,i)=>{
    ctx.moveTo(-translated.x-width,width*i - width*Math.ceil(translated.y / width)) 
    ctx.lineTo(sizes.w-translated.x+width,width*i - width*Math.ceil(translated.y / width))
})
ctx.closePath()

ctx.stroke()


}



function loop() {
    requestAnimationFrame(loop)
    
    
    translated.update()

    
    ctx.fillStyle = '#222'
    ctx.fillRect(-translated.x,-translated.y,sizes.w,sizes.h)
    ctx.translate(-translated.x + mouse.Dx + (mouse.isHolding ? mouse.dx : 0),-translated.y + mouse.Dy + (mouse.isHolding ? mouse.dy : 0))
    
    if (MOSTRAR_GRID) {
        
    drawGrid(10,'#2f2f2f',1)
    drawGrid(50,'#333',2)
    drawGrid(100,'#888',3)
    }

    if (MOSTRAR_FIG) {
        
    
    ctx.fillStyle = '#333'
    ctx.fillRect(-200,-130,450,380)
    
    ctx.fillStyle = '#824'
    ctx.fillRect(-100,-100,130,130)
    
    // ctx.fillStyle = '#f40'
    ctx.fillRect(50,-90,30,30)
    
    ctx.fillStyle = '#337'
    ctx.fillRect(200,190,30,30)
    
    }
    if (MOSTRAR_ARG) {
        ctx.drawImage(ARG,-300,-200)
    }
    

    referencePoints.forEach(e => {
        setReferencePoint(e.x,e.y)
    })

    
    
    
}


c.addEventListener('mousedown', (e)=>{
    if (e.button === 0) {

        if(e.shiftKey){
            referencePoints.push({x: -translated.x + e.clientX,
            y : -translated.y + e.clientY})
        }else{

        
        let C = c.getBoundingClientRect();
        if (mouse.ox === null && mouse.oy === null) {
            mouse.ox = e.clientX - Math.floor(C.left)
            mouse.oy = e.clientY - Math.floor(C.top)

            mouse.x = mouse.ox
            mouse.y = mouse.oy
        }
        
        mouse.isHolding = true
        
        c.classList.add('grabbing')
    }

    }
})



document.addEventListener('mouseup', () => {
    cancelHold()
})

document.addEventListener('mousemove',(e)=>{
    if(mouse.isHolding){
        let C = c.getBoundingClientRect();
        mouse.x = e.clientX - Math.floor(C.left)
        mouse.y = e.clientY - Math.floor(C.top)

        mouse.dx = -(mouse.ox - mouse.x)
        mouse.dy = -(mouse.oy - mouse.y)


    }
})

document.addEventListener('keypress',({code}) => {


    const ACTIONS = {
        KeyA : ()=>{MOSTRAR_ARG = !MOSTRAR_ARG},
        KeyR : ()=>{mouse.Dx += -mouse.Dx,
                    mouse.Dy += -mouse.Dy},
        KeyF : ()=>{MOSTRAR_FIG = !MOSTRAR_FIG},
        KeyG : ()=>{MOSTRAR_GRID = !MOSTRAR_GRID},
        KeyD : ()=>{referencePoints = [{x : 0, y: 0}]},
    }

    ACTIONS[code]()
})


window.addEventListener('resize',()=>{
    sizes.w = window.innerWidth
    sizes.h = window.innerHeight

    c.width = sizes.w 
    c.height = sizes.h 
})

c.addEventListener('touchstart',(e)=>{
    let C = c.getBoundingClientRect();
        if (mouse.ox === null && mouse.oy === null) {
            mouse.ox = e.touches[0].clientX - Math.floor(C.left)
            mouse.oy = e.touches[0].clientY - Math.floor(C.top)

            mouse.x = mouse.ox
            mouse.y = mouse.oy
        }
        
        mouse.isHolding = true
        
        c.classList.add('grabbing')

})

document.addEventListener('touchend',()=>{
    cancelHold()
})

document.addEventListener('touchmove',(e)=>{
    if(mouse.isHolding){
        let C = c.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - Math.floor(C.left)
        mouse.y = e.touches[0].clientY - Math.floor(C.top)

        mouse.dx = -(mouse.ox - mouse.x)
        mouse.dy = -(mouse.oy - mouse.y)


    }
})

function cancelHold() {
    mouse.isHolding = false
    mouse.ox = null
    mouse.oy = null
    mouse.x = 0
    mouse.y = 0


    mouse.Dx += mouse.dx
    mouse.Dy += mouse.dy

    mouse.dx = 0
    mouse.dy = 0

    c.classList.remove('grabbing')
}

c.addEventListener('dblclick', (e)=>{
    referencePoints.push({x: -translated.x + e.clientX,
        y : -translated.y + e.clientY})
})

function setReferencePoint(x,y) {
    ctx.fillStyle = '#fa0'
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill()
    ctx.closePath()

    ctx.font = "12px Arial";
    ctx.fillText(`(${x} , ${y})`, x + 8, y - 8);
}