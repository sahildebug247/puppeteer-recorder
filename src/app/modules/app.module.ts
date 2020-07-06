import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AppController from '../controllers/app.controller';
import AppService from '../services/app.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
