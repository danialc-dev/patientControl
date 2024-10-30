document.addEventListener('DOMContentLoaded', async () => {
    const image = document.getElementById('image');
    const imageView = document.getElementById('image-view');
    const occultInput = document.getElementById('occult-input'); // Seleciona o texto e ícone
    const form = document.querySelector('.form-cadastro');
    const cancelButton = document.getElementById('btn-cancel'); // Botão de cancelar

    // Variável global para pegar parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const pessoaId = urlParams.get('id'); // Verifica se é edição

    // Se estiver no modo de edição, buscar dados da pessoa
    if (pessoaId) {
        try {
            const response = await fetch(`/pessoas/${pessoaId}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar dados da pessoa');
            }

            const pessoa = await response.json();
            preencherFormulario(pessoa);
        } catch (error) {
            console.error('Erro ao carregar dados da pessoa:', error);
        }
    }

    // Função para visualizar a imagem selecionada
    image.addEventListener('change', () => {
        if (image.files.length > 1) {
            alert('Por favor, selecione apenas uma imagem.');
            image.value = ''; // Limpa o campo de arquivo
            imageView.style.backgroundImage = ''; // Limpa a visualização da imagem
            occultInput.style.visibility = 'visible'; // Mostra o texto novamente
            return;
        }

        if (image.files.length > 0) {
            const imgLink = URL.createObjectURL(image.files[0]);
            imageView.style.backgroundImage = `url(${imgLink})`;
            occultInput.style.visibility = 'hidden'; // Esconde o texto e ícone
            console.log('Imagem selecionada:', image.files[0]);
        } else {
            console.error('Nenhuma imagem selecionada.');
            occultInput.style.visibility = 'visible'; // Mostra o texto novamente se não houver imagem
        }
    });

    // Função para preencher o formulário com os dados da pessoa
    function preencherFormulario(pessoa) {
        document.getElementById('input-nome').value = pessoa.nome;
        document.getElementById('input-email').value = pessoa.email;
        document.getElementById('input-dt-nasc').value = pessoa.data_nascimento;
        document.getElementById('input-cpf').value = pessoa.cpf;
        document.getElementById('input-telefone').value = pessoa.telefone;
        document.getElementById('hpp').value = pessoa.hpp;
        document.getElementById('hma').value = pessoa.hma;
        document.getElementById('diag-clinic').value = pessoa.diagnostico_clinico;
        document.getElementById('diag-fisio').value = pessoa.diagnostico_fisio;
        document.getElementById('obs').value = pessoa.observacoes;
        document.getElementById('medicines').value = pessoa.medicamentos;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previne o envio padrão do formulário

        const formData = new FormData(form);
        const method = pessoaId ? 'PATCH' : 'POST'; // PATCH para edição, POST para criação
        const url = pessoaId ? `/pessoas/${pessoaId}` : '/pessoas';

        try {
            const response = await fetch(url, {
                method: method,
                body: formData
            });

            if (response.ok) {
                if (pessoaId) {
                    alert('Pessoa atualizada com sucesso!');
                } else {
                    alert('Pessoa criada com sucesso!');
                }
                window.location.href = '/listagemPaciente';
            } else {
                const errorData = await response.json();
                console.error('Erro ao enviar pessoa:', errorData);
                alert('Erro ao enviar pessoa: ' + errorData.error);
            }
        } catch (error) {
            console.error('Erro ao enviar pessoa:', error);
            alert('Erro ao enviar pessoa.');
        }
    });


    // Lógica para o botão de cancelar
    cancelButton.addEventListener('click', () => {
        window.location.href = '/listagemPaciente'; // Redireciona para a lista de pacientes
    });

    // Máscara para o campo CPF
    document.getElementById('input-cpf').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });

    // Máscara para o campo Telefone
    document.getElementById('input-telefone').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
        if (value.length > 14) {
            value = value.replace(/(\d{5})(\d{4})$/, '$1-$2');
        }
        e.target.value = value;
    });
});
