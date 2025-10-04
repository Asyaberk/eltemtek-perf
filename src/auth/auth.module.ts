import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from '../users/repositories/users.repository';
import { OrganisationModule } from 'libs/organisation/src';
import { RolesGuard } from 'src/guards/roles.guard';

@Module({
  //import jwt
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'cat',
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule,
    OrganisationModule,
  ],
  controllers: [AuthController],
  //we import to provider because we put guard and jwtstrategy is injectable
  providers: [AuthService, JwtStrategy, UserRepository, RolesGuard],
})
export class AuthModule {}
