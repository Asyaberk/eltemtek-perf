// npx ts-node -r tsconfig-paths/register scripts/seed.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UserRepository } from '../src/users/repositories/users.repository';

// NOT: Lütfen dosyalarınızın 'seed/' klasörü altında bu isimlerde olduğundan emin olun
const OLD_USERS_PATH = 'seed/old_users.xlsx'; // Şeflik/Müdürlük içeren
const NEW_USERS_PATH = 'seed/new_users.xlsx'; // Kıdem/Yönetici içeren

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepo = app.get(UserRepository);

  // YENİ: Temizleme Adımı
  console.log(
    '--- Veritabanındaki tüm kullanıcı kayıtları temizleniyor... (TRUNCATE) ---',
  );
  await userRepo.clearAllUsers(); // UserRepository'ye eklediğimiz metot çağrıldı

  console.log('Veri birleştirme ve içe aktarma scripti başlatılıyor...');

  // Güncellenen: İki dosyayı da işleyecek olan yeni metodu çağır
  const result = await userRepo.importAndMergeExcelData(
    OLD_USERS_PATH,
    NEW_USERS_PATH,
  );

  console.log(`\n✅ İşlem başarıyla tamamlandı.`);
  console.log(`- ${result.upserted} kullanıcı güncellendi/oluşturuldu.`);
  console.log(`- ${result.linked} yönetici ilişkisi kuruldu.`);
  await app.close();
}
bootstrap();
