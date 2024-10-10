// function anexarArquivos() {
//     const inputAnexo = document.createElement('input');
//     inputAnexo.type = 'file';
//     inputAnexo.multiple = true;
//
//     inputAnexo.onchange = () => {
//         const listaArquivos = document.querySelector('.lista-arquivos');
//         listaArquivos.innerHTML = '';
//
//         const arquivos = inputAnexo.files;
//         for (let i = 0; i < arquivos.length; i++) {
//             const itemArquivo = document.createElement('li');
//             itemArquivo.textContent = arquivos[i].name;
//
//             const botaoRemover = document.createElement('button');
//             botaoRemover.textContent = 'Remover';
//             botaoRemover.addEventListener('click', () => {
//                 itemArquivo.remove();
//             });
//
//             itemArquivo.appendChild(botaoRemover);
//             listaArquivos.appendChild(itemArquivo);
//         }
//     };
//     inputAnexo.click();
// }
//
// document.querySelector('.btn-anexar').addEventListener('click', anexarArquivos);

document.getElementById('input-cpf').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = value;
});

document.getElementById('input-telefone').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
    if (value.length > 14) {
        value = value.replace(/(\d{5})(\d{4})$/, '$1-$2');
    }
    e.target.value = value;
});