import type { uuid } from "@/dtos";
import { DoctorsRepositoryBase } from "@/repositories";

interface InMemoryDoctor {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

export class DoctorsRepository extends DoctorsRepositoryBase {
	private doctors: InMemoryDoctor[] = [];
	async create(id: uuid): Promise<void> {
		const now = new Date();

		const doctor: InMemoryDoctor = {
			id,
			createdAt: now,
			updatedAt: now,
		};

		this.doctors.push(doctor);
	}

	async exists(id: uuid): Promise<boolean> {
		return this.doctors.some((doctor) => doctor.id === id);
	}

	async deleteById(id: uuid): Promise<boolean> {
		const doctorIndex = this.doctors.findIndex((doctor) => doctor.id === id);

		if (doctorIndex === -1) {
			return false;
		}

		this.doctors.splice(doctorIndex, 1);
		return true;
	}

	clear(): void {
		this.doctors = [];
	}

	count(): number {
		return this.doctors.length;
	}

	findAll(): InMemoryDoctor[] {
		return [...this.doctors];
	}
}
