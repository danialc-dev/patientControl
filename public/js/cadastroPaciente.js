document.addEventListener('DOMContentLoaded', () => {
    const image = document.getElementById('image');
    const imageView = document.getElementById('image-view');
    const occultInput = document.getElementById('occult-input');
    const form = document.querySelector('.form-cadastro');

    // Função para exibir uma pop-up personalizada
    function showPopup(message, color) {
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.textContent = message;
        popup.style.backgroundColor = color;
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.classList.add('show');
        }, 100);

        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        }, 3000);
    }

    // Função para visualizar a imagem selecionada
    image.addEventListener('change', () => {
        if (image.files.length > 1) {
            showPopup('Por favor, selecione apenas uma imagem.', '#dcb004'); // Pop-up amarela
            image.value = '';
            imageView.style.backgroundImage = '';
            occultInput.style.visibility = 'visible';
            return;
        }

        if (image.files.length > 0) {
            const imgLink = URL.createObjectURL(image.files[0]);
            imageView.style.backgroundImage = `url(${imgLink})`;
            occultInput.style.visibility = 'hidden';
            console.log('Imagem selecionada:', image.files[0]);
        } else {
            showPopup('Nenhuma imagem selecionada.', '#dcb004'); // Pop-up amarela
            occultInput.style.visibility = 'visible';
        }
    });

    // Função para enviar o formulário com a imagem e outros dados
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData();
        const formElements = form.elements;
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if (element.name && element.type !== 'file') {
                formData.append(element.name, element.value);
            }
        }

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
                showPopup('Pessoa cadastrada com sucesso!', '#419744'); // Pop-up verde
                form.reset();
                imageView.style.backgroundImage = '';
                occultInput.style.visibility = 'visible';
            } else {
                const errorData = await response.json();
                showPopup('Erro ao cadastrar pessoa: ' + errorData.error, '#dcb004'); // Pop-up amarela
                console.error('Erro ao cadastrar pessoa:', errorData);
            }
        } catch (error) {
            console.error('Erro ao criar pessoa:', error);
            showPopup('Erro ao cadastrar pessoa: ', '#dcb004'); // Pop-up amarela
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