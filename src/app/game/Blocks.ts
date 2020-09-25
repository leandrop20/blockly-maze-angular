import * as Blockly from 'blockly';

export class Blocks {

	static create(imgMarker: string) {
		Blockly.Blocks['ucode_exec'] = {
			init: function () {
				this.jsonInit({
					message0: 'executar',
					colour: 345,
					nextStatement: null,
				});
			}
		};

		Blockly.Blocks['ucode_moveForward'] = {
			init: function () {
				this.jsonInit({
					message0: 'avançar',
					colour: 290,
					previousStatement: null,
					nextStatement: null,
					tooltip: 'Move o jogador um espaço para frente.'
				});
			}
		};

		Blockly.Blocks['ucode_turn'] = {
			init: function () {
				this.jsonInit({
					message0: 'vire à %1',
					colour: 290,
					previousStatement: null,
					nextStatement: null,
					tooltip: 'Vira o jogador 90 graus para esquerda ou direita.',
					args0: [{
						type: 'field_dropdown',
						name: 'DIR',
						options: [
							['esquerda ↺', 'turnLeft'],
							['direita ↻', 'turnRight']
						]
					}]
				});
			}
		};

		Blockly.Blocks['ucode_if'] = {
			init: function () {
				this.jsonInit({
					message0: 'se caminho à %1',
					colour: 210,
					previousStatement: true,
					nextStatement: true,
					tooltip: `Se há um caminho na direção especificada, 
						\\nentão faça algumas ações.`,
					args0: [{
						type: 'field_dropdown',
						name: 'DIR',
						options: [
							[' frente', 'isPathForward'],
							['esquerda ↺', 'isPathLeft'],
							['direita ↻', 'isPathRight']
						]
					}],
					message1: 'faça %1',
					args1: [{
						type: 'input_statement',
						name: 'DO'
					}],
				});
			}
		};

		Blockly.Blocks['ucode_ifElse'] = {
			init: function () {
				this.jsonInit({
					message0: 'se caminho à %1',
					colour: 210,
					previousStatement: null,
					nextStatement: null,
					tooltip: `Se há um caminho na direção especificada, 
						\\nentão faça o primeiro bloco de ações. 
						\\nCaso contrário, faça o segundo bloco de \\nações.`,
					args0: [{
						type: 'field_dropdown',
						name: 'DIR',
						options: [
							[' frente', 'isPathForward'],
							['esquerda ↺', 'isPathLeft'],
							['direita ↻', 'isPathRight']
						]
					}],
					message1: 'faça %1',
					args1: [{
						type: 'input_statement',
						name: 'DO'
					}],
					message2: 'senão %1',
					args2: [{
						type: 'input_statement',
						name: 'ELSE'
					}]
				});
			}
		};

		Blockly.Blocks['ucode_forever'] = {
			init: function () {
				this.jsonInit({
					message0: 'repetir até %1',
					colour: 120,
					previousStatement: null,
					tooltip: 'Repetir as ações inclusas até que o ponto final \\nseja alcançado.',
					args0: [{
						type: 'field_image',
						src: imgMarker,
						width: 12,
						height: 16,
						alt: '*'
					}],
					message1: 'faça %1',
					args1: [{
						type: 'input_statement',
						name: 'DO'
					}]
				});
			}
		};

		Object(Blockly).JavaScript['ucode_exec'] = function (block) { return ''; };

		Object(Blockly).JavaScript['ucode_moveForward'] = function (block) {
			return 'moveForward(\'block_id_' + block.id + '\');\n';
		};

		Object(Blockly).JavaScript['ucode_turn'] = function (block) {
			let dir: string = block.getFieldValue('DIR');
			return dir + '(\'block_id_' + block.id + '\');\n';
		};

		Object(Blockly).JavaScript['ucode_if'] = function (block) {
			let argument: string = block.getFieldValue('DIR') + '(\'block_id_' + block.id + '\')';
			let branch: string = Object(Blockly).JavaScript.statementToCode(block, 'DO');
			
			return 'if (' + argument + ') {\n' + branch + '}\n';
		};

		Object(Blockly).JavaScript['ucode_ifElse'] = function (block) {
			let argument: string = block.getFieldValue('DIR') + '(\'block_id_' + block.id + '\')';
			let branch0: string = Object(Blockly).JavaScript.statementToCode(block, 'DO');
			let branch1: string = Object(Blockly).JavaScript.statementToCode(block, 'ELSE');

			return 'if (' + argument + ') {\n' + branch0 + '} else {\n' + branch1 + '}\n';
		};

		Object(Blockly).JavaScript['ucode_forever'] = function (block) {
			let branch: string = Object(Blockly).JavaScript.statementToCode(block, 'DO');

			if (Object(Blockly).JavaScript.INFINITE_LOOP_TRAP) {
				branch = Object(Blockly).JavaScript.INFINITE_LOOP_TRAP
					.replace(/%1/g, '\'block_id_' + block.id + '\'') + branch;
			}

			return 'while (notDone()) {\n' + branch + '}\n';
		}
	}

}