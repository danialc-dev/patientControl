const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

let currentDate = new Date();

async function renderCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const monthYearElement = document.getElementById('month-year');
    const weekdaysElement = document.getElementById('weekdays');
    const calendarDaysElement = document.getElementById('calendar-days');

    monthYearElement.textContent = `${monthNames[month]} ${year}`;
    weekdaysElement.innerHTML = weekdays.map(day => `<div>${day}</div>`).join('');

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarDaysElement.innerHTML = '';

    for (let i = 0; i < firstDay; i++) {
        calendarDaysElement.innerHTML += '<div></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.classList.add('day');

        const dayFormatted = String(day).padStart(2, '0');
        const monthFormatted = String(month + 1).padStart(2, '0');
        const fullDate = `${year}-${monthFormatted}-${dayFormatted}`;

        // Verifica se é o dia atual
        if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            dayElement.classList.add('today');
        }

        // Fazer uma chamada à rota de buscar agendamentos para cada dia
        try {
            const response = await fetch(`/buscar-agendamentos?date=${fullDate}`);
            const appointments = await response.json();

            if (appointments.length > 0) {
                appointments.forEach(appointment => {
                    const appointmentDiv = document.createElement('div');
                    appointmentDiv.classList.add('appointment-summary');

                    // Extraímos o horário diretamente da string de data_hora sem conversão
                    const horaOriginal = appointment.data_hora.split('T')[1].slice(0, 5); // Hora no formato HH:MM

                    appointmentDiv.innerHTML = `
                        <span class="appointment-time">${horaOriginal}</span> 
                        <span class="appointment-name">${appointment.pessoa.nome}</span>
                        <span class="appointment-price">R$ ${appointment.preco.toFixed(2)}</span> <!-- Adicionando o preço -->
                    `;
                    dayElement.appendChild(appointmentDiv);
                });
            }
        } catch (error) {
            console.error(`Erro ao buscar agendamentos para ${fullDate}:`, error);
        }

        // Configurar o clique para exibir o popup de agendamentos completos
        dayElement.addEventListener('click', async () => {
            document.getElementById('appointment-date').value = fullDate;

            const selectedDate = new Date(`${fullDate}T00:00:00`);
            const currentDate = new Date(); // Data atual

            if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
                // Se a data selecionada for anterior ao dia atual, abre o modal de "Ver Agendamentos"
                document.getElementById('appointments-list').innerHTML = ''; // Limpa a lista de agendamentos

                try {
                    const response = await fetch(`/buscar-agendamentos?date=${fullDate}`);
                    const dailyAppointments = await response.json();

                    if (dailyAppointments.length > 0) {
                        dailyAppointments.forEach(appointment => {
                            const horaOriginal = appointment.data_hora.split('T')[1].slice(0, 5); // Hora no formato HH:MM

                            const appointmentElement = document.createElement('div');
                            appointmentElement.innerHTML = `
                        <p><strong>Horário:</strong> ${horaOriginal}</p>
                        <p><strong>Nome:</strong> ${appointment.pessoa.nome}</p>
                        <p><strong>Serviços:</strong> ${appointment.servicos.join(', ')}</p>
                        <p><strong>Preço:</strong> R$ ${appointment.preco.toFixed(2)}</p>
                        <hr>`;
                            document.getElementById('appointments-list').appendChild(appointmentElement);
                        });
                    } else {
                        // Se não houver agendamentos para a data anterior, exibe a mensagem
                        document.getElementById('appointments-list').innerHTML = '<p>Não houve agendamentos para este dia.</p>';
                    }
                } catch (error) {
                    console.error('Erro ao buscar agendamentos:', error);
                }

                // Exibe o popup de agendamentos
                document.getElementById('view-appointments-popup').classList.remove('hidden');
            } else {
                // Se for uma data futura ou o dia atual, exibe o popup de opções
                document.getElementById('options-popup').classList.remove('hidden');

                // Configura o botão "Ver Agendamentos"
                document.getElementById('view-appointments-button').onclick = async () => {
                    document.getElementById('appointments-list').innerHTML = ''; // Limpa a lista de agendamentos

                    try {
                        const response = await fetch(`/buscar-agendamentos?date=${fullDate}`);
                        const dailyAppointments = await response.json();

                        if (dailyAppointments.length > 0) {
                            dailyAppointments.forEach(appointment => {
                                const horaOriginal = appointment.data_hora.split('T')[1].slice(0, 5); // Hora no formato HH:MM

                                const appointmentElement = document.createElement('div');
                                appointmentElement.innerHTML = `
                            <p><strong>Horário:</strong> ${horaOriginal}</p>
                            <p><strong>Nome:</strong> ${appointment.pessoa.nome}</p>
                            <p><strong>Serviços:</strong> ${appointment.servicos.join(', ')}</p>
                            <p><strong>Preço:</strong> R$ ${appointment.preco.toFixed(2)}</p>
                            <hr>`;
                                document.getElementById('appointments-list').appendChild(appointmentElement);
                            });
                        } else {
                            // Se não houver agendamentos para a data futura, exibe a mensagem
                            document.getElementById('appointments-list').innerHTML = '<p>Não há agendamentos para este dia.</p>';
                        }
                    } catch (error) {
                        console.error('Erro ao buscar agendamentos:', error);
                    }

                    // Exibe o popup de agendamentos e oculta o popup de opções
                    document.getElementById('view-appointments-popup').classList.remove('hidden');
                    document.getElementById('options-popup').classList.add('hidden');
                };
            }
        });

        calendarDaysElement.appendChild(dayElement);
    }
}


