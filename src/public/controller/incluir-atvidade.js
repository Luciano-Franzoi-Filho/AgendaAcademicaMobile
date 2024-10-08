import { Atividade } from "../models/atividade_model.js";
import { Subtarefa } from "../models/subtarefa_model.js";
import { delay } from "../utils/utils.js";

export async function cadastroATV() {
    let nomeATV = document.getElementById("titulo-atividade").value;
    let desc = document.getElementById("descricao").value;
    let dataInicial = document.getElementById("dataInicial").value;
    let dataFinal = document.getElementById("dataFinal").value;

    if (nomeATV === "") {
        showAlert('Insira um título');
        return;
    } 
    if (dataFinal === "") {
        showAlert("Insira uma data Final!");
        return;
    } 
    if (new Date(dataInicial) > new Date(dataFinal)) {
        showAlert("A data inicial não pode ser maior que a data final!");
        return;
    } 

    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    loadingModal.show();

    const ATV = new Atividade(nomeATV, desc, dataInicial, dataFinal);
    try {
        await ATV.cadastrar();
        const subtarefas = verificarSubtarefas(); 
        for (const subtarefa of subtarefas) {
            const { nome, concluida } = subtarefa;
            const novaSubtarefa = new Subtarefa(ATV.getID(), nome, concluida);
            if (await novaSubtarefa.cadastrar()) { 
            }
        }

        await delay(200);
        if (document.body.id === "incluirATV-page") {
            // location.reload();
            window.location.href = '/index.html';
        }
    } catch (error) {
        console.error("Deu ruim no cadastro:", error);
    } finally {
        loadingModal.hide();
    }
}

function verificarSubtarefas() {
    const inputs = document.querySelectorAll('.subtarefa');
    const subtarefas = [];

    inputs.forEach((input) => { 
        const formCheckDiv = input.closest('.form-check');
        const checkbox = formCheckDiv ? formCheckDiv.querySelector('.form-check-input') : null;

        if (input.value.trim() !== '') {
            subtarefas.push({
                nome: input.value.trim(),
                concluida: checkbox ? (checkbox.checked ? 1 : 0) : 0
            });
        }
    });

    return subtarefas;
}

function showAlert(message) {
    const customAlert = document.getElementById('customAlert');
    const customAlertMessage = document.getElementById('customAlertMessage');

    customAlertMessage.textContent = message;
    customAlert.style.display = 'block';

    document.getElementById('customAlertClose').onclick = function() {
      customAlert.style.display = 'none';
    };
}
  