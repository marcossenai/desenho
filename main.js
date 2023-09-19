let tela = document.getElementById("canvas");
let contexto = tela.getContext("2d");
let desenhando = false;

let seletorCor = document.getElementById("colorPicker");
let controleEspessura = document.getElementById("thicknessSlider");
let interruptorModoPreenchimento = document.getElementById("fillModeToggle");
let botaoDesfazer = document.getElementById("undoButton");

let modoPreenchimento = false;
let ultimaImagem; 

seletorCor.addEventListener("input", function() {
    contexto.strokeStyle = seletorCor.value;
});

controleEspessura.addEventListener("input", function() {
    contexto.lineWidth = controleEspessura.value;
});

interruptorModoPreenchimento.addEventListener("change", function() {
    modoPreenchimento = interruptorModoPreenchimento.checked;
});

botaoDesfazer.addEventListener("click", function() {
    if (ultimaImagem) {
        contexto.putImageData(ultimaImagem, 0, 0);
    }
});

tela.addEventListener("mousedown", function(event) {
    if(modoPreenchimento) {
        ultimaImagem = contexto.getImageData(0, 0, tela.width, tela.height);
        let x = event.clientX - tela.offsetLeft;
        let y = event.clientY - tela.offsetTop;
        preencher(x, y, seletorCor.value);
    } else {
        ultimaImagem = contexto.getImageData(0, 0, tela.width, tela.height);
        desenhando = true;
        contexto.beginPath();
        contexto.moveTo(event.clientX - tela.offsetLeft, event.clientY - tela.offsetTop);
    }
});

tela.addEventListener("mousemove", function(event) {
    if (desenhando) {
        contexto.lineTo(event.clientX - tela.offsetLeft, event.clientY - tela.offsetTop);
        contexto.stroke();
    }
});

tela.addEventListener("mouseup", function(event) {
    desenhando = false;
});

function preencher(x, y, corPreenchimento) {
    let corAlvo = contexto.getImageData(x, y, 1, 1).data;
    let fila = [[x, y]];
    let iteracoes = 0;
    const MAX_ITERACOES = 10000;

    while(fila.length && iteracoes < MAX_ITERACOES) {
        [x, y] = fila.pop();
        let corAtual = contexto.getImageData(x, y, 1, 1).data;
        if(coresIguais(corAtual, corAlvo)) {
            pintarPixel(x, y, corPreenchimento);
            fila.push([x+1, y], [x-1, y], [x, y+1], [x, y-1]);
        }
        iteracoes++;
    }
}

function coresIguais(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

function pintarPixel(x, y, corPreenchimento) {
    contexto.fillStyle = corPreenchimento;
    contexto.fillRect(x, y, 1, 1);
}

contexto.strokeStyle = "#000000";
contexto.lineWidth = 5;
