import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LeadModule } from './lead/lead.module';
import { JwtModule } from '@nestjs/jwt';
import { CustomerModule } from './customer/customer.module';
import { InteractionModule } from './interaction/interaction.module';
import { ConversionHistoryModule } from './conversion-history/conversion-history.module';
import { SearchModule } from './search/search.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
		}),
		// TODO: Fix this. REgistering the module using registerAsync doesn't register it globally

		// JwtModule.registerAsync({
		// 	imports: [ConfigModule],
		// 	useFactory: async (configService: ConfigService) => {
		// 		return {
		// 			global: true,
		// 			secret: configService.get<string>('config.jwtSecret'), // using namespaced configs
		// 		};
		// 	},
		// 	inject: [ConfigService],
		// }),
		JwtModule.register({
			global: true,
			secret: process.env.JWT_ACCESS_SECRET,
		}),
		AuthModule,
		UserModule,
		LeadModule,
		CustomerModule,
		InteractionModule,
		ConversionHistoryModule,
		SearchModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
