//importando as bibliotecas

const express = require('express');
const mqtt = require('mqtt');
const http = require('http');
const { Server } = require("socket.io");
const { warn } = require('console');

//configurações do servidor web
const app = express();
const server = http.createServer(app);


//configurações do websocket
const io = new Server(server);

//configuração de parameteros

const port = 3005;

const URL_BROKER = "mqtt://broker.hivemq.com:1883";
const TOPIC = "miguel/semaforo";
const TOPIC_CONTROLE = "miguel/controle_semaforo";
const PORT_BROKER = 1883;

//configurando variaveis globais
mqttEstadoAnterior = "";

//arquivos de frontend na pasta public
app.use (express.static('semaforo'));

//rodar servidor

server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

//criar a conexão mqtt

const client = mqtt.connect(URL_BROKER, PORT_BROKER);

//status do mqtt

//conectado
client.on("connect", () => {
    console.log("Conectado ao MQTT");
    client.subscribe(TOPIC);
    mqttEstado("Conectado");
});

//desconectado
client.on("offline", () => {
    console.warn("MQTT Desconectado");
    mqttEstado("Desconectado");
});

//reconectar
client.on("error", (err) => {
    console.error("Erro MQTT:", err.mensage);
    mqttEstado("Reconectando");
});

//receber mensagem mqtt

client.on("message", (topic, message) => {
    console.log(`${topic}: ${message}`);
    io.emit("semaforo_status", message.toString());
});

//receber as conexões websocket via frontend
io.on("conection", (socket) => {
    console.log("Novo cliente conectado");
    io.emit("mqtt_status", mqttEstadoAnterior);

    socket.on("controleManual", (botao) => {
        client.publish(TOPIC_CONTROLE, botao);
        console.log("Botão Acionado:", botao);
    });
});

//funções locais
function mqttEstado(estado){
    mqttEstadoAnterior = estado;
    io.emit("mqtt_status", estado);
}
