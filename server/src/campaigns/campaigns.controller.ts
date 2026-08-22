import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';
import {
  BulkDeleteCampaignsDto,
  BulkUpdateCampaignStatusDto,
} from './dto/bulk-campaign.dto';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  findAll() {
    return this.campaignsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(dto);
  }

  // 벌크 먼저. `PATCH /campaigns`와 `PATCH /campaigns/:id`는 경로가 달라 충돌하지 않는다.
  @Patch()
  updateStatuses(@Body() dto: BulkUpdateCampaignStatusDto) {
    return this.campaignsService.updateStatuses(dto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMany(@Body() dto: BulkDeleteCampaignsDto) {
    return this.campaignsService.removeMany(dto);
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateCampaignStatusDto) {
    return this.campaignsService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }
}
