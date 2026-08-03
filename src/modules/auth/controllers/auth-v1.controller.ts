import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginV1Request } from '../dtos/requests/login-v1.request';
import { RegisterV1Request } from '../dtos/requests/register-v1.request';
import { LoginV1Response } from '../dtos/responses/login-v1.response';
import { RegisterV1Response } from '../dtos/responses/register-v1.response';
import { AuthV1Service } from './../services/auth-v1.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Public } from '../../../shared/decorators/public.decorator';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthV1Controller {
  constructor(
    private readonly authV1Service: AuthV1Service
  ) { }

  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: RegisterV1Response })
  @Post('register')
  async register(
    @Body() request: RegisterV1Request
  ): Promise<RegisterV1Response> {
    const result = await this.authV1Service.register(request.name, request.email, request.password)
    return RegisterV1Response.MapEntity(result)
  }

  @Public()
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 201, description: 'User logged in successfully', type: LoginV1Response })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() request: LoginV1Request
  ): Promise<LoginV1Response> {
    const result = await this.authV1Service.login(request.email, request.password)
    return LoginV1Response.MapEntity(result)
  }
}