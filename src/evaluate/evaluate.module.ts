import { Module } from '@nestjs/common';
import { EvaluateController } from './evaluate.controller';
import { EvaluateService } from './evaluate.service';
import { WorkerService } from './worker.service';

@Module({
  controllers: [EvaluateController],
  providers: [EvaluateService, WorkerService],
})
export class EvaluateModule {}
