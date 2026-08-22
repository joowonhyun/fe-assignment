import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
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

  @Patch()
  updateStatuses(@Body() dto: BulkUpdateCampaignStatusDto) {
    return this.campaignsService.updateStatuses(dto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMany(@Body() dto: BulkDeleteCampaignsDto) {
    return this.campaignsService.removeMany(dto);
  }
}
