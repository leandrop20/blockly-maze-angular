export const HELP_TEXTS: any = {
	/*	LEVEL 1	*/
	stack: `
		<tr>
			<td><img src="assets/blockly/help.png"></td>
			<td>&nbsp;</td>
			<td>Empilhe alguns blocos 'avançar' juntos para me ajudar a alcançar o objetivo.</td>
			<td valign="top">
				<img src="assets/blockly/help_stack.png" class="mirrorImg" height=63 width=136>
			</td>
		</tr>
	`,
	oneTopBlock: `
		<tr>
			<td><img src="assets/blockly/help.png"></td>
			<td>&nbsp;</td>
			<td>
				Neste nível, você deve empilhar todos os blocos na área de trabalho branca.
				<div id="sampleOneTopBlock" class="readonly"></div>
			</td>
		</tr>
	`,
	run: `
		<tr>
			<td>Execute seu programa para ver o que acontece.</td>
			<td rowspan=2><img src="assets/blockly/help.png"></td>
		</tr>
		<tr>
			<td>
				<div>
					<img src="assets/blockly/help_run.png" class="mirrorImg" height=27 width=141>
				</div>
			</td>
		</tr>
	`,
	/*	LEVEL 2	*/
	reset: `
		<tr>
			<td>Seu programa não resolveu o labirinto. Aperte 'Reiniciar' e tente novamente.</td>
			<td rowspan=2><img src="assets/blockly/help.png"></td>
		</tr>
		<tr>
			<td>
				<div>
					<img src="assets/blockly/help_run.png" class="mirrorImg" height=27 width=141>
				</div>
			</td>
		</tr>
	`,
	/*	LEVEL 3	*/
	repeat: `
		<tr>
			<td><img src="assets/blockly/help_up.png"></td>
			<td>
				Alcance o fim deste caminho usando apenas dois blocos.
				Use 'repetir' para executar um bloco mais de uma vez.
			</td>
			<td><img src="assets/blockly/help.png"></td>
		</tr>
	`,
	/*	LEVEL 4	*/
	capacity: `
		<tr>
			<td><img src="assets/blockly/help.png"></td>
			<td>&nbsp;</td>
			<td>
				Você usou todos os blocos para este nível. Para criar um novo bloco, 
				você primeiro deve deletar um bloco existente.
			</td>
		</tr>
	`,
	repeatMany: `
		<tr>
			<td><img src="assets/blockly/help_up.png"></td>
			<td>Você pode encaixar mais de um bloco dentro de um bloco 'repetir'.</td>
			<td><img src="assets/blockly/help.png"></td>
		</tr>
	`,
	/*	LEVEL 6	*/
	if: `
		<tr>
			<td><img src="assets/blockly/help_up.png"></td>
			<td>
				Um bloco 'se' fará alguma coisa apenas se a condição for verdadeira.
				Tente virar á esquerda se houver um caminho para a esquerda.
			</td>
			<td><img src="assets/blockly/help.png"></td>
		</tr>
	`,
	/*	LEVEL 7	*/
	menu: `
		<tr>
			<td><img src="assets/blockly/help_up.png"></td>
			<td id="helpMenuText">Clique em %1 no bloco 'se' para mudar sua condição.</td>
			<td><img src="assets/blockly/help.png"></td>
		</tr>
	`,
	/*	LEVEL 9	*/
	ifElse: `
		<tr>
			<td><img src="assets/blockly/help_down.png"></td>
			<td>Blocos se-senão farão uma coisa ou outra.</td>
			<td><img src="assets/blockly/help.png"></td>
		</tr>
	`
};