import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/users.entity';
import { AppConfigModule } from '@app/config';
import { HealthController } from './health.controller';
import { Department, Tesis, Seflik, Mudurluk, Role, OrganisationModule } from 'libs/organisation/src';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { Question } from './questions/entities/question.entity';
import { WeightsModule } from './weights/weights.module';
import { Weight } from './weights/entities/weights.entity';

@Module({
  imports: [

    //ConfigModule.forRoot({ isGlobal: true }),
    //i made my own config lib
    AppConfigModule,

    //postgre connection
    TypeOrmModule.forRoot({
      type: 'postgres' as const,
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      synchronize: true,
      database: process.env.DB_DATABASE,
      entities: [
        User,
        Role,
        Department,
        Tesis,
        Seflik,
        Mudurluk, 
        Question,
        Weight
      ],
    }),
    //docker compose up -d --build
    //docker ps
    //docker logs -f nestjs-project-app
    //docker compose down

    UsersModule,
    AuthModule,
    OrganisationModule,
    QuestionsModule,
    WeightsModule
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
