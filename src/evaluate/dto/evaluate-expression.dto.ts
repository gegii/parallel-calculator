import { IsNotEmpty, IsString } from 'class-validator';

export class EvaluateExpressionDto {
  @IsNotEmpty({ message: 'Expression is required' })
  @IsString({ message: 'Expression must be a string' })
  expression: string;
}
