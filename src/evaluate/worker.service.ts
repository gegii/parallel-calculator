import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { join } from 'path';

@Injectable()
export class WorkerService {
  evaluatePostfix(postfix: string[]): Promise<number> {
    return new Promise((resolve, reject) => {
      const workerFilePath = join(process.cwd(), 'src/evaluate/worker.ts');

      const worker = new Worker(workerFilePath, {
        workerData: { postfix },
      });

      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }
}
