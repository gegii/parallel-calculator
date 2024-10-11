import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EvaluateController } from './evaluate/evaluate.controller';
import { EvaluateService } from './evaluate/evaluate.service';
import { EvaluateModule } from './evaluate/evaluate.module';
import { WorkerService } from './evaluate/worker.service';

@Module({
  imports: [EvaluateModule],
  controllers: [AppController, EvaluateController],
  providers: [AppService, EvaluateService, WorkerService],
})
export class AppModule {}