// Função que limpa os campos do modal de agendamento
function limparCamposAgendamento() {
    document.getElementById('appointment-name').value = ''; // Limpa o nome do paciente
    document.getElementById('appointment-patient-id').value = ''; // Limpa o ID do paciente
    document.getElementById('appointment-service').value = ''; // Limpa o serviço
    document.getElementById('appointment-time').value = ''; // Limpa o horário
    document.getElementById('appointment-price').value = ''; // Limpa o preco
    document.getElementById('services-container').innerHTML = ''; // Remove todos os serviços adicionados
}

// Configura o botão "Novo Agendamento"
document.getElementById('new-appointment-button').onclick = () => {
    limparCamposAgendamento(); // Limpa os campos do modal sempre que ele for aberto
    document.getElementById('appointment-popup').classList.remove('hidden');
    document.getElementById('options-popup').classList.add('hidden');
};

document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

document.querySelectorAll('.close-popup').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeBtn.closest('.popup').classList.add('hidden');
    });
});

window.addEventListener('click', (event) => {
    if (event.target.classList.contains('popup')) {
        event.target.classList.add('hidden');
    }
});

// Variável para controlar o foco e o clique
let inputFocused = false;

// Detecta quando o input é focado
document.getElementById('appointment-name').addEventListener('focus', function() {
    inputFocused = true;
});

// Detecta quando o input perde o foco
document.getElementById('appointment-name').addEventListener('blur', function() {
    setTimeout(() => {
        inputFocused = false;
        document.getElementById('name-suggestions').innerHTML = '';
        document.getElementById('name-suggestions').style.display = 'none';
    }, 200);
});

// Sugestões para Nome do Paciente
document.getElementById('appointment-name').addEventListener('input', async function() {
    const searchTerm = this.value;

    if (inputFocused && searchTerm.length > 1) {
        try {
            const response = await fetch(`/buscar-pessoas?term=${searchTerm}`);
            const pessoas = await response.json();

            const suggestionsBox = document.getElementById('name-suggestions');
            suggestionsBox.innerHTML = '';

            pessoas.forEach(pessoa => {
                const suggestion = document.createElement('div');
                suggestion.textContent = pessoa.nome;
                suggestion.classList.add('suggestion-item');
                suggestion.addEventListener('click', () => {
                    document.getElementById('appointment-name').value = pessoa.nome;
                    document.getElementById('appointment-patient-id').value = pessoa.id;  // Armazena o ID da pessoa
                    suggestionsBox.innerHTML = '';
                    suggestionsBox.style.display = 'none';
                });
                suggestionsBox.appendChild(suggestion);
            });

            suggestionsBox.style.display = pessoas.length > 0 ? 'block' : 'none';
        } catch (error) {
            console.error('Erro ao buscar pessoas:', error);
        }
    } else {
        document.getElementById('name-suggestions').style.display = 'none';
    }
});

// Sugestões para Serviço
document.getElementById('appointment-service').addEventListener('input', async function() {
    const searchTerm = this.value;

    if (searchTerm.length > 1) {
        try {
            const response = await fetch(`/buscar-servicos?term=${searchTerm}`);
            const servicos = await response.json();

            const suggestionsBox = document.getElementById('service-suggestions');
            suggestionsBox.innerHTML = '';

            servicos.forEach(servico => {
                const suggestion = document.createElement('div');
                suggestion.textContent = servico.nome;
                suggestion.classList.add('suggestion-item');
                suggestion.addEventListener('click', () => {
                    adicionarServico(servico.id, servico.nome);
                    document.getElementById('appointment-service').value = '';
                    suggestionsBox.innerHTML = '';
                    suggestionsBox.style.display = 'none';
                });
                suggestionsBox.appendChild(suggestion);
            });

            suggestionsBox.style.display = servicos.length > 0 ? 'block' : 'none';
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
        }
    } else {
        document.getElementById('service-suggestions').style.display = 'none';
    }
});

