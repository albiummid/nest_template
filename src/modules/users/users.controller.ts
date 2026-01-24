import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/common/controllers/base.controller';
import { PrivateController } from 'src/common/controllers/private.controller';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from 'src/common/decorators/api-response.decorator';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserBasicInfoDto } from './dto/update-user-basic-info.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController extends PrivateController {
  @Inject()
  private readonly usersService: UsersService;

  @Get()
  @ApiProduces('application/json')
  @ApiPaginatedResponse(UserEntity)
  @HttpCode(200)
  async findAll(
    @Query() query: FilterUserDto,
  ): Promise<SuccessResponse<UserEntity[]>> {
    const result = await this.usersService.findMany(query);
    return this.successResponse(result, 'Data fetched successfully');
  }

  @Patch('update-basic-info/:id')
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiProduces('application/json')
  @ApiSuccessResponse(UserEntity)
  @HttpCode(200)
  async updateBasicInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserBasicInfoDto: UpdateUserBasicInfoDto,
  ) {
    const result = await this.usersService.updateUserBasicInfo(
      id,
      updateUserBasicInfoDto,
    );
    return this.successResponse(result, 'Data updated successfully');
  }
}
