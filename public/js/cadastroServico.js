document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-cadastroServico');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Capturando os dados do formulário
        const nome = document.querySelector('#input-nome').value;
        const descricao = document.querySelector('#txtDescricao').value;

        try {
            const response = await fetch('/criar-servicos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, descricao })
            });

            if (response.ok) {
                const novoServico = await response.json();
                alert('Serviço cadastrado com sucesso!');
                form.reset(); // Limpa o formulário após o sucesso
            } else {
                const error = await response.json();
                alert('Erro ao cadastrar serviço: ' + error.error);
            }
        } catch (err) {
            console.error('Erro na requisição:', err);
            alert('Erro ao cadastrar serviço.');
        }
    });
});