// Função para adicionar um novo campo de serviço ao formulário
function adicionarServico(idServico, nomeServico) {
    const servicesContainer = document.getElementById('services-container');

    const serviceRow = document.createElement('div');
    serviceRow.classList.add('service-row');

    const serviceInput = document.createElement('input');
    serviceInput.type = 'hidden';
    serviceInput.name = 'servicos[]';
    serviceInput.value = idServico;

    const serviceLabel = document.createElement('span');
    serviceLabel.textContent = nomeServico;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remover';
    removeButton.addEventListener('click', () => {
        servicesContainer.removeChild(serviceRow);
    });

    serviceRow.appendChild(serviceInput);
    serviceRow.appendChild(serviceLabel);
    serviceRow.appendChild(removeButton);

    servicesContainer.appendChild(serviceRow);
}

// Validação ao enviar o formulário
document.getElementById('appointment-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const idPessoa = document.getElementById('appointment-patient-id').value;
    const servicesContainer = document.getElementById('services-container');
    const servicos = [...servicesContainer.querySelectorAll('input[name="servicos[]"]')].map(input => input.value);
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;

    // Obter o preço do campo de entrada
    const preco = document.getElementById('appointment-price').value;

    if (!idPessoa || servicos.length === 0 || !preco) {
        alert("Por favor, selecione um paciente, pelo menos um serviço e insira um preço.");
        return;
    }

    const requestBody = {
        id_pessoa: idPessoa,
        date: date,
        time: time,
        servicos: servicos,
        preco: parseFloat(preco) // Adicionando o preço ao requestBody
    };

    try {
        const response = await fetch('/agendamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            alert('Agendamento criado com sucesso!');
            document.getElementById('appointment-popup').classList.add('hidden');
            renderCalendar(); // Atualiza o calendário após a criação do agendamento
        } else {
            alert('Erro ao criar agendamento.');
        }
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        alert('Erro ao criar agendamento.');
    }
});

let currentIndex = 0;
const itemsToShow = 3;

function carregarResumoDoDia() {
    const today = new Date().toISOString().split('T')[0];

    const setaEsquerda = document.querySelector('.carousel-prev');
    const setaDireita = document.querySelector('.carousel-next');

    fetch(`/buscar-agendamentos?date=${today}`)
        .then(response => response.json())
        .then(agendamentos => {
            const resumoContainer = document.getElementById('resumo-dia');
            resumoContainer.innerHTML = ''; // Limpa o resumo atual

            if (agendamentos.length > 0) {
                agendamentos.forEach(agendamento => {
                    const agendamentoDiv = document.createElement('div');
                    agendamentoDiv.classList.add('appointment');

                    const hora = agendamento.data_hora.split('T')[1].slice(0, 5);

                    agendamentoDiv.innerHTML = `
                    <h3>${hora}</h3>
                    <p>${agendamento.pessoa.nome}</p>
                    <p><span class="red">${agendamento.servicos.join(', ')}</span></p>
                    <p>Valor do atendimento: <strong>R$${agendamento.preco.toFixed(2)}</strong></p>
                `;
                    resumoContainer.appendChild(agendamentoDiv);

                });

                // Ajusta a largura do container de resumo para caber todos os itens
                resumoContainer.style.width = `${100 * agendamentos.length / itemsToShow}%`;

                // Mostrar as setas se houver mais de um agendamento
                if (agendamentos.length > 1) {
                    setaEsquerda.style.display = 'block';
                    setaDireita.style.display = 'block';
                } else {
                    setaEsquerda.style.display = 'none';
                    setaDireita.style.display = 'none';
                }

            } else {
                resumoContainer.innerHTML = '<p>Não há agendamentos para hoje.</p>';
                setaEsquerda.style.display = 'none';
                setaDireita.style.display = 'none';
            }
        })
        .catch(error => console.error('Erro ao carregar o resumo do dia:', error));
}

function nextSlide() {
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.appointment');
    const totalItems = items.length;

    if (currentIndex < totalItems - itemsToShow) {
        currentIndex++;
        const percentageToMove = 100 / itemsToShow;  // Mover de acordo com a quantidade de itens visíveis
        track.style.transform = `translateX(-${currentIndex * percentageToMove}%)`;
    }
}

function prevSlide() {
    const track = document.querySelector('.carousel-track');

    if (currentIndex > 0) {
        currentIndex--;
        const percentageToMove = 100 / itemsToShow;  // Mover de acordo com a quantidade de itens visíveis
        track.style.transform = `translateX(-${currentIndex * percentageToMove}%)`;
    }
}

document.querySelector('.carousel-next').addEventListener('click', nextSlide);
document.querySelector('.carousel-prev').addEventListener('click', prevSlide);

carregarResumoDoDia();

renderCalendar();