document.addEventListener('DOMContentLoaded', () => {
    const image = document.getElementById('image');
    const imageView = document.getElementById('image-view');
    const occultInput = document.getElementById('occult-input'); // Seleciona o texto e ícone
    const form = document.querySelector('.form-cadastro');

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
            occultInput.style.visibility = 'hidden'; // Esconde o texto e ícone, mas mantém a área ocupada
            console.log('Imagem selecionada:', image.files[0]);
        } else {
            console.error('Nenhuma imagem selecionada.');
            occultInput.style.visibility = 'visible'; // Mostra o texto novamente se não houver imagem
        }
    });

    // Função para enviar o formulário com a imagem e outros dados
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previne o envio padrão do formulário

        const formData = new FormData();

        // Adiciona todos os campos do formulário ao FormData
        const formElements = form.elements;
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if (element.name && element.type !== 'file') {
                formData.append(element.name, element.value);
            }
        }

        // Adiciona a imagem ao FormData (apenas uma vez)
        if (image.files.length > 0) {
            formData.append('image', image.files[0]);
        } else {
            console.warn('Nenhuma imagem foi adicionada ao FormData.');
        }

        try {
            const response = await fetch('/api/pessoas', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                alert('Pessoa cadastrada com sucesso!');
                form.reset(); // Limpa o formulário após o sucesso
                imageView.style.backgroundImage = ''; // Limpa a visualização da imagem
                occultInput.style.visibility = 'visible'; // Mostra o texto novamente
            } else {
                const errorData = await response.json();
                console.error('Erro ao cadastrar pessoa:', errorData);
                alert('Erro ao cadastrar pessoa: ' + errorData.error);
            }
        } catch (error) {
            console.error('Erro ao criar pessoa:', error);
            alert('Erro ao cadastrar pessoa.');
        }
    });
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
