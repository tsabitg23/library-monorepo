import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthorsModule } from './authors/authors.module';
import { PublishersModule } from './publishers/publishers.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { BookInventoryModule } from './book-inventory/book-inventory.module';
import { AuthModule } from './auth/auth.module';
import { BorrowsModule } from './borrows/borrows.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_NAME', 'myapp'),
        // Auto-load all entities from this pattern
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // Never use synchronize in production - use migrations instead
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    // ObserveModule.forRoot({
    //   appKey: 'YOUR_APP_KEY',
    //   appSecret: 'YOUR_APP_SECRET',
    //   serviceId: 'api',
    // }),
    AuthorsModule,
    PublishersModule,
    TagsModule,
    UsersModule,
    BooksModule,
    BookInventoryModule,
    AuthModule,
    BorrowsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
