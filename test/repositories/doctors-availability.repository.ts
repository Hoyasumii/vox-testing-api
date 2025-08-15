import type { uuid } from "@/dtos";
import type {
	CreateDoctorAvailabilityDTO,
	DoctorAvailabilityDTO,
	UpdateDoctorAvailabilityDTO,
} from "@/dtos/doctors-availability";
import { DoctorsAvailabilityRepositoryBase } from "@/repositories";
import { randomUUID } from "node:crypto";

interface InMemoryDoctorAvailability {
	id: string;
	doctorId: string;
	dayOfWeek: number;
	startHour: number;
	endHour: number;
}

export class DoctorsAvailabilityRepository extends DoctorsAvailabilityRepositoryBase {
	private availabilities: InMemoryDoctorAvailability[] = [];

	private generateId(): string {
		return randomUUID();
	}

	async create(data: CreateDoctorAvailabilityDTO): Promise<void> {
		const id = this.generateId();

		const availability: InMemoryDoctorAvailability = {
			id,
			doctorId: data.doctorId,
			dayOfWeek: data.dayOfWeek,
			startHour: data.startHour,
			endHour: data.endHour,
		};

		this.availabilities.push(availability);
	}

	async findByDoctorId(id: uuid): Promise<Array<DoctorAvailabilityDTO>> {
		return this.availabilities
			.filter((availability) => availability.doctorId === id)
			.map((availability) => ({
				id: availability.id,
				doctorId: availability.doctorId,
				dayOfWeek: availability.dayOfWeek,
				startHour: availability.startHour,
				endHour: availability.endHour,
			}));
	}

	async deleteById(id: uuid): Promise<boolean> {
		const index = this.availabilities.findIndex((availability) => availability.id === id);

		if (index === -1) {
			return false;
		}

		this.availabilities.splice(index, 1);
		return true;
	}

	async deleteByDoctorId(id: uuid): Promise<number> {
		const initialCount = this.availabilities.length;
		this.availabilities = this.availabilities.filter(
			(availability) => availability.doctorId !== id
		);
		return initialCount - this.availabilities.length;
	}

	async update(
		id: uuid,
		content: UpdateDoctorAvailabilityDTO,
	): Promise<boolean> {
		const index = this.availabilities.findIndex((availability) => availability.id === id);

		if (index === -1) {
			return false;
		}

		const availability = this.availabilities[index];
		this.availabilities[index] = {
			...availability,
			...(content.dayOfWeek !== undefined && { dayOfWeek: content.dayOfWeek }),
			...(content.startHour !== undefined && { startHour: content.startHour }),
			...(content.endHour !== undefined && { endHour: content.endHour }),
		};

		return true;
	}

	// Métodos auxiliares para testes
	clear(): void {
		this.availabilities = [];
	}

	count(): number {
		return this.availabilities.length;
	}

	findAll(): InMemoryDoctorAvailability[] {
		return [...this.availabilities];
	}

	findById(id: uuid): InMemoryDoctorAvailability | null {
		return this.availabilities.find((availability) => availability.id === id) || null;
	}
}
