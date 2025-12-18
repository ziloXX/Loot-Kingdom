import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';
import { CouponsModule } from './coupons/coupons.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [ProductsModule, AuthModule, CartModule, OrdersModule, AdminModule, CouponsModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
