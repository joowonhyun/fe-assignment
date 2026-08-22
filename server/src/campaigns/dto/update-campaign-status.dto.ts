import { IsIn } from 'class-validator';
import { STATUSES } from '../campaign.constants';
import type { Status } from '../campaign.constants';

export class UpdateCampaignStatusDto {
  @IsIn(STATUSES, {
    message: `상태값은 ${STATUSES.join(', ')} 중 하나여야 합니다.`,
  })
  status: Status;
}
