import { uuid } from "@/dtos";
import type { ScheduleResponseDTO } from "@/dtos/schedules";
import type { ScheduleRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class GetScheduleByIdService extends Service<
  ScheduleRepositoryBase,
  uuid,
  ScheduleResponseDTO
> {
  async run(id: uuid): Promise<ScheduleResponseDTO> {
    const { success } = uuid.safeParse(id);

    if (!success) return this.repository.errors.badRequest();

    const targetSchedule = await this.repository.findById(id);

    if (!targetSchedule) return this.repository.errors.notFound();

    return targetSchedule;
  }
}
