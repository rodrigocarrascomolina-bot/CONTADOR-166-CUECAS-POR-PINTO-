let cantidadCuecas = parseInt(localStorage.getItem('conteoCuecas')) || 0;
const contadorElemento = document.getElementById('contador');

const marcadorPrincipal = document.getElementById('marcadorPrincipal');
const textoEtiqueta = document.getElementById('textoEtiqueta');
const mensajeMeta = document.getElementById('mensajeMeta');
const canvas = document.getElementById('canvasCelebracion');
const ctx = canvas.getContext('2d');

let animacionId;
let cohetes = [];
let particulas = [];
let esMetaCumplida = false;

function mapearTamanoCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', mapearTamanoCanvas);
mapearTamanoCanvas();

actualizarPantalla();

function sumar() {
    cantidadCuecas++;
    guardarYActualizar();
}

function restar() {
    if (cantidadCuecas > 0) {
        cantidadCuecas--;
        guardarYActualizar();
    }
}

function reiniciar() {
    if (confirm("¿Estás seguro de que deseas reiniciar el contador de cuecas a 0?")) {
        cantidadCuecas = 0;
        guardarYActualizar();
    }
}

function guardarYActualizar() {
    localStorage.setItem('conteoCuecas', cantidadCuecas);
    actualizarPantalla();
}

function actualizarPantalla() {
    contadorElemento.innerText = cantidadCuecas;
    
    if (cantidadCuecas >= 166) {
        if (!esMetaCumplida) {
            esMetaCumplida = true;
            activarCelebracion();
        }
    } else {
        if (esMetaCumplida) {
            esMetaCumplida = false;
            desactivarCelebracion();
        }
    }
}

function activarCelebracion() {
    marcadorPrincipal.classList.add('celebracion-activa');
    textoEtiqueta.innerText = "¡LOGRADO!";
    mensajeMeta.style.display = "block";
    canvas.style.display = "block";
    cohetes = [];
    particulas = [];
    bucleAnimacion();
}

function desactivarCelebracion() {
    marcadorPrincipal.classList.remove('celebracion-activa');
    textoEtiqueta.innerText = "Cueca Actual";
    mensajeMeta.style.display = "none";
    canvas.style.display = "none";
    cancelAnimationFrame(animacionId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

class Cohete {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height * 0.5);
        this.velocidad = Math.random() * 4 + 4;
        this.hue = Math.random() * 360;
    }
    actualizar() { this.y -= this.velocidad; }
    dibujar() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx.fill();
    }
}

class Particula {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        this.angulo = Math.random() * Math.PI * 2;
        this.velocidad = Math.random() * 6 + 1;
        this.gravedad = 0.08;
        this.resistencia = 0.95;
        this.opacidad = 1;
        this.desvanecimiento = Math.random() * 0.015 + 0.01;
    }
    actualizar() {
        this.velocidad *= this.resistencia;
        this.x += Math.cos(this.angulo) * this.velocidad;
        this.y += Math.sin(this.angulo) * this.velocidad + this.gravedad;
        this.opacidad -= this.desvanecimiento;
    }
    dibujar() {
        ctx.save();
        ctx.globalAlpha = this.opacidad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.random() * 2 + 1, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx.fill();
        ctx.restore();
    }
}

function bucleAnimacion() {
    if (!esMetaCumplida) return;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (Math.random() < 0.04) { cohetes.push(new Cohete()); }
    
    for (let i = cohetes.length - 1; i >= 0; i--) {
        cohetes[i].actualizar();
        cohetes[i].dibujar();
        if (cohetes[i].y <= cohetes[i].targetY) {
            for (let p = 0; p < 60; p++) {
                particulas.push(new Particula(cohetes[i].x, cohetes[i].y, cohetes[i].hue));
            }
            cohetes.splice(i, 1);
        }
    }
    for (let i = particulas.length - 1; i >= 0; i--) {
        particulas[i].actualizar();
        particulas[i].dibujar();
        if (particulas[i].opacidad <= 0) { particulas.splice(i, 1); }
    }
    animacionId = requestAnimationFrame(bucleAnimacion);
}
