import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/public.decorator';

@Public()
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Liveness — 프로세스가 살아있는지만 확인한다. **절대 DB를 건드리지 말 것.**
   * Render 무료 티어 슬립 방지용 5분 간격 외부 핑(UptimeRobot)이 여기를 때린다.
   * 여기서 DB를 조회하면 Neon compute가 scale-to-zero를 못 해 24시간 가동되고,
   * 무료 compute 시간 한도를 소진해 DB가 정지된다(2026-08 실제 장애 원인).
   */
  @Get('live')
  live() {
    return { status: 'ok' };
  }

  /** Readiness — DB까지 실제로 응답하는지 확인한다. 외부 모니터로 주기 호출 금지. */
  @Get()
  async check() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok' };
  }
}
