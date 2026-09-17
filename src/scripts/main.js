document.addEventListener('DOMContentLoaded', function() {
    const btnCalcular = document.getElementById('btn-calcular');

    btnCalcular.addEventListener('click', function() {
        const totalInput = parseFloat(document.getElementById('valor-total').value);
        const pagoInput = parseFloat(document.getElementById('valor-pago').value);
        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.style.display = 'block';

        if (isNaN(totalInput) || isNaN(pagoInput)) {
            resultadoDiv.innerHTML = 'Por favor, preencha os dois campos com valores válidos.';
            return;
        }

        // Regra: valor mínimo da compra é R$ 0,10
        if (totalInput < 0.10) {
            resultadoDiv.innerHTML = 'O valor mínimo da compra é de <strong>R$ 0,10</strong>.';
            return;
        }

        if (pagoInput < totalInput) {
            const falta = (totalInput - pagoInput).toFixed(2);
            resultadoDiv.innerHTML = `Valor pago é insuficiente. Faltam <strong>R$ ${falta}</strong>.`;
            return;
        }

        if (pagoInput === totalInput) {
            resultadoDiv.innerHTML = 'Não há troco a ser dado.';
            return;
        }

        // Cálculo do troco bruto
        let trocoBruto = pagoInput - totalInput;

        // Regra: menor moeda em circulação é de R$ 0,05
        let troco = Math.round(trocoBruto / 0.05) * 0.05;
        troco = parseFloat(troco.toFixed(2));

        if (troco === 0) {
            resultadoDiv.innerHTML = `Troco de R$ ${trocoBruto.toFixed(2)} arredondado para R$ 0,00 (sem moedas de R$ 0,01).`;
            return;
        }

        const trocoInicial = troco;
        const cedulasEMoedas = [100, 50, 20, 10, 5, 2, 1, 0.50, 0.25, 0.10, 0.05];
        let detalhamentoTroco = [];

        // Trabalha com centavos inteiros para evitar erros de precisão no JS
        let trocoEmCentavos = Math.round(troco * 100);

        cedulasEMoedas.forEach(function(valor) {
            const valorEmCentavos = Math.round(valor * 100);
            const quantidade = Math.floor(trocoEmCentavos / valorEmCentavos);

            if (quantidade > 0) {
                const tipo = valor >= 2 ? 'nota(s)' : 'moeda(s)';
                detalhamentoTroco.push(`${quantidade} ${tipo}  de R$ ${valor.toFixed(2)}`);
                trocoEmCentavos = trocoEmCentavos % valorEmCentavos;
            }
        });

        let htmlResultado = `<p>Troco calculado: <strong>R$ ${trocoInicial.toFixed(2)}</strong></p><ul>`;
        detalhamentoTroco.forEach(function(item) {
            htmlResultado += `<li>${item}</li>`;
        });
        htmlResultado += '</ul>';

        resultadoDiv.innerHTML = htmlResultado;
    });
});