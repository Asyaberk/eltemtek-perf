//user xlsx okuyacak sonra hele column için unique deer çıkarıp organizatiındaki tablolara ekleyecek.
//npx ts-node -r tsconfig-paths/register scripts/organization.seed.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import {Department, Role, Tesis, Seflik, Mudurluk} from 'libs/organisation/src';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  // Repositories
  const deptRepo = dataSource.getRepository(Department);
  const roleRepo = dataSource.getRepository(Role);
  const tesisRepo = dataSource.getRepository(Tesis);
  const seflikRepo = dataSource.getRepository(Seflik);
  const mudurlukRepo = dataSource.getRepository(Mudurluk);

  // Departments
  const departments = [
    'EKAT Şefliği',
    'Denetim ve Test Hizmetleri Şefliği',
    'İletim Tesisleri İşletme Bakım Şefliği',
    'Çevre ve Enerji Verimliliği Şefliği',
    'İdari İşler Şefliği Merkez',
    'İSG Şefliği',
    'EİH Etüt ve Proje Şefliği',
    'Bilişim Teknolojileri ve Teknik Hizmetler Direktörlüğü',
    'Genel Müdürlük',
    'KYS Şefliği',
    'Mali İşler Müdürlüğü',
    'Harita Hizmetleri Şefliği',
    'Yenilenebilir Enerji ve Elektrik Dağıtım Tesisleri Şefliği',
    'Donanım ve Teknik Destek Şefliği',
    'Enerji Teknolojileri ve Yazılım Müdürlüğü',
    'İnsan Kaynakları Şefliği',
    'Teklif ve Satın Alma Müdürlüğü',
    'Özel Kalem ve Kurumsal İletişim Müdürlüğü',
    'Harita Müdürlüğü',
    'İdari İşler Şefliği İstanbul',
    'İnsan Kaynakları ve İdari İşler Direktörlüğü',
    'Enerji ve İletim Tesisleri Müdürlüğü',
    'Yenilenebilir Enerji ve Elektrik Dağıtım Tesisleri Müdürlüğü',
    'Eğitim Şefliği',
    'Muhasebe ve Bütçe Şefliği',
    'Satın Alma Şefliği',
    'İnsan Kaynakları Müdürlüğü',
    'Hukuk Müşavirliği',
    'Trafo ve Üretim Tesisleri Müdürlüğü',
    'Denetim ve Test Hizmetleri Müdürlüğü',
    'İSG, Çevre ve Enerji Verimliliği Müdürlüğü',
    'Teklif ve Sözleşmeler Şefliği',
    'Strateji ve Proje Yönetim Şefliği',
    'Kurumsal Gelişim Direktörlüğü',
    'Trafo ve Üretim Tesisleri Şefliği',
  ];

  const roles = [
    'Teknik Şef',
    'Teknik Personel',
    'Teknik Uzman',
    'İdari Uzman',
    'Direktör',
    'Danışman',
    'İdari Personel',
    'Müdür İdari',
    'Teknik Uzman Yardımcısı',
    'İdari Şef',
    'Proje Yöneticisi',
    'Müdür Teknik',
    'İdari Uzman Yardımcısı',
    'Saha Koordinatörü',
    'Avukat',
    'Operatör',
    'Genel Müdür',
    'Hukuk Müşaviri',
  ];

  const tesisler = ['MERKEZ ANKARA', 'İST.OFİS', 'ESKİŞEHİR'];

  const seflikler = [
    'EKAT Şefliği',
    'Denetim ve Test Hizmetleri Şefliği',
    'İletim Tesisleri İşletme Bakım Şefliği',
    'Çevre ve Enerji Verimliliği Şefliği',
    'İdari İşler Şefliği Merkez',
    'İSG Şefliği',
    'EİH Etüt ve Proje Şefliği',
    'KYS Şefliği',
    'Harita Hizmetleri Şefliği',
    'Yenilenebilir Enerji ve Elektrik Dağıtım Tesisleri Şefliği',
    'Donanım ve Teknik Destek Şefliği',
    'İnsan Kaynakları Şefliği',
    'İdari İşler Şefliği İstanbul',
    'Eğitim Şefliği',
    'Muhasebe ve Bütçe Şefliği',
    'Satın Alma Şefliği',
    'Teklif ve Sözleşmeler Şefliği',
    'Strateji ve Proje Yönetim Şefliği',
    'Trafo ve Üretim Tesisleri Şefliği',
  ];

  const mudurlukler = [
    'Enerji ve İletim Tesisleri Müdürlüğü',
    'Denetim ve Test Hizmetleri Müdürlüğü',
    'İSG, Çevre ve Enerji Verimliliği Müdürlüğü',
    'İnsan Kaynakları Müdürlüğü',
    'Harita Müdürlüğü',
    'Mali İşler Müdürlüğü',
    'Yenilenebilir Enerji ve Elektrik Dağıtım Tesisleri Müdürlüğü',
    'Enerji Teknolojileri ve Yazılım Müdürlüğü',
    'Teklif ve Satın Alma Müdürlüğü',
    'Özel Kalem ve Kurumsal İletişim Müdürlüğü',
    'Hukuk Müşavirliği',
    'Trafo ve Üretim Tesisleri Müdürlüğü',
  ];

  // Save helpers
  async function saveUnique<T>(repo, field: string, values: string[]) {
    for (const v of values) {
      const exists = await repo.findOne({ where: { [field]: v } });
      if (!exists) {
        await repo.save({ [field]: v });
      }
    }
  }

  await saveUnique(deptRepo, 'department_name', departments);
  await saveUnique(roleRepo, 'name', roles);
  await saveUnique(tesisRepo, 'tesis_name', tesisler);
  await saveUnique(seflikRepo, 'seflik_name', seflikler);
  await saveUnique(mudurlukRepo, 'mudurluk_name', mudurlukler);

  console.log('✅ Organisation seed completed!');
  await app.close();
}

bootstrap();