// https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event

const c = document.getElementById('c')
let ctx = c.getContext('2d')

let sizes = {
    w : window.innerWidth /1.2,
    h : window.innerHeight /1.2
}

let box = {
    width : 25,
    color : '#888',
    grosor : 1
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

let ARG = new Image
ARG.src = `argentina.jpg`

let MOSTRAR_ARG = false

c.width = sizes.w
c.height = sizes.h

ctx.fillStyle = '#222'
ctx.fillRect(0,0,sizes.w,sizes.h)


drawGrid()

loop()


function drawGrid() {

        
    ctx.strokeStyle = box.color
    ctx.lineWidth = box.grosor

    let I = Math.ceil(sizes.w/box.width)+1
    
    // console.log(`I : ${I} | Tx : ${translated.x}`)

// Verticales
ctx.beginPath()
    Array(I).fill().forEach((_,i)=>{
        ctx.moveTo(box.width*i - box.width*Math.ceil(translated.x / box.width),-translated.y)
        ctx.lineTo(box.width*i - box.width*Math.ceil(translated.x / box.width),sizes.h-translated.y)
    })
    ctx.closePath()
    
    I = Math.ceil(sizes.h/box.width)+1

    
// Horizontales
    Array(I).fill().forEach((_,i)=>{
        ctx.moveTo(-translated.x,box.width*i - box.width*Math.ceil(translated.y / box.width))
        ctx.lineTo(sizes.w-translated.x,box.width*i - box.width*Math.ceil(translated.y / box.width))
    })

    ctx.stroke()


}



function loop() {
    requestAnimationFrame(loop)
    
    
    translated.update()

    
    ctx.fillStyle = '#222222'
    ctx.fillRect(-translated.x,-translated.y,sizes.w,sizes.h)
    ctx.translate(-translated.x + mouse.Dx + (mouse.isHolding ? mouse.dx : 0),-translated.y + mouse.Dy + (mouse.isHolding ? mouse.dy : 0))
    drawGrid()
    
    
    ctx.fillStyle = '#333'
    ctx.fillRect(-200,-130,450,380)
    
    ctx.fillStyle = 'red'
    ctx.fillRect(-100,-100,130,130)
    
    ctx.fillStyle = 'yellow'
    ctx.fillRect(50,-90,30,30)
    
    ctx.fillStyle = 'blue'
    ctx.fillRect(200,190,30,30)
    
    
    if (MOSTRAR_ARG) {
        ctx.drawImage(ARG,-300,-200)
    }
    


    
    
    
}


c.addEventListener('mousedown', (e)=>{
    if (e.button === 0) {
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
})



document.addEventListener('mouseup', () => {
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
        KeyF : ()=>{}
    }

    ACTIONS[code]()
})


window.addEventListener('resize',()=>{
    sizes.w = window.innerWidth / 1.2
    sizes.h = window.innerHeight / 1.2

    c.width = sizes.w
    c.height = sizes.h
})