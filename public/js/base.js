const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

let currentDate = new Date();
let appointments = {
    "2024-10-03": [
        { time: "09:00", name: "João Valente", service: "Dry needling e ventosa terapia" },
        { time: "13:00", name: "Maria Silva", service: "Consulta de rotina" }
    ]
};

function renderCalendar() {
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

        dayElement.addEventListener('click', () => {
            document.getElementById('options-popup').classList.remove('hidden');
            document.getElementById('appointment-date').value = fullDate;

            // "Ver Agendamentos" action
            document.getElementById('view-appointments-button').onclick = () => {
                document.getElementById('appointments-list').innerHTML = '';
                const dailyAppointments = appointments[fullDate] || [];
                if (dailyAppointments.length === 0) {
                    document.getElementById('appointments-list').innerHTML = '<p>Nenhum agendamento para este dia.</p>';
                } else {
                    dailyAppointments.forEach(appointment => {
                        const appointmentElement = document.createElement('div');
                        appointmentElement.innerHTML = `
                                <p><strong>Horário:</strong> ${appointment.time}</p>
                                <p><strong>Nome:</strong> ${appointment.name}</p>
                                <p><strong>Serviço:</strong> ${appointment.service}</p>
                                <hr>
                            `;
                        document.getElementById('appointments-list').appendChild(appointmentElement);
                    });
                }
                document.getElementById('view-appointments-popup').classList.remove('hidden');
                document.getElementById('options-popup').classList.add('hidden');
            };

            // "Novo Agendamento" action
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
        document.getElementById('name-suggestions').innerHTML = '';  // Limpa as sugestões após perder o foco
        document.getElementById('name-suggestions').style.display = 'none';  // Oculta a caixa de sugestões
    }, 200);  // Um pequeno atraso para permitir a seleção de um nome
});

document.getElementById('appointment-name').addEventListener('input', async function() {
    const searchTerm = this.value;

    if (inputFocused && searchTerm.length > 1) {
        try {
            const response = await fetch(`/buscar-pessoas?term=${searchTerm}`);
            const pessoas = await response.json();

            const suggestionsBox = document.getElementById('name-suggestions');
            suggestionsBox.innerHTML = '';  // Limpa sugestões anteriores

            pessoas.forEach(pessoa => {
                const suggestion = document.createElement('div');
                suggestion.textContent = pessoa.nome;
                suggestion.classList.add('suggestion-item');
                suggestion.addEventListener('click', () => {
                    document.getElementById('appointment-name').value = pessoa.nome;
                    document.getElementById('appointment-patient-id').value = pessoa.id;  // Armazena o ID da pessoa
                    suggestionsBox.innerHTML = '';  // Limpa as sugestões após a seleção
                    suggestionsBox.style.display = 'none';  // Oculta a caixa de sugestões
                });
                suggestionsBox.appendChild(suggestion);
            });

            if (pessoas.length > 0) {
                suggestionsBox.style.display = 'block';  // Mostra a caixa de sugestões se houver resultados
            } else {
                suggestionsBox.style.display = 'none';  // Oculta a caixa se não houver sugestões
            }
        } catch (error) {
            console.error('Erro ao buscar pessoas:', error);
        }
    } else {
        document.getElementById('name-suggestions').style.display = 'none';  // Oculta sugestões se não houver caracteres suficientes
    }
});

document.getElementById('appointment-service').addEventListener('input', async function() {
    const searchTerm = this.value;
    console.log("Buscando serviços para:", searchTerm);  // Verifica se a função está sendo chamada

    if (searchTerm.length > 1) {
        try {
            const response = await fetch(`/buscar-servicos?term=${searchTerm}`);
            const servicos = await response.json();
            console.log("Serviços encontrados:", servicos);  // Verifica se os dados estão sendo retornados

            const suggestionsBox = document.getElementById('service-suggestions');
            suggestionsBox.innerHTML = '';  // Limpa as sugestões anteriores

            servicos.forEach(servico => {
                const suggestion = document.createElement('div');
                suggestion.textContent = servico.nome;
                suggestion.classList.add('suggestion-item');
                suggestion.addEventListener('click', () => {
                    document.getElementById('appointment-service').value = servico.nome;
                    document.getElementById('appointment-service-id').value = servico.id;  // Armazena o ID do serviço
                    suggestionsBox.innerHTML = '';  // Limpa as sugestões após a seleção
                    suggestionsBox.style.display = 'none';  // Oculta a caixa de sugestões
                });
                suggestionsBox.appendChild(suggestion);
            });

            if (servicos.length > 0) {
                suggestionsBox.style.display = 'block';  // Mostra a caixa de sugestões se houver resultados
            } else {
                suggestionsBox.style.display = 'none';  // Oculta a caixa se não houver sugestões
            }
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
        }
    } else {
        document.getElementById('service-suggestions').style.display = 'none';  // Oculta sugestões se não houver caracteres suficientes
    }
});


renderCalendar();
