import { CreateColorDto } from './dto/create-color.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Color } from './color.entity';
import { ColorService } from './color.service';

@Controller('color')
export class ColorController {
  constructor(private colorService: ColorService) {}
  @Get()
  getCategories(): Promise<Color[]> {
    return this.colorService.getColors();
  }

  @Post()
  createCategory(@Body() createColorDto: CreateColorDto) {
    return this.colorService.createColor(createColorDto);
  }
}
