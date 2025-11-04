//npx ts-node -r tsconfig-paths/register scripts/weights.seed.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Role } from 'libs/organisation/src/entities/roles.entity';
import { Question } from '../src/questions/entities/question.entity';
import { Weight } from '../src/weights/entities/weights.entity';

//ROL GRUPLAMALARI ÇÜNKÜ EXCELDEKİ İLE DEĞERLENDİRME PDFLERİNDEKİ ROLLER UYMUYOR
const ROLE_MAPPINGS = {
  Şef: ['Teknik Şef', 'İdari Şef'],
  Müdür: ['Müdür İdari', 'Müdür Teknik', 'Genel Müdür'],
  'İdari Personel': [
    'İdari Personel',
    'Operatör',
    'İnsan Kaynakları',
    'Avukat',
    'Hukuk Müşaviri',
  ],
  Direktör: ['Direktör'],
  Koordinatör: ['Saha Koordinatörü', 'Proje Yöneticisi', 'Danışman'],
  'Teknik Personel': ['Teknik Personel'],
  Uzman: ['Teknik Uzman', 'İdari Uzman'],
  'Uzman Yardımcısı': ['Teknik Uzman Yardımcısı', 'İdari Uzman Yardımcısı'],
};

//HER ROL SETİ İÇİN KATSAYILAR(TEK TEK EXCEL SHEETSTEN)
const WEIGHT_SETS = {
  Şef: [2, 1, 1, 2, 0.5, 2, 1, 2, 2, 2, 1, 0.5, 0.5, 1, 1, 1, 1, 0.5, 1, 2],
  Müdür: [
    1, 1, 2, 2, 0.5, 0.5, 2, 0.5, 1, 0.5, 1.5, 1, 1, 1, 2, 2, 0.5, 1, 2, 2,
  ],
  Direktör: [
    0.5, 0.5, 1, 2, 2, 0.5, 1, 0.5, 1.5, 1, 2, 0.5, 2, 2, 1.5, 1, 0.5, 2, 1, 2,
  ],
  'İdari Personel': [
    2, 2, 1.5, 2, 0.5, 2, 1, 1.5, 2, 2, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 2, 0.5,
    2,
  ],
  Koordinatör: [
    1, 1, 2, 2, 2, 0.5, 1, 2, 0.5, 0.5, 2, 1, 1, 1, 2, 0.5, 0.5, 1, 1.5, 2,
  ],
  'Teknik Personel': [
    1.5, 2, 1, 2, 0.5, 2, 2, 2, 1.5, 2, 0.5, 1, 0.5, 0.5, 0.5, 0.5, 1, 1.5, 0.5,
    2,
  ],
  Uzman: [1, 2, 1, 2, 0.5, 2, 2, 2, 2, 2, 0.5, 1.5, 0.5, 1, 1, 1, 2, 0.5, 1, 2],
  'Uzman Yardımcısı': [
    1.5, 2, 2, 2, 0.5, 0.5, 0.5, 1, 1.5, 1, 0.5, 2, 0.5, 1, 1, 2, 2, 1, 0.5, 2,
  ],
};

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const roleRepo = dataSource.getRepository(Role);
  const questionRepo = dataSource.getRepository(Question);
  const weightRepo = dataSource.getRepository(Weight);

  const questions = await questionRepo.find();
  if (questions.length !== 20) {
    console.warn(
      `Question count mismatch: found ${questions.length}, expected 20`,
    );
  }

  for (const [baseRole, roleNames] of Object.entries(ROLE_MAPPINGS)) {
    const weights = WEIGHT_SETS[baseRole];
    if (!weights) {
      console.warn(`No weight set found for ${baseRole}`);
      continue;
    }

    for (const name of roleNames) {
      const role = await roleRepo.findOne({ where: { name } });
      if (!role) {
        console.warn(`Role not found: ${name}`);
        continue;
      }

      console.log(`⏳ Seeding weights for role: ${name}`);

      for (let i = 0; i < weights.length; i++) {
        const question = questions.find((q) => q.orderNo === i + 1);
        if (!question) continue;

        const existing = await weightRepo.findOne({
          where: { role: { id: role.id }, question: { id: question.id } },
          // relations'a gerek yok, sadece id'leri kullanıyoruz
        });

        // Yeni kayıt mı oluşturulacak yoksa mevcut kayıt mı güncellenecek?
        let weightEntity: Weight;

        if (existing) {
          // 1. Mevcut kayıt varsa: Güncelle
          existing.weight = weights[i];
          weightEntity = existing;
        } else {
          // 2. Mevcut kayıt yoksa: Yeni oluştur
          weightEntity = weightRepo.create({
            role,
            question,
            weight: weights[i],
          });
        }

        // Kayıt ekleme veya güncelleme işlemini tek bir satırda yapın.
        await weightRepo.save(weightEntity);
      }
      console.log(`✅ ${name} weight seeding complete!`);
    }
  }

  console.log('All weights seeded successfully!');
  await app.close();
}

bootstrap();
