import { InterpreterType } from '../enums/InterpreterType';
import { DirectionType } from '../enums/DirectionType';

export class Run {

	public static INTERVAL: number = 20;

	static exec(interpreter, scope, workspace, callback = null) {
		var wrapper: Function;
		
		wrapper = function (id) {
			callback(InterpreterType.MOVE, DirectionType.NORTH, id);
		};
		interpreter.setProperty(scope, 'moveForward', interpreter.createNativeFunction(wrapper));

		wrapper = function (id) {
			callback(InterpreterType.MOVE, DirectionType.SOUTH, id);
		};
		interpreter.setProperty(scope, 'moveBackward', interpreter.createNativeFunction(wrapper));

		wrapper = function (id) {
			callback(InterpreterType.TURN, DirectionType.WEST, id);
		};
		interpreter.setProperty(scope, 'turnLeft', interpreter.createNativeFunction(wrapper));

		wrapper = function (id) {
			callback(InterpreterType.TURN, DirectionType.EAST, id);
		};
		interpreter.setProperty(scope, 'turnRight', interpreter.createNativeFunction(wrapper));

		wrapper = function (id) {
			return callback(InterpreterType.IS_PATH, DirectionType.NORTH, id);
		};
		interpreter.setProperty(scope, 'isPathForward', interpreter.createNativeFunction(wrapper));

		wrapper = function (id) {
			return callback(InterpreterType.IS_PATH, DirectionType.EAST, id);
		};
		interpreter.setProperty(scope, 'isPathRight', interpreter.createNativeFunction(wrapper));

		wrapper = function (id) {
			return callback(InterpreterType.IS_PATH, DirectionType.SOUTH, id);
		};
		interpreter.setProperty(scope, 'isPathBackward', interpreter.createNativeFunction(wrapper));

		wrapper = function (id) {
			return callback(InterpreterType.IS_PATH, DirectionType.WEST, id);
		};
		interpreter.setProperty(scope, 'isPathLeft', interpreter.createNativeFunction(wrapper));

		wrapper = function (id) {
			return callback(InterpreterType.NOT_DONE, null, id);
		};
		interpreter.setProperty(scope, 'notDone', interpreter.createNativeFunction(wrapper));
	}

}