import { ArrayNotEmpty, IsArray, IsIn, IsString } from 'class-validator';
import { STATUSES } from '../campaign.constants';
import type { Status } from '../campaign.constants';

class BulkIdsDto {
  @IsArray()
  @ArrayNotEmpty({ message: '대상 캠페인을 1개 이상 선택해주세요.' })
  @IsString({ each: true, message: '캠페인 ID는 문자열이어야 합니다.' })
  ids: string[];
}

export class BulkDeleteCampaignsDto extends BulkIdsDto {}

export class BulkUpdateCampaignStatusDto extends BulkIdsDto {
  @IsIn(STATUSES, {
    message: `상태값은 ${STATUSES.join(', ')} 중 하나여야 합니다.`,
  })
  status: Status;
}
