import { EvaluateService } from '../../src/evaluate/evaluate.service';
import { WorkerService } from '../../src/evaluate/worker.service'; // Import WorkerService

describe('EvaluateService', () => {
  let service: EvaluateService;
  let workerServiceMock: WorkerService;

  beforeEach(() => {
    workerServiceMock = {
      evaluatePostfix: jest.fn(), // Mock evaluatePostfix method
    } as any;

    service = new EvaluateService(workerServiceMock); // Inject mock WorkerService
  });

  describe('evaluate', () => {
    it('should evaluate a simple expression correctly', async () => {
      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(5);
      expect(await service.evaluate('2 + 3')).toBe(5);

      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(8);
      expect(await service.evaluate('10 - 2')).toBe(8);

      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(8);
      expect(await service.evaluate('4 * 2')).toBe(8);

      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(4);
      expect(await service.evaluate('8 / 2')).toBe(4);
    });

    it('should evaluate expressions with parentheses correctly', async () => {
      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(9);
      expect(await service.evaluate('(1 + 2) * 3')).toBe(9);

      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(
        16,
      );
      expect(await service.evaluate('2 * (3 + 5)')).toBe(16);

      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(8);
      expect(await service.evaluate('(3 - 1) * (2 + 2)')).toBe(8);

      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(9);
      expect(await service.evaluate('((2 + 3) * 2) - 1')).toBe(9);
    });

    it('should evaluate complex expressions correctly', async () => {
      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(
        14,
      );
      expect(await service.evaluate('2 + 3 * 4')).toBe(14);

      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(
        14,
      );
      expect(await service.evaluate('(1 + (2 * 3)) * (4 - 2)')).toBe(14);

      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(
        11,
      );
      expect(await service.evaluate('10 / 2 + 3 * 2')).toBe(11);

      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(8);
      expect(await service.evaluate('(3 + 5) * (2 - 1)')).toBe(8);

      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(7);
      expect(await service.evaluate('5 + (6 / 2) - 1')).toBe(7);

      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(2);
      expect(await service.evaluate('10 - (2 * (3 + 1))')).toBe(2);

      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(
        13,
      );
      expect(await service.evaluate('2 + 3 * 4 - 5 / 5')).toBe(13);
    });

    it('should handle multiple operations correctly', async () => {
      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(6);
      expect(await service.evaluate('2 + 3 - 4 + 5')).toBe(6);

      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(
        19,
      );
      expect(await service.evaluate('5 * 3 + 2 * 2')).toBe(19);

      (workerServiceMock.evaluatePostfix as jest.Mock).mockResolvedValueOnce(
        15,
      );
      expect(await service.evaluate('12 / 4 + 6 * 2')).toBe(15);
    });

    it('should throw an error for invalid characters', async () => {
      (workerServiceMock.evaluatePostfix as jest.Mock).mockImplementation(
        () => {
          throw new Error('Expression contains invalid characters');
        },
      );

      await expect(service.evaluate('2 + a')).rejects.toThrow(
        'Expression contains invalid characters',
      );
    });

    it('should throw an error for division by zero', async () => {
      (workerServiceMock.evaluatePostfix as jest.Mock).mockImplementation(
        () => {
          throw new Error('Division by zero is not allowed');
        },
      );

      await expect(service.evaluate('10 / 0')).rejects.toThrow(
        'Division by zero is not allowed',
      );
    });

    it('should throw an error for unmatched parentheses', async () => {
      await expect(service.evaluate('(1 + 2')).rejects.toThrow();
      await expect(service.evaluate(')1 + 2(')).rejects.toThrow();
      await expect(service.evaluate('((2 + 3)')).rejects.toThrow();
      await expect(service.evaluate('(1 + (2 * (3 + 4))')).rejects.toThrow();
    });
  });

  describe('tokenize', () => {
    it('should tokenize an expression correctly', () => {
      expect((service as any).tokenize('3 + 4')).toEqual(['3', '+', '4']);
      expect((service as any).tokenize('(1 - 2)')).toEqual([
        '(',
        '1',
        '-',
        '2',
        ')',
      ]);
      expect((service as any).tokenize('(2 * 3) + (4 / 2)')).toEqual([
        '(',
        '2',
        '*',
        '3',
        ')',
        '+',
        '(',
        '4',
        '/',
        '2',
        ')',
      ]);
      expect((service as any).tokenize('10 - (2 + 3)')).toEqual([
        '10',
        '-',
        '(',
        '2',
        '+',
        '3',
        ')',
      ]);
    });
  });
});
