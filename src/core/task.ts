// import 3th party packages
import * as _ from "lodash/array";
import * as moment from "moment";

// import models
import { TaskStatus } from "./task-status";

export class Task {
	public name: string;
	public description: string;
	public status: TaskStatus;
	public log: any[];

	constructor(name: string, values: any) {
		this.name = name;
		this.description = values ? values.description : "";
		this.status = values ? values.status : TaskStatus.IN_PROGRESS;
		this.log = values ? values.log : [];
	}

	public setDescription(description: string): void {
		this.description = description ? description : this.description ? this.description : "";
	}

	public setStatus(status: TaskStatus): void {
		this.status = status;
	}

	public start(description: string): boolean {
		if (this.status === TaskStatus.IN_PROGRESS) {
			console.log("This task already has been started.");
			return false;
		}
		this.log.push({
			start: moment().format(),
		});
		this.setDescription(description);
		this.setStatus(TaskStatus.IN_PROGRESS);
		return true;
	}

	public stop(status: TaskStatus): boolean {
		let lastTime = _.last(this.log);
		if (this.status === status) {
			let msg = status === TaskStatus.FINISHED ? "completed" : "paused";
			console.log("This task already has been %s.", msg);
			return false;
		}
		if (lastTime && !lastTime.stop) {
			this.log[this.log.length - 1].stop = moment().format();
		}
		this.setStatus(status);
		return true;
	}
}
