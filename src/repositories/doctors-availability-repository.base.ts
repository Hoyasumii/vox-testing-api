import type { uuid } from "@/dtos";
import type {
	CreateDoctorAvailabilityDTO,
	DoctorAvailabilityDTO,
	UpdateDoctorAvailabilityDTO,
} from "@/dtos/doctors-availability";
import { CacheableRepositoryBase } from "@/types";

export abstract class DoctorsAvailabilityRepositoryBase extends CacheableRepositoryBase {
	abstract create(data: CreateDoctorAvailabilityDTO): Promise<void>;
	// TODO: Cache
	abstract findByDoctorId(id: uuid): Promise<Array<DoctorAvailabilityDTO>>;
	abstract deleteById(id: uuid): Promise<boolean>;
	// TODO: Remove Cache
	abstract deleteByDoctorId(id: uuid): Promise<number>;
	abstract update(
		id: uuid,
		content: UpdateDoctorAvailabilityDTO,
	): Promise<boolean>;
}
