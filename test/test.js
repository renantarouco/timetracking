const assert = require('assert');
const time = require('../lib/core/timetracking');
const taskStatus = require('../lib/core/task-status');

const Configstore = require('configstore');
const pkg = require('../package.json');

const TEST_NAMESPACE = `${pkg.name}_test`;

const config = new Configstore(TEST_NAMESPACE, {
	config: {
		date_format: 'MM/dd/yyyy',
		pause_others_on_start: true
	},
	tasks: []
});

const timetracking = new time.Timetracking(config);

describe(`${pkg.name} - ${pkg.description}`, () => {

	before(() => {
		config.set('tasks', []);
	});

	it(':: start a new task', () => {
		timetracking.start('new task', 'this is a new task', true);
		let tasks = config.get('tasks');
		assert.equal(tasks.length, 1);
		assert.equal(tasks[0].status, 0)
	});
	
	it(':: list all tasks by creation date', () => {
		timetracking.list(new Date());
	});

	it(':: list tasks from a begin date until now', () => {
		timetracking.list(new Date(), {begin: new Date() -1});
	});

	it(':: list tasks from now until an end date', () => {
		timetracking.list(new Date(), {end: new Date() + 1});
	});

	it(':: list tasks within an interval', () => {
		timetracking.list({begin: new Date() - 1, end: new Date + 1});
	});

	it(':: pause task', () => {
		let date = new Date();
		let formattedDate = `${date.getHours()}:${date.getMinutes().toString().length == 1 ? '0' + date.getMinutes(): date.getMinutes()}`;
		timetracking.stop('new task', taskStatus.TaskStatus.PAUSED, formattedDate);
		let tasks = config.get('tasks');
		assert.equal(tasks.length, 1);
		assert.equal(tasks[0].status, 1)
	});

	it(':: stop task', () => {
		let date = new Date();
		let formattedDate = `${date.getHours()}:${date.getMinutes().toString().length == 1 ? '0' + date.getMinutes(): date.getMinutes()}`;
		timetracking.stop('new task', taskStatus.TaskStatus.FINISHED, formattedDate);
		let tasks = config.get('tasks');
		assert.equal(tasks.length, 1);
		assert.equal(tasks[0].status, 2)		
	});
				
	after(() => {
		config.set('tasks', []);
	});
});