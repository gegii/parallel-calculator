import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { EvaluateService } from './evaluate.service';
import { EvaluateExpressionDto } from './dto/evaluate-expression.dto';

@Controller('evaluate')
export class EvaluateController {
  constructor(private readonly evaluateService: EvaluateService) {}

  @Post()
  async evaluateExpression(
    @Body() evaluateExpressionDto: EvaluateExpressionDto,
  ) {
    const { expression } = evaluateExpressionDto;

    try {
      const result = await this.evaluateService.evaluate(expression);
      return { result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
