import {showPopup} from "./showPopup";

document.addEventListener('DOMContentLoaded', () => {
    const patientContainer = document.getElementById('patient-container');

    // Função para buscar pacientes do backend
    async function buscarPacientes() {
        try {
            const response = await fetch('/pessoas');
            if (!response.ok) {
                throw new Error('Erro ao buscar pacientes');
            }

            const pacientes = await response.json();
            renderizarPacientes(pacientes);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    // Função para renderizar a lista de pacientes
    function renderizarPacientes(pacientes) {
        patientContainer.innerHTML = '';

        pacientes.forEach((paciente) => {
            const pacienteElement = document.createElement('div');
            pacienteElement.classList.add('patient');

            // Imagem do paciente
            const imagemPaciente = document.createElement('img');
            imagemPaciente.src = paciente.imagem ? `/${paciente.imagem}` : '/img/default.png';
            imagemPaciente.alt = `Foto de ${paciente.nome}`;
            imagemPaciente.classList.add('patient-pic');

            // Informações do paciente
            const infoPaciente = document.createElement('div');
            infoPaciente.classList.add('patient-info');
            const idade = calcularIdade(paciente.data_nascimento);
            infoPaciente.innerHTML = `<p><strong>${paciente.nome}</strong> | ${idade}a</p>`;

            // Ações do paciente
            const acoesPaciente = document.createElement('div');
            acoesPaciente.classList.add('patient-actions');
            acoesPaciente.innerHTML = `
                <button class="btn btn-access">Acessar Relatórios</button>
                <button class="btn btn-edit" onclick="editarPessoa(${paciente.id})">Editar</button>
                <button class="btn btn-delete" onclick="excluirPessoa(${paciente.id})">Excluir</button>
            `;

            // Adiciona tudo ao elemento principal do paciente
            pacienteElement.appendChild(imagemPaciente);
            pacienteElement.appendChild(infoPaciente);
            pacienteElement.appendChild(acoesPaciente);

            // Adiciona o paciente ao container
            patientContainer.appendChild(pacienteElement);
        });
    }

    // Função para redirecionar para a tela de edição
    function editarPessoa(id) {
        window.location.href = `/cadastroPaciente?id=${id}`;
    }

    // Função para excluir uma pessoa
    async function excluirPessoa(id) {
        if (!confirm('Tem certeza de que deseja excluir esta pessoa?')) return;

        try {
            const response = await fetch(`/pessoas/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showPopup('Pessoa excluída com sucesso!', '#419744'); // Pop-up verde
                buscarPacientes(); // Atualiza a lista após a exclusão
            } else {
                const errorData = await response.json();
                console.error('Erro ao excluir pessoa:', errorData);
                showPopup('Erro ao excluir pessoa: ' + errorData.error, '#dcb004'); // Pop-up amarela
            }
        } catch (error) {
            console.error('Erro ao excluir pessoa:', error);
            showPopup('Erro ao excluir pessoa.', '#dcb004'); // Pop-up amarela
        }
    }

    window.editarPessoa = editarPessoa;
    window.excluirPessoa = excluirPessoa;

    // Função para calcular a idade a partir da data de nascimento
    function calcularIdade(dataNascimento) {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    }

    // Buscar pacientes ao carregar a página
    buscarPacientes();
});
