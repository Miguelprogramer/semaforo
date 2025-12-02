const socket = io();
const overlay = document.getElementById("overlay");
const buttons = document.querySelectorAll(".action-btn");


function ligar(cor){
    desligar();
    document.getElementById(cor).classList.add(cor)
}

function desligar(){
    document.getElementById("vermelho").classList.remove("vermelho")
    document.getElementById("amarelo").classList.remove("amarelo")
    document.getElementById("verde").classList.remove("verde")
}


function enviaControle(botao){
    socket.emit("controleManual", botao);
}

//-----------CONEXÃO WEBSOCKET-----------//

//receber status do mqtt

socket.on("semaforo_status", (status) => {
    console.log(status);
    const mqttStatusDiv = document.getElementById("mqtt-status");
    mqttStatusDiv.innerText = "MQTT: " + status;
    mqttStatusDiv.classList = "";
    if(status === "Conectado"){
        mqttStatusDiv.classList.add("status-conectado");
    } else if (status === "Desconectado"){
        mqttStatusDiv.classList.add("status-desconectado");
    } else {
        mqttStatusDiv.classList.add("status-reconectando");
    }
});

//receber status do semforo

socket.on("status_semaforo", (msg) => {
    console.log("semaforo_status", msg);
    switch (msg) {
        case "0":
            ligar("vermelho");
            break;
        case "1":
            ligar("amarelo");
            break;
        case "2":
            ligar("verde");
            break;
        case "5":
            desligar();
            break;
        default:
            console.log("Comando desconhecido:", msg);
    }
});

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        overlay.classList.add("active");
    });

});
