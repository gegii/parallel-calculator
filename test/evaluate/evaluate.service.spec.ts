import { EvaluateService } from '../../src/evaluate/evaluate.service';

describe('EvaluateService', () => {
  let service: EvaluateService;

  beforeEach(() => {
    service = new EvaluateService();
  });

  describe('evaluate', () => {
    it('should evaluate a simple expression correctly', async () => {
      expect(await service.evaluate('2 + 3')).toBe(5);
      expect(await service.evaluate('10 - 2')).toBe(8);
      expect(await service.evaluate('4 * 2')).toBe(8);
      expect(await service.evaluate('8 / 2')).toBe(4);
    });

    it('should evaluate expressions with parentheses correctly', async () => {
      expect(await service.evaluate('(1 + 2) * 3')).toBe(9);
      expect(await service.evaluate('2 * (3 + 5)')).toBe(16);
      expect(await service.evaluate('(3 - 1) * (2 + 2)')).toBe(8);
      expect(await service.evaluate('((2 + 3) * 2) - 1')).toBe(9);
    });

    it('should evaluate complex expressions correctly', async () => {
      expect(await service.evaluate('2 + 3 * 4')).toBe(14);
      expect(await service.evaluate('(1 + (2 * 3)) * (4 - 2)')).toBe(14);
      expect(await service.evaluate('10 / 2 + 3 * 2')).toBe(11);
      expect(await service.evaluate('(3 + 5) * (2 - 1)')).toBe(8);
      expect(await service.evaluate('5 + (6 / 2) - 1')).toBe(7);
      expect(await service.evaluate('10 - (2 * (3 + 1))')).toBe(2);
      expect(await service.evaluate('2 + 3 * 4 - 5 / 5')).toBe(13);
    });

    it('should handle multiple operations correctly', async () => {
      expect(await service.evaluate('2 + 3 - 4 + 5')).toBe(6);
      expect(await service.evaluate('5 * 3 + 2 * 2')).toBe(19);
      expect(await service.evaluate('12 / 4 + 6 * 2')).toBe(15);
    });

    it('should throw an error for invalid characters', async () => {
      await expect(service.evaluate('2 + a')).rejects.toThrow(
        'Expression contains invalid characters',
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
