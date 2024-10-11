const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

let currentDate = new Date();
let appointments = {
    "2024-10-03": [
        { time: "09:00", name: "João Valente", service: "Dry needling e ventosa terapia" },
        { time: "13:00", name: "Maria Silva", service: "Consulta de rotina" }
    ]
};

async function fetchAppointments(date) {
    try {
        const response = await fetch(`/buscar-agendamentos?date=${date}`);
        const data = await response.json();

        // Organiza os agendamentos por data
        data.forEach(appointment => {
            const dateKey = appointment.data_hora.split('T')[0];
            if (!appointments[dateKey]) {
                appointments[dateKey] = [];
            }
            appointments[dateKey].push({
                time: appointment.data_hora.split('T')[1].slice(0, 5), // Pega o horário
                name: appointment.pessoa.nome,
                service: appointment.servico // Supondo que o serviço esteja na resposta
            });
        });
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
    }
}

// async function renderCalendar() {
//     const month = currentDate.getMonth();
//     const year = currentDate.getFullYear();
//
//     const monthYearElement = document.getElementById('month-year');
//     const weekdaysElement = document.getElementById('weekdays');
//     const calendarDaysElement = document.getElementById('calendar-days');
//
//     monthYearElement.textContent = `${monthNames[month]} ${year}`;
//     weekdaysElement.innerHTML = weekdays.map(day => `<div>${day}</div>`).join('');
//
//     const firstDay = new Date(year, month, 1).getDay();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//
//     console.log(`Rendering calendar for ${monthNames[month]} ${year}`);
//
//     calendarDaysElement.innerHTML = '';
//
//     for (let i = 0; i < firstDay; i++) {
//         calendarDaysElement.innerHTML += '<div></div>';
//     }
//
//     for (let day = 1; day <= daysInMonth; day++) {
//         const dayElement = document.createElement('div');
//         dayElement.textContent = day;
//         dayElement.classList.add('day');
//
//         const dayFormatted = String(day).padStart(2, '0');
//         const monthFormatted = String(month + 1).padStart(2, '0');
//         const fullDate = `${year}-${monthFormatted}-${dayFormatted}`;
//
//         console.log(`Checking appointments for date: ${fullDate}`);
//
//         // Buscar agendamentos para o dia
//         await fetchAppointments(fullDate); // Chama a função para buscar agendamentos
//
//         if (appointments[fullDate]) {
//             const appointmentCount = appointments[fullDate].length;
//             console.log(`Found ${appointmentCount} appointment(s) for ${fullDate}`);
//             dayElement.innerHTML += `<span class="appointment-count">${appointmentCount}</span>`;
//         } else {
//             console.log(`No appointments found for ${fullDate}`);
//         }
//
//         if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
//             dayElement.classList.add('today');
//         }
//
//         dayElement.addEventListener('click', () => {
//             document.getElementById('appointment-date').value = fullDate; // Set date for appointment
//
//             // Mostrar o popup de opções
//             document.getElementById('options-popup').classList.remove('hidden');
//
//             // Configura o botão "Ver Agendamentos"
//             document.getElementById('view-appointments-button').onclick = () => {
//                 document.getElementById('appointments-list').innerHTML = '';
//                 const dailyAppointments = appointments[fullDate] || [];
//                 if (dailyAppointments.length === 0) {
//                     document.getElementById('appointments-list').innerHTML = '<p>Nenhum agendamento para este dia.</p>';
//                 } else {
//                     dailyAppointments.forEach(appointment => {
//                         const appointmentElement = document.createElement('div');
//                         appointmentElement.innerHTML = `
//                             <p><strong>Horário:</strong> ${appointment.time}</p>
//                             <p><strong>Nome:</strong> ${appointment.name}</p>
//                             <p><strong>Serviço:</strong> ${appointment.service}</p>
//                             <hr>`;
//                         document.getElementById('appointments-list').appendChild(appointmentElement);
//                     });
//                 }
//                 document.getElementById('view-appointments-popup').classList.remove('hidden');
//                 document.getElementById('options-popup').classList.add('hidden');
//             };
//
//             // Configura o botão "Novo Agendamento"
//             document.getElementById('new-appointment-button').onclick = () => {
//                 document.getElementById('appointment-popup').classList.remove('hidden');
//                 document.getElementById('options-popup').classList.add('hidden');
//             };
//         });
//
//         calendarDaysElement.appendChild(dayElement);
//     }
// }

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

        if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            dayElement.classList.add('today');
        }

        dayElement.addEventListener('click', async () => {
            document.getElementById('appointment-date').value = fullDate;

            // Mostrar o popup de opções
            document.getElementById('options-popup').classList.remove('hidden');

            // Configura o botão "Ver Agendamentos"
            document.getElementById('view-appointments-button').onclick = async () => {
                document.getElementById('appointments-list').innerHTML = '';

                try {
                    const response = await fetch(`/buscar-agendamentos?date=${fullDate}`);
                    if (response.ok) {
                        const dailyAppointments = await response.json();

                        if (dailyAppointments.length === 0) {
                            document.getElementById('appointments-list').innerHTML = '<p>Nenhum agendamento para este dia.</p>';
                        } else {
                            dailyAppointments.forEach(appointment => {
                                const appointmentElement = document.createElement('div');
                                appointmentElement.innerHTML = `
                        <p><strong>Horário:</strong> ${new Date(appointment.data_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p><strong>Nome:</strong> ${appointment.pessoa.nome}</p>
                        <p><strong>Serviços:</strong> ${appointment.servicos.join(', ')}</p>
                        <hr>`;
                                document.getElementById('appointments-list').appendChild(appointmentElement);
                            });
                        }
                    } else {
                        console.error('Erro ao buscar agendamentos:', response.status);
                    }
                } catch (error) {
                    console.error('Erro ao buscar agendamentos:', error);
                }

                // Exibe o popup de agendamentos
                document.getElementById('view-appointments-popup').classList.remove('hidden');
                document.getElementById('options-popup').classList.add('hidden');
            };

            // Configura o botão "Novo Agendamento"
            document.getElementById('new-appointment-button').onclick = () => {
                document.getElementById('appointment-popup').classList.remove('hidden');
                document.getElementById('options-popup').classList.add('hidden');
            };
        });

        calendarDaysElement.appendChild(dayElement);
    }
}

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

    if (!idPessoa || servicos.length === 0) {
        alert("Por favor, selecione um paciente e pelo menos um serviço.");
        return;
    }

    const requestBody = {
        id_pessoa: idPessoa,
        date: date,
        time: time,
        servicos: servicos
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

renderCalendar();
