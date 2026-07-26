import { ApiTags } from '@nestjs/swagger';
import { LoginV1Request } from '../dtos/requests/login-v1.request';
import { RegisterV1Request } from '../dtos/requests/register-v1.request';
import { LoginV1Response } from '../dtos/responses/login-v1.response';
import { RegisterV1Response } from '../dtos/responses/register-v1.response';
import { AuthV1Service } from './../services/auth-v1.service';
import { Body, Controller, Post } from "@nestjs/common";

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthV1Controller {
  constructor(
    private readonly AuthV1Service: AuthV1Service
  ) { }

  @Post('register')
  async register(
    @Body() request: RegisterV1Request
  ): Promise<RegisterV1Response> {
    const result = await this.AuthV1Service.register(request.name, request.email, request.password)
    return RegisterV1Response.MapEntity(result)
  }

  @Post('login')
  async login(
    @Body() request: LoginV1Request
  ): Promise<LoginV1Response> {
    const result = await this.AuthV1Service.login(request.email, request.password)
    return LoginV1Response.MapEntity(result)
  }
}