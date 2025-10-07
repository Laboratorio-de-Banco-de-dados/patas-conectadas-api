import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { AdoptersService } from './adopter.service';
import { CreateAdopterDto } from './create-adopter.dto';
import { UpdateAdopterDto } from './update-adopter.dto';

@Controller('adopters')
export class AdoptersController {
  constructor(private readonly adoptersService: AdoptersService) {}

  @Get()
  findAll() {
    return this.adoptersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adoptersService.findOne(id);
  }

  @Post()
  create(@Body() createAdopterDto: CreateAdopterDto) {
    return this.adoptersService.create(createAdopterDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdopterDto: UpdateAdopterDto,
  ) {
    return this.adoptersService.update(id, updateAdopterDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adoptersService.remove(id);
  }
}
