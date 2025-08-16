import type { uuid } from "@/dtos";
import type {
	CreateDoctorAvailabilityDTO,
	DoctorAvailabilityDTO,
	UpdateDoctorAvailabilityDTO,
} from "@/dtos/doctors-availability";
import { RepositoryBase } from "@/types";

export abstract class DoctorsAvailabilityRepositoryBase extends RepositoryBase {
	abstract create(data: CreateDoctorAvailabilityDTO): Promise<void>;
	abstract findById(id: uuid): Promise<DoctorAvailabilityDTO | null>;
	abstract findByDoctorId(id: uuid): Promise<Array<DoctorAvailabilityDTO>>;
	abstract deleteById(id: uuid): Promise<boolean>;
	abstract deleteByDoctorId(id: uuid): Promise<number>;
	abstract update(
		id: uuid,
		content: UpdateDoctorAvailabilityDTO,
	): Promise<boolean>;
}
