import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthController', () => {
  const queryRaw = jest.fn().mockRejectedValue(new Error('DB 연결 불가'));
  const deadPrisma = { $queryRaw: queryRaw } as unknown as PrismaService;

  const controller = new HealthController(deadPrisma);

  it('liveness는 DB가 죽어 있어도 200을 반환한다', () => {
    expect(controller.live()).toEqual({ status: 'ok' });
    expect(queryRaw).not.toHaveBeenCalled();
  });

  it('readiness는 DB가 죽어 있으면 실패한다', async () => {
    await expect(controller.check()).rejects.toThrow('DB 연결 불가');
  });
});
